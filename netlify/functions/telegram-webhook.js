import { getStore } from '@netlify/blobs';

function getOrderStore() {
  return getStore({
    name: 'orders',
    siteID: process.env.SITE_ID,
    token: process.env.NETLIFY_ACCESS_TOKEN,
  });
}

async function tgRequest(token, method, body) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  } catch (err) {
    console.error(`Telegram ${method} error:`, err.message);
    return { ok: false };
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) return { statusCode: 200, body: 'OK' };

  let update;
  try {
    update = JSON.parse(event.body);
  } catch {
    return { statusCode: 200, body: 'OK' };
  }

  const cb = update.callback_query;
  if (!cb) return { statusCode: 200, body: 'OK' };

  const [action, orderId] = (cb.data || '').split(':');
  if (!orderId || (action !== 'complete' && action !== 'cancel')) {
    return { statusCode: 200, body: 'OK' };
  }

  const newStatus = action === 'complete' ? 'completed' : 'failed';
  const badge = action === 'complete' ? '✅ COMPLETED' : '❌ CANCELLED';

  // Answer button tap immediately
  await tgRequest(BOT_TOKEN, 'answerCallbackQuery', {
    callback_query_id: cb.id,
    text: `Order ${badge}`,
  });

  // Edit the Telegram message
  await tgRequest(BOT_TOKEN, 'editMessageText', {
    chat_id: cb.message.chat.id,
    message_id: cb.message.message_id,
    text: cb.message.text + `\n\n${badge}`,
    parse_mode: 'HTML',
  });

  // Update order status in Blobs
  try {
    const store = getOrderStore();
    const order = await store.get(orderId, { type: 'json' });
    await store.setJSON(orderId, { ...(order || { id: orderId }), status: newStatus });
    console.log(`Order ${orderId} → ${newStatus}`);
  } catch (err) {
    console.error('Blobs update error:', err.message);
  }

  return { statusCode: 200, body: 'OK' };
};
