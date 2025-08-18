// backend/bot/bot.js
import { Telegraf, session, Markup } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
if (!BOT_TOKEN) {
  throw new Error("❌ TELEGRAM_TOKEN is missing in .env");
}

const bot = new Telegraf(BOT_TOKEN);

// ✅ Session middleware
bot.use(session());

// 🔧 Helper: reset flow state safely
function resetSession(ctx) {
  if (!ctx.session) ctx.session = {};
  ctx.session.state = null;
  ctx.session.incidentTitle = null;
  ctx.session.category = null;
  ctx.session.location = null;
  ctx.session.whenOccurred = null;
  ctx.session.detailedDescription = null;
  ctx.session.wrongCount = 0; // for error tracking
}

// 🔧 Helper: ensure session initialized
function ensureSession(ctx) {
  if (!ctx.session) ctx.session = {};
  if (!ctx.session.wrongCount) ctx.session.wrongCount = 0;
}

// 🟢 START command
bot.start((ctx) => {
  resetSession(ctx);
  ctx.reply(
    "👋 Welcome to SafeBot Demo!\nChoose an option:",
    Markup.inlineKeyboard([
      [Markup.button.callback("📝 Start Survey", "survey_start")],
      [Markup.button.callback("ℹ️ Help", "help")]
    ])
  );
});

// 🟢 Help handler
bot.action("help", async (ctx) => {
  await ctx.answerCbQuery(); // disappear button
  await ctx.reply("ℹ️ This is a demo bot.\nUse the menu to navigate.");
});

// 🟢 Survey Start
bot.action("survey_start", async (ctx) => {
  await ctx.answerCbQuery(); // hide clicked button
  resetSession(ctx);
  ctx.session.state = "q1";
  await ctx.reply("📍 Question 1: What is your department?");
});

// 🟢 Handle text answers
bot.on("text", async (ctx) => {
  ensureSession(ctx);

  const state = ctx.session.state;

  // If user is off-course
  if (!state) {
    ctx.session.wrongCount++;
    if (ctx.session.wrongCount >= 3) {
      resetSession(ctx);
      return ctx.reply(
        "⚠️ Too many invalid responses.\nReturning to main menu.",
        Markup.inlineKeyboard([
          [Markup.button.callback("📝 Start Survey", "survey_start")],
          [Markup.button.callback("ℹ️ Help", "help")]
        ])
      );
    }
    return ctx.reply("❌ Please use the provided buttons to continue.");
  }

  // Flow states
  if (state === "q1") {
    ctx.session.department = ctx.message.text;
    ctx.session.state = "q2";
    return ctx.reply("👤 Question 2: What is your year of study?");
  }

  if (state === "q2") {
    ctx.session.year = ctx.message.text;
    ctx.session.state = "q3";
    return ctx.reply("💡 Question 3: Have you witnessed any safety incident recently?");
  }

  if (state === "q3") {
    ctx.session.incident = ctx.message.text;
    ctx.session.state = "done";
    return ctx.reply(
      "✅ Thank you for completing the survey!\n\n" +
        `📍 Department: ${ctx.session.department}\n` +
        `👤 Year: ${ctx.session.year}\n` +
        `💡 Incident: ${ctx.session.incident}\n\n` +
        "Returning to main menu...",
      Markup.inlineKeyboard([
        [Markup.button.callback("📝 Start Survey Again", "survey_start")],
        [Markup.button.callback("ℹ️ Help", "help")]
      ])
    );
  }
});

// 🟢 Fallback for unknown commands
bot.on("callback_query", async (ctx) => {
  await ctx.answerCbQuery("⚠️ Invalid option. Please use menu buttons.");
});

export default bot;
