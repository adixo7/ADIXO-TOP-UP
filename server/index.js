import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({
  origin: [
    'https://adixotopup.netlify.app',
    /\.replit\.dev$/,
    /\.replit\.app$/,
    'http://localhost:5000',
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

// Telegram long-polling loop
let offset = 0;

async function poll() {
  try {
    const data = await tgRequest('getUpdates', { offset, timeout: 25, allowed_updates: ['callback_query'] });

    if (data.ok && data.result?.length) {
      for (const update of data.result) {
        offset = update.update_id + 1;
        const cb = update.callback_query;
        if (!cb) continue;

        const [action, orderId] = (cb.data || '').split(':');
        const order = orders[orderId];

        if (order && (action === 'complete' || action === 'cancel')) {
          const newStatus = action === 'complete' ? 'completed' : 'failed';
          orders[orderId].status = newStatus;
          saveOrders();

          const badge = action === 'complete' ? '✅ COMPLETED' : '❌ CANCELLED';

          // Answer the button tap
          await tgRequest('answerCallbackQuery', {
            callback_query_id: cb.id,
            text: `Order ${badge}`,
          });

          // Edit original message to remove buttons and add status
          await tgRequest('editMessageText', {
            chat_id: cb.message.chat.id,
            message_id: cb.message.message_id,
            text: cb.message.text + `\n\n${badge}`,
            parse_mode: 'HTML',
          });

          console.log(`Order ${orderId} marked as ${newStatus}`);
        }
      }
    }
  } catch (err) {
    console.error('Poll error:', err.message);
  }

  // Schedule next poll immediately (long-poll keeps connection open ~25s)
  setImmediate(poll);
}

// In production, serve the built Vite frontend
const distDir = join(__dirname, '..', 'dist');
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    res.sendFile(join(distDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ ADIXO backend running on port ${PORT}`);
  if (BOT_TOKEN && CHAT_ID) {
    console.log('🤖 Telegram bot polling started');
    poll();
  } else {
    console.warn('⚠️  TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — bot disabled');
  }
});
