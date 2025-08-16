import express from 'express';
import {
  verifyStudent,
  confirmVerification,
  getVerificationStatus,
  revokeVerification,
  addSampleStudents
} from '../controllers/authController.js';

const router = express.Router();

// Student verification routes
router.post('/verify-student', verifyStudent);
router.post('/confirm-verification', confirmVerification);
router.get('/verification-status/:chatId', getVerificationStatus);
router.post('/revoke-verification', revokeVerification);

// Development/testing routes
router.post('/add-sample-students', addSampleStudents);

export default router;
