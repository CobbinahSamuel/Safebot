import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Store active sessions for testing (same as in authController)
const activeSessions = new Map();

// @desc    Create test verification session
// @route   POST /api/test/create-session
// @access  Public (testing only)
router.post('/create-session', (req, res) => {
  const { chatId } = req.body;
  
  const sessionToken = crypto.randomBytes(32).toString('hex');
  activeSessions.set(sessionToken, {
    chatId: chatId || '12345',
    userId: 'test-user',
    timestamp: Date.now(),
    expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
  });

  const authUrl = `http://localhost:3000?chat_id=${chatId || '12345'}&session=${sessionToken}`;

  res.status(200).json({
    success: true,
    sessionToken,
    authUrl,
    testCredentials: {
      fullName: "John Kwame Asante",
      indexNumber: "BCS/21/001"
    }
  });
});

// @desc    Test verification flow
// @route   GET /api/test/verify-demo
// @access  Public (testing only)
router.get('/verify-demo', (req, res) => {
  res.json({
    message: "🎓 UMaT SAFEBOT Verification Demo",
    availableStudents: [
      {
        fullName: "John Kwame Asante",
        indexNumber: "BCS/21/001",
        department: "Computer Science"
      },
      {
        fullName: "Sarah Akosua Mensah", 
        indexNumber: "ENG/20/045",
        department: "Electrical Engineering"
      },
      {
        fullName: "Michael Kofi Osei",
        indexNumber: "MIN/19/023", 
        department: "Mining Engineering"
      }
    ],
    instructions: [
      "1. Create a session: POST /api/test/create-session",
      "2. Use the authUrl to access verification form",
      "3. Enter student credentials from the list above",
      "4. Complete verification and return to Telegram"
    ]
  });
});

export default router;
