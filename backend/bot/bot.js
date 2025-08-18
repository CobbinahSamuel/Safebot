import { Telegraf, session } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";
import * as crypto from "crypto";

dotenv.config();

// Factory function to create bot after environment variables are loaded
function createBot() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
  }

  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

  // Enable session middleware
  bot.use(session());

  // Generate secure session token
  function generateSessionToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  // Store active sessions (in production, use Redis or database)
  const activeSessions = new Map();

  // ✅ Helper to make sure ctx.session always exists
  function ensureSession(ctx) {
    if (!ctx.session) ctx.session = {};
    return ctx.session;
  }

  // ✅ Reset session safely
  function resetSession(ctx) {
    ctx.session = {
      verified: false,
      state: null,
      incidentTitle: null,
      category: null,
      location: null,
      whenOccurred: null,
      detailedDescription: null,
      studentInfo: null,
    };
  }

  // ------------------------- START COMMAND -------------------------
  bot.start(async (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;
    const startPayload = ctx.startPayload;

    resetSession(ctx);

    // Returning user with verification token
    if (startPayload && startPayload.startsWith("verified_")) {
      const verificationToken = startPayload.replace("verified_", "");

      try {
        const response = await axios.post(
          `${process.env.BACKEND_URL}/api/auth/confirm-verification`,
          { verificationToken, chatId, userId }
        );

        if (response.data.verified) {
          ctx.session.verified = true;
          ctx.session.studentInfo = response.data.studentInfo;

          await ctx.reply(
            `✅ *Welcome back, ${response.data.studentInfo.name}!*\n\n` +
              `🎓 *UMaT Student Verified*\n` +
              `📚 Index: ${response.data.studentInfo.indexNumber}\n\n` +
              `You can now use SAFEBOT to report incidents securely.\n\n` +
              `*Available Commands:*\n` +
              `📝 /report - Submit an incident report\n` +
              `📊 /status - Check your reports\n` +
              `🆘 /emergency - Emergency contacts\n` +
              `ℹ️ /help - Get help`,
            { parse_mode: "Markdown" }
          );
          return;
        }
      } catch (error) {
        console.error("Verification confirmation error:", error);
      }
    }

    // Already verified
    if (ctx.session.verified) {
      await ctx.reply(
        `👋 *Welcome back to SAFEBOT!*\n\n` +
          `You're already verified as a UMaT student.\n\n` +
          `*Available Commands:*\n` +
          `📝 /report - Submit an incident report\n` +
          `📊 /status - Check your reports\n` +
          `🆘 /emergency - Emergency contacts\n` +
          `ℹ️ /help - Get help`,
        { parse_mode: "Markdown" }
      );
      return;
    }

    // New user - Create session
    try {
      const sessionResponse = await axios.post(
        `${process.env.BACKEND_URL}/api/auth/create-session`,
        { chatId, userId }
      );

      const sessionToken = sessionResponse.data.sessionToken;

      // fallback if backend didn’t provide token
      const finalToken = sessionToken || generateSessionToken();

      if (!sessionToken) {
        activeSessions.set(finalToken, {
          chatId,
          userId,
          timestamp: Date.now(),
          expiresAt: Date.now() + 15 * 60 * 1000,
        });
      }

      const authUrl = `${process.env.AUTH_GATEWAY_URL}?chat_id=${chatId}&session=${finalToken}`;

      await ctx.reply(
        `🛡️ *Welcome to UMaT SAFEBOT!*\n\n` +
          `🎓 *University of Mines and Technology*\n` +
          `🔒 *Campus Safety Reporting System*\n\n` +
          `To ensure secure reporting, we need to verify that you're a UMaT student.\n\n` +
          `*📋 Verification Process:*\n` +
          `1️⃣ Click the button below\n` +
          `2️⃣ Enter your student details\n` +
          `3️⃣ Return here to start reporting\n\n` +
          `*🔐 Your data is encrypted and secure*`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔍 Verify Student Status", url: authUrl }],
              [
                {
                  text: "❓ Why do I need to verify?",
                  callback_data: "why_verify",
                },
              ],
            ],
          },
        }
      );
    } catch (error) {
      console.error("Error creating session:", error);
      await ctx.reply(
        "⚠️ *Service Temporarily Unavailable*\n\n" +
          "Unable to start verification process right now. Please try again in a few minutes.",
        { parse_mode: "Markdown" }
      );
    }
  });

  // ------------------------- CALLBACK HANDLER -------------------------
  bot.on("callback_query", async (ctx) => {
    const callbackData = ctx.callbackQuery.data;

    if (callbackData === "why_verify") {
      await ctx.answerCbQuery();
      await ctx.reply(
        `🔐 *Why Student Verification is Required*\n\n` +
          `✅ *Security:* Ensures only UMaT students can report incidents\n` +
          `✅ *Authenticity:* Prevents false reports and spam\n` +
          `✅ *Privacy:* Protects your identity and campus safety\n` +
          `✅ *Trust:* Builds confidence in the reporting system\n\n` +
          `🎓 *Your student information is:*\n` +
          `• Encrypted and secure\n` +
          `• Only used for verification\n` +
          `• Never shared with third parties\n` +
          `• Complies with data protection standards\n\n` +
          `*Ready to verify your student status?*`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔍 Start Verification", callback_data: "start_verification" }],
            ],
          },
        }
      );
    }

    if (callbackData === "start_verification") {
      await ctx.answerCbQuery();
      const chatId = ctx.chat.id;
      const userId = ctx.from.id;
      const sessionToken = generateSessionToken();

      activeSessions.set(sessionToken, {
        chatId,
        userId,
        timestamp: Date.now(),
        expiresAt: Date.now() + 15 * 60 * 1000,
      });

      const authUrl = `${process.env.AUTH_GATEWAY_URL}?chat_id=${chatId}&session=${sessionToken}`;

      await ctx.reply(
        `🔍 *Student Verification Link*\n\nClick the button below to verify your UMaT student status:`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[{ text: "🔍 Verify Student Status", url: authUrl }]],
          },
        }
      );
    }
  });

  // ------------------------- COMMANDS -------------------------
  bot.command("report", async (ctx) => {
    ensureSession(ctx);
    if (!ctx.session.verified) {
      await ctx.reply(
        `🔒 *Verification Required*\n\nYou need to verify your UMaT student status before reporting incidents.\n\nPlease use /start to begin the verification process.`,
        { parse_mode: "Markdown" }
      );
      return;
    }

    ctx.session.state = "title";
    await ctx.reply(
      `📝 *New Incident Report*\n\nPlease provide the incident title (brief description):`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(
      `🆘 *SAFEBOT Help*\n\n*Available Commands:*\n` +
        `🏠 /start - Start or verify student status\n` +
        `📝 /report - Submit an incident report\n` +
        `📊 /status - Check your reports\n` +
        `🆘 /emergency - Emergency contacts\n` +
        `ℹ️ /help - Show this help message\n\n` +
        `*Emergency Contacts:*\n🚨 Campus Security: +233-XXX-XXXX\n🏥 UMaT Health Center: +233-XXX-XXXX\n🚓 Ghana Police: 191\n\n*Need immediate help?* Contact emergency services directly.`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("emergency", async (ctx) => {
    await ctx.reply(
      `🚨 *EMERGENCY CONTACTS*\n\n*UMaT Campus:*\n🛡️ Campus Security: +233-312-21212\n🏥 Health Center: +233-312-21213\n📞 Main Office: +233-312-21214\n\n*National Emergency:*\n🚓 Police: 191\n🚑 Ambulance: 193\n🚒 Fire Service: 192\n\n*Mental Health:*\n🧠 Crisis Helpline: +233-XXX-CRISIS\n\n⚠️ *For immediate danger, call 191 directly*`,
      { parse_mode: "Markdown" }
    );
  });

  bot.command("status", async (ctx) => {
    ensureSession(ctx);
    if (!ctx.session.verified) {
      await ctx.reply(
        `🔒 *Verification Required*\n\nPlease verify your student status first using /start`,
        { parse_mode: "Markdown" }
      );
      return;
    }

    await ctx.reply(
      `📊 *Your Report Status*\n\n📝 Reports Submitted: 0\n⏳ Under Review: 0\n✅ Resolved: 0\n\nUse /report to submit a new incident.`,
      { parse_mode: "Markdown" }
    );
  });

  // ------------------------- REPORT FLOW -------------------------
  bot.on("text", async (ctx) => {
    ensureSession(ctx);
    const state = ctx.session.state;
    if (!state) return;

    try {
      if (state === "title") {
        ctx.session.incidentTitle = ctx.message.text;
        ctx.session.state = "category";
        return ctx.reply(
          "Enter category: Harassment, Theft, Medical Emergency, Violence, Suspicious Activity, Facility Issue, Other"
        );
      }

      if (state === "category") {
        ctx.session.category = ctx.message.text;
        ctx.session.state = "location";
        return ctx.reply("Enter location: Classroom, Library, Cafeteria, Parking Lot, Other");
      }

      if (state === "location") {
        ctx.session.location = ctx.message.text;
        ctx.session.state = "whenOccurred";
        return ctx.reply("When did this occur? (YYYY-MM-DD HH:MM)");
      }

      if (state === "whenOccurred") {
        ctx.session.whenOccurred = ctx.message.text;
        ctx.session.state = "description";
        return ctx.reply("Provide detailed description:");
      }

      if (state === "description") {
        ctx.session.detailedDescription = ctx.message.text;

        await axios.post(`${process.env.BACKEND_URL}/api/incidents`, {
          incidentTitle: ctx.session.incidentTitle,
          category: ctx.session.category,
          location: ctx.session.location,
          whenOccurred: ctx.session.whenOccurred,
          detailedDescription: ctx.session.detailedDescription,
          urgencyLevel: "Medium",
          submitAnonymously: true,
        });

        ctx.reply("Incident submitted successfully. Thank you!");
        resetSession(ct
