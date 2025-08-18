import { Telegraf, session } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

let botInstance = null;

/**
 * Create a new Telegraf bot instance
 */
export function createBot() {
  if (!BOT_TOKEN) {
    throw new Error("Telegram bot token is missing!");
  }

  if (!botInstance) {
    botInstance = new Telegraf(BOT_TOKEN);

    // ✅ Enable session middleware
    botInstance.use(session());

    // Example command handlers
    botInstance.start((ctx) =>
      ctx.reply("👋 Welcome to Safebot! How can I help you today?")
    );

    botInstance.help((ctx) =>
      ctx.reply("ℹ️ Use /start to begin, or just send a message.")
    );

    botInstance.on("text", (ctx) => {
      ctx.reply(`📩 You said: ${ctx.message.text}`);
    });
  }

  return botInstance;
}

// ✅ Default export for compatibility
export default createBot;
