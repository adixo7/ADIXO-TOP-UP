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

  if (orderId && (action === 'complete' || action === 'cancel')) {
    const store = getStore('orders');
    const order = await store.get(orderId, { type: 'json' });

    if (order) {
      const newStatus = action === 'complete' ? 'completed' : 'failed';
      await store.setJSON(orderId, { ...order, status: newStatus });

      const badge = action === 'complete' ? '✅ COMPLETED' : '❌ CANCELLED';

      await tgRequest(BOT_TOKEN, 'answerCallbackQuery', {
        callback_query_id: cb.id,
        text: `Order ${badge}`,
      });

      await tgRequest(BOT_TOKEN, 'editMessageText', {
        chat_id: cb.message.chat.id,
        message_id: cb.message.message_id,
        text: cb.message.text + `\n\n${badge}`,
        parse_mode: 'HTML',
      });

      console.log(`Order ${orderId} marked as ${newStatus}`);
    }
  }

  return { statusCode: 200, body: 'OK' };
};
