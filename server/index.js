import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const IS_PROD = process.env.NODE_ENV === 'production' || !!process.env.REPLIT_DEPLOYMENT;

app.use(cors({
  origin: [
    'https://adixotopup.netlify.app',
    /\.replit\.dev$/,
    /\.replit\.app$/,
    'http://localhost:5000',
    'http://localhost:3001',
  ],
  methods: ['GET', 'POST'],
}));
app.use(express.json());

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ORDERS_FILE = join(__dirname, 'orders.json');

// Load persisted orders
let orders = {};
if (existsSync(ORDERS_FILE)) {
  try { orders = JSON.parse(readFileSync(ORDERS_FILE, 'utf8')); } catch {}
}

function saveOrders() {
  try { writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2)); } catch {}
}

async function tgRequest(method, body) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
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

// POST /api/order — receive order from frontend, send Telegram notification
app.post('/api/order', async (req, res) => {
  const order = req.body;
  orders[order.id] = { ...order, status: 'processing', telegramMsgId: null };
  saveOrders();

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

  const result = await tgRequest('sendMessage', {
    chat_id: CHAT_ID,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[
        { text: '✅ Complete Order', callback_data: `complete:${order.id}` },
        { text: '❌ Cancel Order',   callback_data: `cancel:${order.id}` },
      ]],
    },
  });

  if (result.ok) {
    orders[order.id].telegramMsgId = result.result.message_id;
    saveOrders();
  }

  res.json({ ok: true });
});

// GET /api/order/:id — frontend polls this for status changes
app.get('/api/order/:id', (req, res) => {
  const o = orders[req.params.id];
  res.json({ status: o ? o.status : 'processing' });
});

// POST /api/telegram-webhook — Telegram calls this when a button is tapped
app.post('/api/telegram-webhook', async (req, res) => {
  res.sendStatus(200);

  const update = req.body;
  const cb = update.callback_query;
  if (!cb) return;

  const [action, orderId] = (cb.data || '').split(':');
  const order = orders[orderId];

  if (order && (action === 'complete' || action === 'cancel')) {
    const newStatus = action === 'complete' ? 'completed' : 'failed';
    orders[orderId].status = newStatus;
    saveOrders();

    const badge = action === 'complete' ? '✅ COMPLETED' : '❌ CANCELLED';

    await tgRequest('answerCallbackQuery', {
      callback_query_id: cb.id,
      text: `Order ${badge}`,
    });

    await tgRequest('editMessageText', {
      chat_id: cb.message.chat.id,
      message_id: cb.message.message_id,
      text: cb.message.text + `\n\n${badge}`,
      parse_mode: 'HTML',
    });

    console.log(`Order ${orderId} marked as ${newStatus}`);
  }
});

// GET /api/setup-webhook — visit this once after deploying to register the webhook
app.get('/api/setup-webhook', async (req, res) => {
  if (!BOT_TOKEN) {
    return res.json({ ok: false, error: 'TELEGRAM_BOT_TOKEN not set' });
  }
  // Use Replit's public domain; fall back to x-forwarded-host header
  const replitDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPL_SLUG;
  const host = replitDomain || req.headers['x-forwarded-host'] || req.headers.host;
  const webhookUrl = `https://${host}/api/telegram-webhook`;
  const result = await tgRequest('setWebhook', {
    url: webhookUrl,
    allowed_updates: ['callback_query'],
  });
  console.log(`Webhook set to: ${webhookUrl}`, result);
  res.json({ ok: result.ok, webhookUrl, telegram: result });
});

// In production, serve the built frontend from dist/
if (IS_PROD) {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`✅ ADIXO backend running on port ${PORT}`);
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('⚠️  TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — bot disabled');
  } else {
    console.log('🤖 Telegram bot ready');
    // Auto-register webhook on startup — works in both dev and prod
    const domain = process.env.REPLIT_DEV_DOMAIN
      || (process.env.REPL_SLUG && process.env.REPL_OWNER
          ? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.replit.app`
          : null);
    if (domain) {
      const webhookUrl = `https://${domain}/api/telegram-webhook`;
      const result = await tgRequest('setWebhook', {
        url: webhookUrl,
        allowed_updates: ['callback_query'],
      });
      if (result.ok) {
        console.log(`✅ Telegram webhook registered: ${webhookUrl}`);
      } else {
        console.warn('⚠️  Webhook registration failed:', result.description);
      }
    } else {
      console.warn('⚠️  Could not determine public domain — webhook not registered.');
    }
  }
});
