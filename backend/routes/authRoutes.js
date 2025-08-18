import express from 'express';
import {
  createSession,
  verifyStudent,
  confirmVerification,
  getVerificationStatus,
  revokeVerification,
  addTestStudents
} from '../controllers/authController.js';

const router = express.Router();

// Student verification routes
router.post('/create-session', createSession);
router.post('/verify-student', verifyStudent);
router.post('/confirm-verification', confirmVerification);
router.get('/verification-status/:chatId', getVerificationStatus);
router.post('/revoke-verification', revokeVerification);

// Development/testing routes
router.post('/add-test-students', addTestStudents);

export default router;
