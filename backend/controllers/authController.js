import asyncHandler from "express-async-handler";
import Student from '../models/studentModel.js';
import crypto from 'crypto';

// Store active verification sessions (in production, use Redis)
const activeSessions = new Map();
const verificationTokens = new Map();

// Clean up expired sessions
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(token);
    }
  }
  for (const [token, verification] of verificationTokens.entries()) {
    if (verification.expiresAt < now) {
      verificationTokens.delete(token);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

// @desc    Create verification session
// @route   POST /api/auth/create-session
// @access  Public (called by bot)
export const createSession = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  
  if (!chatId) {
    res.status(400);
    throw new Error('Chat ID is required');
  }
  
  // Generate session token
  const sessionToken = crypto.randomBytes(32).toString('hex');
  
  // Store session in backend's activeSessions map
  activeSessions.set(sessionToken, {
    chatId: chatId,
    userId: userId,
    timestamp: Date.now(),
    expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
  });
  
  res.status(200).json({
    sessionToken: sessionToken,
    expiresAt: Date.now() + (15 * 60 * 1000)
  });
});

// @desc    Verify student credentials
// @route   POST /api/auth/verify-student
// @access  Public
export const verifyStudent = asyncHandler(async (req, res) => {
  const { fullName, indexNumber, chatId, sessionToken } = req.body;

  // Validate input
  if (!fullName || !indexNumber || !chatId || !sessionToken) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Validate session token
  const session = activeSessions.get(sessionToken);
  if (!session || session.expiresAt < Date.now()) {
    res.status(400);
    throw new Error('Invalid or expired session');
  }

  // Handle chatId type conversion (form sends string, bot stores number)
  if (session.chatId != chatId) {
    res.status(400);
    throw new Error('Session mismatch');
  }

  // Verify student against database
  const verificationResult = await Student.verifyStudent(fullName, indexNumber);

  if (!verificationResult.verified) {
    res.status(404).json({
      verified: false,
      message: verificationResult.message
    });
    return;
  }

  const student = verificationResult.student;

  // Generate verification token for Telegram redirect
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  // Store verification token
  verificationTokens.set(verificationToken, {
    studentId: student._id,
    studentInfo: {
      name: student.fullName,
      indexNumber: student.indexNumber,
      department: student.department
    },
    chatId: chatId,
    sessionToken: sessionToken,
    expiresAt: Date.now() + (30 * 60 * 1000), // 30 minutes
    verified: true
  });

  // Update student record
  student.isVerifiedForSafebot = true;
  student.lastVerificationDate = new Date();
  student.telegramChatId = chatId;
  student.verificationToken = verificationToken;
  student.verificationTokenExpiry = new Date(Date.now() + (30 * 60 * 1000));
  
  await student.save();

  // Clear the session as it's no longer needed
  activeSessions.delete(sessionToken);

  res.status(200).json({
    verified: true,
    studentName: student.fullName,
    verificationToken: verificationToken,
    message: 'Student verification successful'
  });
});

// @desc    Confirm verification from Telegram
// @route   POST /api/auth/confirm-verification
// @access  Public
export const confirmVerification = asyncHandler(async (req, res) => {
  const { verificationToken, chatId, userId } = req.body;

  if (!verificationToken || !chatId) {
    res.status(400);
    throw new Error('Verification token and chat ID are required');
  }

  // Check verification token
  const verification = verificationTokens.get(verificationToken);
  
  if (!verification || verification.expiresAt < Date.now()) {
    res.status(400).json({
      verified: false,
      message: 'Invalid or expired verification token'
    });
    return;
  }

  if (verification.chatId !== chatId) {
    res.status(400).json({
      verified: false,
      message: 'Chat ID mismatch'
    });
    return;
  }

  // Update student with Telegram user ID
  try {
    const student = await Student.findById(verification.studentId);
    if (student) {
      student.telegramUserId = userId?.toString();
      await student.save();
    }
  } catch (error) {
    console.error('Error updating student Telegram ID:', error);
  }

  // Return verification success
  res.status(200).json({
    verified: true,
    studentInfo: verification.studentInfo,
    message: 'Verification confirmed successfully'
  });

  // Clean up verification token after successful use
  verificationTokens.delete(verificationToken);
});

// @desc    Get student verification status
// @route   GET /api/auth/verification-status/:chatId
// @access  Public
export const getVerificationStatus = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const student = await Student.findOne({ 
    telegramChatId: chatId,
    isVerifiedForSafebot: true 
  });

  if (!student) {
    res.status(404).json({
      verified: false,
      message: 'No verified student found for this chat'
    });
    return;
  }

  res.status(200).json({
    verified: true,
    studentInfo: {
      name: student.fullName,
      indexNumber: student.indexNumber,
      department: student.department,
      lastVerificationDate: student.lastVerificationDate
    }
  });
});

// @desc    Revoke student verification
// @route   POST /api/auth/revoke-verification
// @access  Public (should be protected in production)
export const revokeVerification = asyncHandler(async (req, res) => {
  const { chatId, indexNumber } = req.body;

  let query = {};
  if (chatId) query.telegramChatId = chatId;
  if (indexNumber) query.indexNumber = indexNumber.toUpperCase();

  if (Object.keys(query).length === 0) {
    res.status(400);
    throw new Error('Please provide either chat ID or index number');
  }

  const student = await Student.findOne(query);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Revoke verification
  student.isVerifiedForSafebot = false;
  student.telegramUserId = undefined;
  student.telegramChatId = undefined;
  student.verificationToken = undefined;
  student.verificationTokenExpiry = undefined;

  await student.save();

  res.status(200).json({
    success: true,
    message: `Verification revoked for ${student.fullName}`
  });
});

// @desc    Add test students for verification testing
// @route   POST /api/auth/add-test-students
// @access  Public (should be protected in production)
export const addTestStudents = asyncHandler(async (req, res) => {
  const testStudents = [
    {
      fullName: "John Kwame Asante",
      indexNumber: "BCS/21/001",
      department: "Computer Science",
      yearOfAdmission: 2021,
      programLevel: "Bachelor",
      email: "john.asante@umat.edu.gh",
      status: "Active"
    },
    {
      fullName: "Sarah Akosua Mensah",
      indexNumber: "ENG/20/045",
      department: "Electrical Engineering",
      yearOfAdmission: 2020,
      programLevel: "Bachelor",
      email: "sarah.mensah@umat.edu.gh",
      status: "Active"
    }
  ];

  try {
    // Clear existing test data
    await Student.deleteMany({
      indexNumber: { $in: testStudents.map(s => s.indexNumber) }
    });

    // Add new test data
    const createdStudents = await Student.insertMany(testStudents);

    res.status(201).json({
      success: true,
      message: `Added ${createdStudents.length} test students`,
      students: createdStudents.map(s => ({
        name: s.fullName,
        indexNumber: s.indexNumber,
        department: s.department
      })),
      note: "These are the two test student accounts for verification testing"
    });

  } catch (error) {
    res.status(400);
    throw new Error(`Error adding test students: ${error.message}`);
  }
});
