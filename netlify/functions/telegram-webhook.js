import { getStore } from '@netlify/blobs';

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

  // Answer the button tap immediately so Telegram doesn't show a loading spinner
  await tgRequest(BOT_TOKEN, 'answerCallbackQuery', {
    callback_query_id: cb.id,
    text: `Order ${badge}`,
  });

  // Edit the message to show the new status
  await tgRequest(BOT_TOKEN, 'editMessageText', {
    chat_id: cb.message.chat.id,
    message_id: cb.message.message_id,
    text: cb.message.text + `\n\n${badge}`,
    parse_mode: 'HTML',
  });

  console.log(`Order ${orderId} marked as ${newStatus}`);

  // Update order status in Blobs (best-effort)
  try {
    const store = getStore({ name: 'orders', consistency: 'strong' });
    const order = await store.get(orderId, { type: 'json' });
    if (order) {
      await store.setJSON(orderId, { ...order, status: newStatus });
    } else {
      await store.setJSON(orderId, { id: orderId, status: newStatus });
    }
  } catch (err) {
    console.warn('Blobs update failed (non-critical):', err.message);
  }

  return { statusCode: 200, body: 'OK' };
};
