export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const BACKEND = process.env.REPLIT_BACKEND_URL;
  if (!BACKEND) return { statusCode: 200, body: 'OK' };

  try {
    await fetch(`${BACKEND}/api/telegram-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body,
    });
  } catch (err) {
    console.error('Webhook forward error:', err.message);
  }

  return { statusCode: 200, body: 'OK' };
};
