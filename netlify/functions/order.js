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
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  const order = JSON.parse(event.body);
  const store = getStore('orders');
  await store.setJSON(order.id, { ...order, status: 'processing' });

  if (BOT_TOKEN && CHAT_ID) {
    const sym = order.currency === 'USD' ? '$' : '৳';
    const priceStr = order.currency === 'USD'
      ? Number(order.price).toFixed(2)
      : Number(order.price).toFixed(0);

    const text =
      `🔔 <b>NEW ORDER RECEIVED</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📦 <b>Order ID:</b> <code>${order.id}</code>\n` +
      `🎮 <b>Game:</b> ${order.gameName}\n` +
      `👤 <b>Player ID:</b> <code>${order.playerId}</code>\n` +
      `💎 <b>Package:</b> ${order.packageName}\n` +
      `💰 <b>Amount:</b> ${sym}${priceStr}\n` +
      `💳 <b>Method:</b> ${order.paymentMethod}\n` +
      `🔑 <b>TrxID:</b> <code>${order.trxId}</code>\n` +
      `⏰ <b>Time:</b> ${order.date}\n` +
      `━━━━━━━━━━━━━━━━━━`;

    const result = await tgRequest(BOT_TOKEN, 'sendMessage', {
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Complete', callback_data: `complete:${order.id}` },
            { text: '❌ Cancel', callback_data: `cancel:${order.id}` },
          ],
          [
            { text: '👤 User Info', callback_data: `userinfo:${order.id}` },
          ],
        ],
      },
    });

    if (result.ok) {
      await store.setJSON(order.id, {
        ...order,
        status: 'processing',
        telegramMsgId: result.result.message_id,
      });
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
