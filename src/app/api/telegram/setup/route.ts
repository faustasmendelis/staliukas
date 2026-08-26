export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!botToken || !appUrl) {
    return Response.json(
      { error: "Missing TELEGRAM_BOT_TOKEN or NEXT_PUBLIC_APP_URL" },
      { status: 500 }
    );
  }

  const webhookUrl = `${appUrl}/api/telegram/webhook`;

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: webhookSecret,
      }),
    }
  );

  const data = await res.json();
  return Response.json({ webhookUrl, ...data });
}
