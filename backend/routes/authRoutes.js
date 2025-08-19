import express from "express";
import {
  createSession,
  verifyStudent,
  confirmVerification,
  getVerificationStatus,
  revokeVerification,
  addTestStudents,
} from "../controllers/authController.js";

const router = express.Router();

// Student verification routes
router.post("/create-session", createSession);
router.post("/verify-student", verifyStudent);
router.post("/confirm-verification", confirmVerification);
router.get("/verification-status/:chatId", getVerificationStatus);
router.post("/revoke-verification", revokeVerification);

// GET route for /auth/verify (handles Telegram callback)
router.get("/verify", (req, res) => {
  const { chat_id, session } = req.query;

  res.json({
    success: true,
    chat_id,
    session,
  });
});

// GET route for configuration (for auth gateway)
router.get("/config", (req, res) => {
  res.json({
    botUsername: process.env.TELEGRAM_BOT_USERNAME || "UMaT_safebot",
    backendUrl: process.env.BACKEND_URL || "http://localhost:5000",
  });
});

// Development/testing routes
router.post("/add-test-students", addTestStudents);

export default router;
