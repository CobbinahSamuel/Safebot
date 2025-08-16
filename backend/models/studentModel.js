import mongoose from "mongoose";

// Define the schema for UMaT students
const studentSchema = mongoose.Schema(
  {
    // Student's full name as registered
    fullName: {
      type: String,
      required: [true, "Please add the student's full name"],
      trim: true,
    },
    
    // Student's index number (unique identifier)
    indexNumber: {
      type: String,
      required: [true, "Please add the student's index number"],
      unique: true,
      trim: true,
      match: [
        /^[A-Z]{2,4}\/\d{2}\/\d{4}$/,
        "Please enter a valid index number format (e.g., BCS/21/001)",
      ],
    },
    
    // Academic program/department
    department: {
      type: String,
      trim: true,
    },
    
    // Year of admission
    yearOfAdmission: {
      type: Number,
    },
    
    // Program level (Bachelor's, Master's, PhD)
    programLevel: {
      type: String,
      enum: ["Bachelor", "Master", "PhD", "Diploma", "Certificate"],
      default: "Bachelor",
    },
    
    // Student status
    status: {
      type: String,
      enum: ["Active", "Graduated", "Suspended", "Deferred", "Withdrawn"],
      default: "Active",
    },
    
    // Contact information (optional)
    email: {
      type: String,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@umat\.edu\.gh$/,
        "Please enter a valid UMaT email address",
      ],
    },
    
    // Phone number (optional)
    phoneNumber: {
      type: String,
      trim: true,
    },
    
    // Verification status for SAFEBOT
    isVerifiedForSafebot: {
      type: Boolean,
      default: false,
    },
    
    // Last verification date
    lastVerificationDate: {
      type: Date,
    },
    
    // Telegram user ID (for linking)
    telegramUserId: {
      type: String,
      sparse: true, // Allow multiple null values
    },
    
    // Telegram chat ID
    telegramChatId: {
      type: String,
      sparse: true,
    },
    
    // Verification token (temporary)
    verificationToken: {
      type: String,
      sparse: true,
    },
    
    // Token expiry
    verificationTokenExpiry: {
      type: Date,
    },

  },
  { 
    timestamps: true,
    // Add indexes for better query performance
    indexes: [
      { indexNumber: 1 },
      { fullName: 1, indexNumber: 1 },
      { telegramUserId: 1 },
      { verificationToken: 1 }
    ]
  }
);

// Instance method to check if student is eligible for SAFEBOT
studentSchema.methods.isEligibleForSafebot = function() {
  return this.status === "Active" && (this.programLevel === "Bachelor" || this.programLevel === "Master" || this.programLevel === "PhD");
};

// Instance method to generate verification token
studentSchema.methods.generateVerificationToken = async function() {
  const crypto = await import('crypto');
  this.verificationToken = crypto.randomBytes(32).toString('hex');
  this.verificationTokenExpiry = new Date(Date.now() + (30 * 60 * 1000)); // 30 minutes
  return this.verificationToken;
};

// Instance method to verify student credentials
studentSchema.statics.verifyStudent = async function(fullName, indexNumber) {
  try {
    // Case-insensitive search for name and exact match for index number
    const student = await this.findOne({
      fullName: new RegExp(`^${fullName.trim()}$`, 'i'),
      indexNumber: indexNumber.trim().toUpperCase()
    });

    if (!student) {
      return { verified: false, message: "Student not found in UMaT records" };
    }

    if (!student.isEligibleForSafebot()) {
      return { verified: false, message: "Student status does not allow SAFEBOT access" };
    }

    return { verified: true, student };

  } catch (error) {
    console.error('Student verification error:', error);
    return { verified: false, message: "Verification service error" };
  }
};

// Pre-save middleware to format index number
studentSchema.pre("save", function (next) {
  if (this.indexNumber) {
    this.indexNumber = this.indexNumber.toUpperCase();
  }
  next();
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
