import { Bot } from "grammy";
import { parseDiscount } from "./parsers";
import {
  handleStart,
  handleHelp,
  handleRegister,
  handleUnregister,
  handleSetup,
  handleBlock,
  handleUnblock,
  handleDiscountMessage,
  handleLunch,
  handleStatus,
} from "./handlers";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set");
}

export const bot = new Bot(token);

bot.command("start", handleStart);
bot.command("help", handleHelp);
bot.command("register", handleRegister);
bot.command("unregister", handleUnregister);
bot.command("setup", handleSetup);
bot.command("block", handleBlock);
bot.command("unblock", handleUnblock);
bot.command("lunch", handleLunch);
bot.command("discount", handleDiscountMessage);
bot.command("status", handleStatus);

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;

  if (parseDiscount(text)) {
    await handleDiscountMessage(ctx);
    return;
  }

  await ctx.reply("I didn't understand that. Type /help for commands.");
});
