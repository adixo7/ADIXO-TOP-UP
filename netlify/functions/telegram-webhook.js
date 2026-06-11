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

function getOrderStore() {
  return getStore({
    name: 'adixo-orders',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_ACCESS_TOKEN,
  });
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  try {
    const update = JSON.parse(event.body || '{}');
    const cb = update.callback_query;

    if (cb && BOT_TOKEN) {
      const [action, orderId] = (cb.data || '').split(':');

      if (action === 'complete' || action === 'cancel') {
        const newStatus = action === 'complete' ? 'completed' : 'failed';
        const badge = action === 'complete' ? '✅ COMPLETED' : '❌ CANCELLED';

        const store = getOrderStore();
        await store.setJSON(`status_${orderId}`, { status: newStatus });

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
      }
    }
  } catch (err) {
    console.error('Webhook error:', err.message);
  }

  return { statusCode: 200, body: 'OK' };
};
