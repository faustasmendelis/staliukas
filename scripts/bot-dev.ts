import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN is not set in .env.local");
    process.exit(1);
  }

  // Delete any existing webhook so long polling works
  await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`);

  // Dynamic import so env vars are loaded first
  const { bot } = await import("../src/lib/telegram/bot");
  console.log("Bot starting in long polling mode...");
  await bot.start({
    onStart: () => console.log("Bot is running! Message it on Telegram."),
  });
}

main().catch(console.error);
