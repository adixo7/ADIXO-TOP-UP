export const handler = async (event) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const SITE_URL = process.env.URL || process.env.DEPLOY_URL;

  if (!BOT_TOKEN) {
    console.warn('TELEGRAM_BOT_TOKEN not set — skipping webhook registration');
    return { statusCode: 200 };
  }

  if (!SITE_URL) {
    console.warn('Site URL not available — skipping webhook registration');
    return { statusCode: 200 };
  }

  const webhookUrl = `${SITE_URL}/api/telegram-webhook`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['callback_query'],
      }),
    });
    const result = await res.json();
    if (result.ok) {
      console.log(`✅ Telegram webhook auto-registered: ${webhookUrl}`);
    } else {
      console.warn('Webhook registration failed:', result.description);
    }
  } catch (err) {
    console.error('Webhook registration error:', err.message);
  }

  return { statusCode: 200 };
};
