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

function getBlobsCtx() {
  try {
    const raw = process.env.NETLIFY_BLOBS_CONTEXT;
    if (!raw) return null;
    return JSON.parse(Buffer.from(raw, 'base64').toString());
  } catch { return null; }
}

async function saveStatus(orderId, data) {
  try {
    const ctx = getBlobsCtx();
    if (!ctx) return;
    const { edgeURL, rawSiteID, token } = ctx;
    await fetch(`${edgeURL}/${rawSiteID}/adixo-orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('Status save failed (non-fatal):', err.message);
  }
}

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const order = JSON.parse(event.body);

    await saveStatus(`status_${order.id}`, { status: 'processing' });
    await saveStatus(`userinfo_${order.id}`, order.userInfo || {});

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

      await tgRequest(BOT_TOKEN, 'sendMessage', {
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
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Order error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
