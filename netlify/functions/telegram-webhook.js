import { getStore } from '@netlify/blobs';

function getOrderStore() {
  return getStore({ name: 'orders', siteID: process.env.SITE_ID, token: process.env.NETLIFY_ACCESS_TOKEN });
}
function getSiteStore() {
  return getStore({ name: 'site-control', siteID: process.env.SITE_ID, token: process.env.NETLIFY_ACCESS_TOKEN });
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

async function getAllOrders() {
  try {
    const store = getOrderStore();
    const { blobs } = await store.list();
    const orders = await Promise.all(blobs.map(async b => {
      try { return await store.get(b.key, { type: 'json' }); } catch { return null; }
    }));
    return orders.filter(Boolean);
  } catch { return []; }
}

async function getSiteStatus() {
  try {
    const store = getSiteStore();
    return (await store.get('status', { type: 'json' })) || { maintenance: false, announcement: null, activeBanner: 0 };
  } catch { return { maintenance: false, announcement: null, activeBanner: 0 }; }
}

async function setSiteStatus(updates) {
  const store = getSiteStore();
  const current = await getSiteStatus();
  await store.setJSON('status', { ...current, ...updates });
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const ADMIN_CHAT = String(process.env.TELEGRAM_CHAT_ID || '');
  if (!BOT_TOKEN) return { statusCode: 200, body: 'OK' };

  let update;
  try { update = JSON.parse(event.body); } catch { return { statusCode: 200, body: 'OK' }; }

  // ── Callback queries (button taps on order messages) ──────────────────────
  const cb = update.callback_query;
  if (cb) {
    const [action, orderId] = (cb.data || '').split(':');
    if (orderId && (action === 'complete' || action === 'cancel')) {
      const newStatus = action === 'complete' ? 'completed' : 'failed';
      const badge = action === 'complete' ? '✅ COMPLETED' : '❌ CANCELLED';

      await tgRequest(BOT_TOKEN, 'answerCallbackQuery', { callback_query_id: cb.id, text: `Order ${badge}` });
      await tgRequest(BOT_TOKEN, 'editMessageText', {
        chat_id: cb.message.chat.id,
        message_id: cb.message.message_id,
        text: cb.message.text + `\n\n${badge}`,
        parse_mode: 'HTML',
      });

      try {
        const store = getOrderStore();
        const order = await store.get(orderId, { type: 'json' });
        await store.setJSON(orderId, { ...(order || { id: orderId }), status: newStatus });
      } catch (err) { console.error('Blobs update error:', err.message); }
    }
    return { statusCode: 200, body: 'OK' };
  }

  // ── Text messages / commands ───────────────────────────────────────────────
  const msg = update.message;
  if (!msg || !msg.text) return { statusCode: 200, body: 'OK' };

  const chatId = String(msg.chat.id);
  if (ADMIN_CHAT && chatId !== ADMIN_CHAT) return { statusCode: 200, body: 'OK' };

  const rawText = msg.text.trim();
  const parts = rawText.split(' ');
  const command = parts[0].toLowerCase().split('@')[0];
  const arg = parts.slice(1).join(' ').trim();

  async function reply(text, extra = {}) {
    await tgRequest(BOT_TOKEN, 'sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...extra });
  }

  switch (command) {
    case '/start':
    case '/help': {
      await reply(
        `🎮 <b>ADIXO STORE BOT</b>\n━━━━━━━━━━━━━━━━━━\n\n` +
        `<b>📦 Orders</b>\n` +
        `/orders — Recent orders list\n` +
        `/pending — Pending orders with approve/cancel\n` +
        `/order [ID] — Order details by ID\n` +
        `/cancel [ID] — Cancel a specific order\n\n` +
        `<b>📊 Stats</b>\n` +
        `/stats — Revenue & order summary\n\n` +
        `<b>🌐 Site Control</b>\n` +
        `/maintenance on|off — Toggle maintenance mode\n` +
        `/announce [text] — Show announcement on site\n` +
        `/announce off — Clear announcement\n` +
        `/banner youtube|telegram — Set which slide shows first`
      );
      break;
    }

    case '/orders': {
      const all = await getAllOrders();
      if (!all.length) { await reply('📭 No orders found.'); break; }
      const sorted = all.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
      const lines = sorted.map(o => {
        const sym = o.currency === 'USD' ? '$' : '৳';
        const icon = o.status === 'completed' ? '✅' : o.status === 'failed' ? '❌' : '⏳';
        return `${icon} <code>${String(o.id).slice(-8)}</code> | ${o.gameName} | ${sym}${o.price}`;
      });
      await reply(`📦 <b>RECENT ORDERS</b> (${all.length} total)\n━━━━━━━━━━━━━━━━━━\n${lines.join('\n')}`);
      break;
    }

    case '/pending': {
      const all = await getAllOrders();
      const pending = all.filter(o => o.status === 'processing');
      if (!pending.length) { await reply('✅ No pending orders!'); break; }
      await reply(`⏳ <b>${pending.length} PENDING ORDER(S)</b>`);
      for (const o of pending.slice(0, 5)) {
        const sym = o.currency === 'USD' ? '$' : '৳';
        await tgRequest(BOT_TOKEN, 'sendMessage', {
          chat_id: chatId,
          parse_mode: 'HTML',
          text:
            `⏳ <b>PENDING ORDER</b>\n` +
            `📦 <code>${o.id}</code>\n` +
            `🎮 ${o.gameName}\n` +
            `👤 ${o.playerId}\n` +
            `💎 ${o.packageName}\n` +
            `💰 ${sym}${o.price}\n` +
            `💳 ${o.paymentMethod}\n` +
            `🔑 <code>${o.trxId}</code>`,
          reply_markup: {
            inline_keyboard: [[
              { text: '✅ Complete', callback_data: `complete:${o.id}` },
              { text: '❌ Cancel', callback_data: `cancel:${o.id}` },
            ]],
          },
        });
      }
      if (pending.length > 5) await reply(`...and ${pending.length - 5} more. Use /orders to see all.`);
      break;
    }

    case '/order': {
      if (!arg) { await reply('Usage: /order [ORDER_ID]'); break; }
      try {
        const store = getOrderStore();
        let order = null;
        try { order = await store.get(arg, { type: 'json' }); } catch {}
        if (!order) {
          const all = await getAllOrders();
          order = all.find(o => String(o.id).includes(arg));
        }
        if (!order) { await reply(`❌ Order not found: <code>${arg}</code>`); break; }
        const sym = order.currency === 'USD' ? '$' : '৳';
        const statusLabel = order.status === 'completed' ? '✅ Completed' : order.status === 'failed' ? '❌ Cancelled' : '⏳ Processing';
        await reply(
          `📦 <b>ORDER DETAILS</b>\n━━━━━━━━━━━━━━━━━━\n` +
          `🆔 <code>${order.id}</code>\n` +
          `🎮 ${order.gameName}\n👤 ${order.playerId}\n💎 ${order.packageName}\n` +
          `💰 ${sym}${order.price}\n💳 ${order.paymentMethod}\n🔑 <code>${order.trxId}</code>\n` +
          `📅 ${order.date}\n🔖 ${statusLabel}`
        );
      } catch (err) { await reply(`❌ Error: ${err.message}`); }
      break;
    }

    case '/cancel': {
      if (!arg) { await reply('Usage: /cancel [ORDER_ID]'); break; }
      try {
        const store = getOrderStore();
        let order = null;
        try { order = await store.get(arg, { type: 'json' }); } catch {}
        if (!order) {
          const all = await getAllOrders();
          order = all.find(o => String(o.id).includes(arg));
        }
        if (!order) { await reply(`❌ Order not found: <code>${arg}</code>`); break; }
        await store.setJSON(order.id, { ...order, status: 'failed' });
        await reply(`❌ Order <code>${order.id}</code> has been <b>cancelled</b>.`);
      } catch (err) { await reply(`❌ Error: ${err.message}`); }
      break;
    }

    case '/stats': {
      const all = await getAllOrders();
      if (!all.length) { await reply('📊 No orders yet.'); break; }
      const today = new Date().toDateString();
      const todayOrders = all.filter(o => o.date && new Date(o.date).toDateString() === today);
      const completed = all.filter(o => o.status === 'completed');
      const pending = all.filter(o => o.status === 'processing');
      const cancelled = all.filter(o => o.status === 'failed');
      const totalBDT = completed.filter(o => o.currency !== 'USD').reduce((s, o) => s + Number(o.price || 0), 0);
      const totalUSD = completed.filter(o => o.currency === 'USD').reduce((s, o) => s + Number(o.price || 0), 0);
      const todayDone = todayOrders.filter(o => o.status === 'completed');
      const todayBDT = todayDone.filter(o => o.currency !== 'USD').reduce((s, o) => s + Number(o.price || 0), 0);
      const todayUSD = todayDone.filter(o => o.currency === 'USD').reduce((s, o) => s + Number(o.price || 0), 0);

      await reply(
        `📊 <b>ADIXO STORE STATS</b>\n━━━━━━━━━━━━━━━━━━\n\n` +
        `<b>📅 Today</b>\n` +
        `Orders: ${todayOrders.length}  ✅ ${todayDone.length}` +
        (todayBDT > 0 ? `\nRevenue: ৳${todayBDT.toFixed(0)}` : '') +
        (todayUSD > 0 ? `\nRevenue: $${todayUSD.toFixed(2)}` : '') +
        `\n\n<b>📦 All Time</b>\n` +
        `Total: ${all.length}  ✅ ${completed.length}  ⏳ ${pending.length}  ❌ ${cancelled.length}` +
        (totalBDT > 0 ? `\nRevenue: ৳${totalBDT.toFixed(0)}` : '') +
        (totalUSD > 0 ? `\nRevenue: $${totalUSD.toFixed(2)}` : '')
      );
      break;
    }

    case '/maintenance': {
      const val = arg.toLowerCase();
      if (val !== 'on' && val !== 'off') { await reply('Usage: /maintenance on|off'); break; }
      await setSiteStatus({ maintenance: val === 'on' });
      await reply(val === 'on'
        ? '🔧 <b>Maintenance mode ON</b>\nWebsite now shows maintenance popup to visitors.'
        : '✅ <b>Maintenance mode OFF</b>\nWebsite is live again.'
      );
      break;
    }

    case '/announce': {
      if (!arg || arg.toLowerCase() === 'off') {
        await setSiteStatus({ announcement: null });
        await reply('🔕 Announcement cleared from site.');
      } else {
        await setSiteStatus({ announcement: arg });
        await reply(`📢 <b>Announcement set:</b>\n<i>${arg}</i>`);
      }
      break;
    }

    case '/banner': {
      const slide = arg.toLowerCase();
      if (slide !== 'youtube' && slide !== 'telegram') { await reply('Usage: /banner youtube|telegram'); break; }
      await setSiteStatus({ activeBanner: slide === 'youtube' ? 0 : 1 });
      await reply(`🖼 Banner set to: <b>${slide === 'youtube' ? '▶️ YouTube' : '✈️ Telegram'}</b>`);
      break;
    }

    default: {
      if (command.startsWith('/')) await reply('Unknown command. Type /help to see all commands.');
      break;
    }
  }

  return { statusCode: 200, body: 'OK' };
};
