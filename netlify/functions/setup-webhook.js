export const handler = async (event) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  if (!BOT_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: 'TELEGRAM_BOT_TOKEN not set' }),
    };
  }

  const host = event.headers['x-forwarded-host'] || event.headers.host;
  const webhookUrl = `https://${host}/api/telegram-webhook`;

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
    console.log('Webhook set:', result);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: result.ok, webhookUrl, telegram: result }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
