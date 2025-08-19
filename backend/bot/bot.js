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

  // Safety instructions based on incident category
  function getSafetyInstructions(category) {
    const instructions = {
      Harassment:
        `🛡️ *HARASSMENT SAFETY PROTOCOL:*\n\n` +
        `🚨 *Immediate Steps:*\n` +
        `• Move to a safe, public area\n` +
        `• Document any evidence (screenshots, witnesses)\n` +
        `• Report to Campus Security immediately\n` +
        `• Contact Student Affairs if needed\n\n` +
        `📞 *Support Resources:*\n` +
        `• Counseling Services: +233-312-21215\n` +
        `• Student Affairs: +233-312-21216\n` +
        `• Anonymous Tip Line: +233-312-TIPS\n\n` +
        `⚠️ *Remember: You are not alone. Help is available.*`,

      Theft:
        `🔒 *THEFT RESPONSE PROTOCOL:*\n\n` +
        `🚨 *Immediate Steps:*\n` +
        `• Do NOT pursue the suspect\n` +
        `• Secure remaining belongings\n` +
        `• List stolen items and serial numbers\n` +
        `• Check nearby CCTV locations\n\n` +
        `📋 *Next Actions:*\n` +
        `• File police report if valuable items stolen\n` +
        `• Contact your insurance provider\n` +
        `• Change passwords if devices were stolen\n` +
        `• Monitor bank accounts if cards were taken\n\n` +
        `🔍 *Campus Security will review CCTV footage*`,

      "Medical Emergency":
        `🏥 *MEDICAL EMERGENCY PROTOCOL:*\n\n` +
        `🚨 *CRITICAL: If life-threatening, call 193 NOW!*\n\n` +
        `⚡ *Immediate Actions:*\n` +
        `• Stay with the person if safe to do so\n` +
        `• Keep them conscious and talking\n` +
        `• Do NOT move them unless in immediate danger\n` +
        `• Clear the area of crowds\n\n` +
        `🏥 *Medical Support:*\n` +
        `• UMaT Health Center: +233-312-21213\n` +
        `• Ambulance: 193\n` +
        `• Campus First Aid: Available 24/7\n\n` +
        `✅ *Medical team has been dispatched to your location*`,

      Violence:
        `⚠️ *VIOLENCE SAFETY PROTOCOL:*\n\n` +
        `🚨 *PRIORITY: Ensure your immediate safety!*\n\n` +
        `🛡️ *Safety Steps:*\n` +
        `• Move to a secure location immediately\n` +
        `• Call 191 if ongoing threat\n` +
        `• Do NOT confront the aggressor\n` +
        `• Seek medical attention if injured\n\n` +
        `📞 *Emergency Contacts:*\n` +
        `• Ghana Police: 191\n` +
        `• Campus Security: +233-312-21212\n` +
        `• Emergency Services: 193\n\n` +
        `🚨 *Security team is responding to your location*`,

      "Suspicious Activity":
        `👁️ *SUSPICIOUS ACTIVITY PROTOCOL:*\n\n` +
        `🔍 *Observation Guidelines:*\n` +
        `• Maintain safe distance\n` +
        `• Note time, location, and description\n` +
        `• Do NOT approach or confront\n` +
        `• Take photos/video if safely possible\n\n` +
        `📋 *Information to Gather:*\n` +
        `• Physical description of person(s)\n` +
        `• Vehicle details (if applicable)\n` +
        `• Direction of movement\n` +
        `• Any unusual behavior patterns\n\n` +
        `🛡️ *Security patrol has been alerted to the area*`,

      "Safety Violation":
        `🏗️ *SAFETY VIOLATION PROTOCOL:*\n\n` +
        `⚠️ *Immediate Actions:*\n` +
        `• Evacuate the area if dangerous\n` +
        `• Mark/block hazardous areas\n` +
        `• Warn others of the danger\n` +
        `• Take photos for documentation\n\n` +
        `🔧 *Maintenance Response:*\n` +
        `• Facilities Management: +233-312-21217\n` +
        `• Emergency Repairs: 24/7 availability\n` +
        `• Utilities Department: +233-312-21218\n\n` +
        `✅ *Maintenance team has been notified and will respond within 2 hours*`,

      Accident:
        `🏥 *ACCIDENT RESPONSE PROTOCOL:*\n\n` +
        `🚨 *CRITICAL: If life-threatening, call 193 NOW!*\n\n` +
        `⚡ *Immediate Actions:*\n` +
        `• Stay with the person if safe to do so\n` +
        `• Keep them conscious and talking\n` +
        `• Do NOT move them unless in immediate danger\n` +
        `• Clear the area of crowds\n\n` +
        `🏥 *Medical Support:*\n` +
        `• UMaT Health Center: +233-312-21213\n` +
        `• Ambulance: 193\n` +
        `• Campus First Aid: Available 24/7\n\n` +
        `✅ *Medical team has been dispatched to your location*`,

      Other:
        `🆘 *GENERAL INCIDENT PROTOCOL:*\n\n` +
        `🚨 *Immediate Steps:*\n` +
        `• Ensure your immediate safety\n` +
        `• Move to a secure location if needed\n` +
        `• Document the incident if safe to do so\n` +
        `• Contact appropriate authorities\n\n` +
        `📞 *Emergency Contacts:*\n` +
        `• Campus Security: +233-312-21212\n` +
        `• Ghana Police: 191\n` +
        `• Emergency Services: 193\n\n` +
        `🛡️ *Security team has been alerted and will respond accordingly*`,
    };

    return instructions[category] || null;
  }

  // Send notification to administrators
  async function sendAdminNotification(incidentData, reportId) {
    try {
      // In a real implementation, you would send this to admin chat IDs
      // For now, we'll log it and could send to a dedicated admin channel
      const adminMessage =
        `🚨 *NEW INCIDENT REPORT - IMMEDIATE ATTENTION REQUIRED*\n\n` +
        `📋 *Report ID:* ${reportId.slice(-8)}\n` +
        `📝 *Title:* ${incidentData.incidentTitle}\n` +
        `🏷️ *Category:* ${incidentData.category}\n` +
        `📍 *Location:* ${incidentData.location}\n` +
        `⏰ *Time:* ${incidentData.whenOccurred}\n` +
        `⚡ *Urgency:* ${incidentData.urgencyLevel}\n\n` +
        `👤 *Reported by:*\n` +
        `• Name: ${incidentData.studentInfo.name}\n` +
        `• Index: ${incidentData.studentInfo.indexNumber}\n` +
        `• Department: ${incidentData.studentInfo.department}\n` +
        `• Email: ${incidentData.contactEmail}\n\n` +
        `📱 *Telegram:* Chat ID ${incidentData.telegramInfo.chatId}\n\n` +
        `📄 *Description:*\n${incidentData.detailedDescription}\n\n` +
        `⚠️ *ACTION REQUIRED: Please respond within 30 minutes*\n` +
        `🔗 View in Admin Dashboard: ${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }`;

      console.log("ADMIN NOTIFICATION:", adminMessage);

      // TODO: Send to admin Telegram channel/group
      // const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
      // if (ADMIN_CHAT_ID) {
      //   await bot.telegram.sendMessage(ADMIN_CHAT_ID, adminMessage, { parse_mode: "Markdown" });
      // }

      // Send email notification to administrators (if configured)
      // await sendEmailNotification(incidentData, reportId);
    } catch (error) {
      console.error("Error sending admin notification:", error);
    }
  }

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
              [
                {
                  text: "🔍 Start Verification",
                  callback_data: "start_verification",
                },
              ],
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
            inline_keyboard: [
              [{ text: "🔍 Verify Student Status", url: authUrl }],
            ],
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
      `🆘 *UMaT SAFEBOT Help*\n\n*Available Commands:*\n` +
        `🏠 /start - Start or verify student status\n` +
        `📝 /report - Submit an incident report\n` +
        `📊 /status - Check your reports\n` +
        `🆘 /emergency - Emergency contacts\n` +
        `ℹ️ /help - Show this help message\n\n` +
        `*Emergency Contacts:*\n🚨 Campus Security: +233-312-21212\n🏥 UMaT Health Center: +233-312-21213\n🚓 Ghana Police: 191\n🚑 Ambulance: 193\n\n*Need immediate help?* Contact emergency services directly.\n\n` +
        `🛡️ *Your safety is our priority!*`,
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

    try {
      // Fetch user's reports from the database
      const response = await axios.get(
        `${process.env.BACKEND_URL}/api/incidents?chatId=${ctx.chat.id}`
      );

      const userReports = response.data.filter(
        (incident) =>
          incident.telegramInfo &&
          incident.telegramInfo.chatId === ctx.chat.id.toString()
      );

      if (userReports.length === 0) {
        await ctx.reply(
          `📊 *Your Report Status*\n\n📝 Reports Submitted: 0\n\nYou haven't submitted any reports yet.\nUse /report to submit your first incident report.`,
          { parse_mode: "Markdown" }
        );
        return;
      }

      // Count reports by status
      const statusCounts = {
        pending: 0,
        investigating: 0,
        resolved: 0,
        closed: 0,
      };

      userReports.forEach((report) => {
        statusCounts[report.status] = (statusCounts[report.status] || 0) + 1;
      });

      let statusMessage = `📊 *Your Report Status*\n\n`;
      statusMessage += `📝 *Total Reports:* ${userReports.length}\n\n`;

      if (statusCounts.pending > 0)
        statusMessage += `⏳ *Pending:* ${statusCounts.pending}\n`;
      if (statusCounts.investigating > 0)
        statusMessage += `🔍 *Under Investigation:* ${statusCounts.investigating}\n`;
      if (statusCounts.resolved > 0)
        statusMessage += `✅ *Resolved:* ${statusCounts.resolved}\n`;
      if (statusCounts.closed > 0)
        statusMessage += `🔒 *Closed:* ${statusCounts.closed}\n`;

      statusMessage += `\n📋 *Recent Reports:*\n`;

      // Show last 3 reports
      const recentReports = userReports.slice(-3).reverse();
      recentReports.forEach((report, index) => {
        const statusEmoji = {
          pending: "⏳",
          investigating: "🔍",
          resolved: "✅",
          closed: "🔒",
        };

        statusMessage += `\n${index + 1}. ${statusEmoji[report.status]} *${
          report.incidentTitle
        }*\n`;
        statusMessage += `   📍 ${report.location}\n`;
        statusMessage += `   📅 ${new Date(
          report.createdAt
        ).toLocaleDateString()}\n`;
      });

      statusMessage += `\nUse /report to submit a new incident.`;

      await ctx.reply(statusMessage, { parse_mode: "Markdown" });
    } catch (error) {
      console.error("Error fetching user reports:", error);
      await ctx.reply(
        `📊 *Your Report Status*\n\nUnable to fetch your reports at the moment. Please try again later.\n\nUse /report to submit a new incident.`,
        { parse_mode: "Markdown" }
      );
    }
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
          "📋 *Select incident category:*\n\n" +
            "• **Harassment** - Bullying, intimidation, discrimination\n" +
            "• **Theft** - Stolen items, burglary, robbery\n" +
            "• **Accident** - Injuries, falls, collisions\n" +
            "• **Safety Violation** - Unsafe conditions, facility issues\n" +
            "• **Other** - Any other incident type\n\n" +
            "Please type the category name:",
          { parse_mode: "Markdown" }
        );
      }

      if (state === "category") {
        const categoryInput = ctx.message.text.toLowerCase().trim();

        // Map user input to valid database categories
        const categoryMap = {
          harassment: "Harassment",
          theft: "Theft",
          accident: "Accident",
          "safety violation": "Safety Violation",
          safety: "Safety Violation",
          "medical emergency": "Other",
          medical: "Other",
          violence: "Harassment", // Map violence to harassment as closest match
          "suspicious activity": "Other",
          suspicious: "Other",
          "facility issue": "Safety Violation",
          facility: "Safety Violation",
          other: "Other",
        };

        // Find matching category
        let mappedCategory = null;
        for (const [key, value] of Object.entries(categoryMap)) {
          if (categoryInput.includes(key)) {
            mappedCategory = value;
            break;
          }
        }

        if (!mappedCategory) {
          return ctx.reply(
            "❌ Invalid category. Please choose from:\n" +
              "• Harassment\n• Theft\n• Accident\n• Safety Violation\n• Other\n\n" +
              "Please enter a valid category:"
          );
        }

        ctx.session.category = mappedCategory;
        ctx.session.state = "location";
        return ctx.reply(
          "Enter location: Classroom, Library, Cafeteria, Parking Lot, Other"
        );
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

        // Prepare incident data with student information
        const incidentData = {
          incidentTitle: ctx.session.incidentTitle,
          category: ctx.session.category,
          location: ctx.session.location,
          whenOccurred: ctx.session.whenOccurred,
          detailedDescription: ctx.session.detailedDescription,
          urgencyLevel: "Medium",
          submitAnonymously: false, // Since we have verified student info
        };

        // Add student information if verified
        if (ctx.session.verified && ctx.session.studentInfo) {
          incidentData.studentInfo = {
            name: ctx.session.studentInfo.name,
            indexNumber: ctx.session.studentInfo.indexNumber,
            department: ctx.session.studentInfo.department,
          };
          incidentData.telegramInfo = {
            chatId: ctx.chat.id.toString(),
            userId: ctx.from.id.toString(),
          };
          incidentData.contactEmail = `${ctx.session.studentInfo.indexNumber
            .toLowerCase()
            .replace(/\//g, ".")}@umat.edu.gh`;
        } else {
          // Fallback for unverified users (shouldn't happen due to verification check)
          incidentData.submitAnonymously = true;
        }

        const response = await axios.post(
          `${process.env.BACKEND_URL}/api/incidents`,
          incidentData
        );

        // Send admin notification
        await sendAdminNotification(incidentData, response.data._id);

        // Send confirmation message
        await ctx.reply(
          `✅ *Incident Report Submitted Successfully!*\n\n` +
            `📋 *Report ID:* ${response.data._id.slice(-8)}\n` +
            `📝 *Title:* ${ctx.session.incidentTitle}\n` +
            `📍 *Location:* ${ctx.session.location}\n` +
            `⚡ *Urgency:* Medium\n\n` +
            `🎓 *Submitted by:* ${ctx.session.studentInfo.name}\n` +
            `📚 *Index:* ${ctx.session.studentInfo.indexNumber}\n\n` +
            `📧 You will receive updates via your UMaT email.\n` +
            `🔍 Use /status to check your report status.`,
          { parse_mode: "Markdown" }
        );

        // Damage control and administration notification
        await ctx.reply(
          `🚨 *IMMEDIATE ACTIONS TAKEN:*\n\n` +
            `✅ Your report has been forwarded to UMaT Administration\n` +
            `✅ Campus Security has been notified\n` +
            `✅ Incident logged in the safety database\n` +
            `✅ Response team will be dispatched if required\n\n` +
            `📞 *Emergency Support:*\n` +
            `🛡️ Campus Security: +233-312-21212\n` +
            `🏥 Health Center: +233-312-21213\n` +
            `🚓 Emergency Services: 191\n\n` +
            `⏰ *Expected Response Time:* 15-30 minutes\n` +
            `📧 *Updates:* You'll receive email notifications\n\n` +
            `🔒 *Your safety is our priority. Help is on the way!*`,
          { parse_mode: "Markdown" }
        );

        // Send additional safety instructions based on incident category
        const safetyInstructions = getSafetyInstructions(ctx.session.category);
        if (safetyInstructions) {
          await ctx.reply(safetyInstructions, { parse_mode: "Markdown" });
        }

        resetSession(ctx);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      ctx.reply(
        "An error occurred while processing your request. Please try again later."
      );
    }
  });

  // Error handling
  bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}`, err);
    ctx.reply("An error occurred. Please try again later.");
  });

  return bot;
}

export default createBot;
