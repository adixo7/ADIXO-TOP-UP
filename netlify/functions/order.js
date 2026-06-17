import { getStore } from '@netlify/blobs';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

async function tgRequest(token, method, body) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'Telegram secrets not set' }) };
  }

  let order;
  try {
    order = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'Invalid JSON' }) };
  }

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

  // Send Telegram notification FIRST — this is the critical step
  let telegramMsgId = null;
  try {
    const result = await tgRequest(BOT_TOKEN, 'sendMessage', {
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ Complete Order', callback_data: `complete:${order.id}` },
          { text: '❌ Cancel Order', callback_data: `cancel:${order.id}` },
        ]],
      },
    });
    if (result.ok) {
      telegramMsgId = result.result.message_id;
      console.log(`✅ Telegram notification sent for order ${order.id}`);
    } else {
      console.error('Telegram sendMessage failed:', result);
    }
  } catch (err) {
    console.error('Telegram send error:', err.message);
  }

  // Store order in Blobs for status tracking (best-effort)
  try {
    const store = getStore({ name: 'orders', consistency: 'strong' });
    await store.setJSON(order.id, { ...order, status: 'processing', telegramMsgId });
  } catch (err) {
    console.warn('Blobs storage failed (non-critical):', err.message);
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
