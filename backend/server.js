import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
// import authRoutes from "./routes/authRoutes.js"; // Temporarily disabled
import testRoutes from "./routes/testRoutes.js";
import createBot from "./bot/bot.js";

console.log("Starting Safebot server...");
console.log("Environment variables loaded.");

const port = process.env.PORT || 5000;
console.log(`Server will run on port ${port}.`);

// Connect to MongoDB
console.log("Connecting to MongoDB...");
const dbConnected = await connectDB();
if (!dbConnected) {
  console.error("Database connection failed. Server cannot start.");
  process.exit(1);
}
console.log("Database connection successful.");

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173", // dev frontend
  "http://localhost:3000", // local auth gateway
  "https://f364f5d61890.ngrok-free.app", // ngrok auth gateway
  "https://umat-chatbot-frontend.onrender.com", // deployed frontend
  process.env.AUTH_GATEWAY_URL, // dynamic auth gateway URL
  process.env.FRONTEND_URL, // dynamic frontend URL
].filter(Boolean); // Remove any undefined values

app.use(
  cors({
    origin: true, // Allow all origins for now
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes - MUST come before static serving to avoid conflicts
app.use("/api/admin", adminRoutes);
app.use("/api/incidents", incidentRoutes);

// Test route to verify server is working
app.get("/api/test-route", (req, res) => {
  res.json({
    message: "Server is working",
    timestamp: new Date().toISOString(),
  });
});

// Test auth routes directly (bypassing authRoutes for now)
app.get("/api/auth/config", (req, res) => {
  console.log("Config route hit!");
  res.json({
    botUsername: process.env.TELEGRAM_BOT_USERNAME || "IamUmat_bot",
    backendUrl: process.env.BACKEND_URL || "http://localhost:5000",
  });
});

// Add create-session route
app.post("/api/auth/create-session", (req, res) => {
  try {
    const { chatId, userId } = req.body;
    console.log("Creating session for:", { chatId, userId });

    // Generate session token
    const sessionToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    res.json({
      success: true,
      sessionToken,
      chatId,
      userId,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
  } catch (error) {
    console.error("Session creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during session creation",
    });
  }
});

// Add verify-student route directly
app.post("/api/auth/verify-student", async (req, res) => {
  try {
    const { fullName, indexNumber, chatId, sessionToken } = req.body;

    // Import Student model dynamically
    const { default: Student } = await import("./models/studentModel.js");

    // Find student in database
    const student = await Student.findOne({
      fullName: { $regex: new RegExp(`^${fullName}$`, "i") },
      indexNumber: indexNumber.toUpperCase(),
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found. Please check your name and index number.",
      });
    }

    // Generate verification token
    const verificationToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    res.json({
      success: true,
      verified: true,
      message: "Student verified successfully!",
      studentName: student.fullName,
      student: {
        fullName: student.fullName,
        indexNumber: student.indexNumber,
        department: student.department,
      },
      verificationToken,
      chatId,
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
});

// Add confirm-verification route
app.post("/api/auth/confirm-verification", async (req, res) => {
  try {
    const { verificationToken, chatId, userId } = req.body;
    console.log("Confirming verification for:", {
      verificationToken,
      chatId,
      userId,
    });

    // In a real implementation, you would validate the token against a database
    // For now, we'll accept any token and return success
    res.json({
      verified: true,
      studentInfo: {
        name: "John Kwame Asante", // This would come from the database
        indexNumber: "BCS/21/001",
        department: "Computer Science",
        chatId: chatId,
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Verification confirmation error:", error);
    res.status(500).json({
      verified: false,
      message: "Server error during verification confirmation",
    });
  }
});

// Temporarily disable authRoutes to avoid import issues
// app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

// Serve auth gateway for /auth/verify specifically (for the SPA)
app.get("/auth/verify", (req, res) => {
  res.sendFile("index.html", { root: "../auth-gateway", absolute: true });
});

// Serve other auth gateway static files (CSS, JS, etc.)
app.use("/auth", express.static("../auth-gateway"));

// Root route for Telegram auth callback
app.get("/", (req, res) => {
  const { chat_id, session } = req.query;

  if (chat_id && session) {
    // This is a Telegram auth callback - redirect to the auth gateway with the same query params
    res.redirect(`/auth/verify?chat_id=${chat_id}&session=${session}`);
  } else {
    // Just a regular root path access
    res.send("Safebot API is running");
  }
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`✅ Server is live and listening on port ${port}`)
);

// Only start bot if token is configured
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (BOT_TOKEN) {
  console.log("Telegram bot token found. Creating and launching bot...");
  try {
    const bot = createBot();
    bot
      .launch()
      .then(() => console.log("✅ Telegram bot is running!"))
      .catch((err) => console.error(`❌ Bot launch failed: ${err.message}`));
  } catch (err) {
    console.error(`❌ Bot creation failed: ${err.message}`);
  }
} else {
  console.warn("⚠️ Telegram bot token not configured. Skipping bot launch.");
}
