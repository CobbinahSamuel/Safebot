import { Telegraf, session } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Enable session middleware
bot.use(session());

// Start command
bot.start((ctx) => {
  ctx.session = {}; // reset session for user
  ctx.reply(
    "Welcome to SAFEBOT!\nType /report to submit a safety incident report."
  );
});

// Report command
bot.command("report", async (ctx) => {
  ctx.session.state = "title";
  ctx.reply("Enter incident title:");
});

// Handle all text messages
bot.on("text", async (ctx) => {
  const state = ctx.session.state;

  if (!state) return; // ignore if not in a report flow

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

      // Submit to backend
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
      ctx.session = {}; // reset session after submission
    }
  } catch (err) {
    console.error(err);
    ctx.reply("Error submitting incident. Please try again.");
    ctx.session = {}; // reset session on error
  }
});

export default bot;
