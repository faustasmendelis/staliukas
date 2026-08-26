import { webhookCallback } from "grammy/web";
import { bot } from "@/lib/telegram/bot";

const handleUpdate = webhookCallback(bot, "std/http", {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
});

export async function POST(req: Request) {
  try {
    return await handleUpdate(req);
  } catch {
    return new Response("Error processing update", { status: 500 });
  }
}
