import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// AI chat uses Groq (free, global) with OpenAI-compatible API

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
const SITE_CONTROL_FILE = join(__dirname, 'site-control.json');

// Load persisted orders
let orders = {};
if (existsSync(ORDERS_FILE)) {
  try { orders = JSON.parse(readFileSync(ORDERS_FILE, 'utf8')); } catch {}
}

function saveOrders() {
  try { writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2)); } catch {}
}

// Load persisted site control
let siteControl = { maintenance: false, announcement: null, activeBanner: 0 };
if (existsSync(SITE_CONTROL_FILE)) {
  try { siteControl = { ...siteControl, ...JSON.parse(readFileSync(SITE_CONTROL_FILE, 'utf8')) }; } catch {}
}

function saveSiteControl() {
  try { writeFileSync(SITE_CONTROL_FILE, JSON.stringify(siteControl, null, 2)); } catch {}
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
    `👤 <b>Customer:</b> ${order.userName || 'N/A'}\n` +
    `📧 <b>Email:</b> ${order.userEmail || 'N/A'}\n` +
    `🆔 <b>User ID:</b> <code>${order.userId || 'N/A'}</code>\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📦 <b>Order ID:</b> <code>${order.id}</code>\n` +
    `🎮 <b>Game:</b> ${order.gameName}\n` +
    `🎯 <b>Player ID:</b> <code>${order.playerId}</code>\n` +
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

// GET /api/site-control — frontend fetches site state
app.get('/api/site-control', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json(siteControl);
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

  // Handle callback_query (button taps)
  const cb = update.callback_query;
  if (cb) {
    const [action, orderId] = (cb.data || '').split(':');
    const order = orders[orderId];
    if (order && (action === 'complete' || action === 'cancel')) {
      const newStatus = action === 'complete' ? 'completed' : 'failed';
      orders[orderId].status = newStatus;
      saveOrders();
      const badge = action === 'complete' ? '✅ COMPLETED' : '❌ CANCELLED';
      await tgRequest('answerCallbackQuery', { callback_query_id: cb.id, text: `Order ${badge}` });
      await tgRequest('editMessageText', {
        chat_id: cb.message.chat.id,
        message_id: cb.message.message_id,
        text: cb.message.text + `\n\n${badge}`,
        parse_mode: 'HTML',
      });
      console.log(`Order ${orderId} marked as ${newStatus}`);
    }
    return;
  }

  // Handle commands (dev only — in prod Netlify function handles these)
  const msg = update.message;
  if (!msg || !msg.text) return;
  const chatId = String(msg.chat.id);
  const parts = msg.text.trim().split(' ');
  const command = parts[0].toLowerCase().split('@')[0];
  const arg = parts.slice(1).join(' ').trim();

  async function reply(text) {
    await tgRequest('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML' });
  }

  if (command === '/maintenance') {
    const val = arg.toLowerCase();
    if (val === 'on' || val === 'off') {
      siteControl.maintenance = val === 'on';
      saveSiteControl();
      await reply(val === 'on' ? '🔧 Maintenance mode ON' : '✅ Maintenance mode OFF');
    }
  } else if (command === '/announce') {
    siteControl.announcement = (!arg || arg.toLowerCase() === 'off') ? null : arg;
    saveSiteControl();
    await reply(siteControl.announcement ? `📢 Announcement set: ${siteControl.announcement}` : '🔕 Announcement cleared.');
  } else if (command === '/banner') {
    siteControl.activeBanner = arg.toLowerCase() === 'telegram' ? 1 : 0;
    saveSiteControl();
    await reply(`🖼 Banner set to: ${arg}`);
  }
});

// POST /api/chat — AI chat powered by Groq (free, global, OpenAI-compatible)
const ADIXO_SYSTEM_PROMPT = `You are ADIXO AI, the official smart assistant for ADIXO TOP UP — a premium gaming credit hub based in Bangladesh. You know everything about this website: every product, price, service, and process. You are helpful, friendly, and professional.

LANGUAGE RULE — follow this exactly, no exceptions:
1. If the user writes ONLY in Bangla (Bengali script or pure Bangla words), reply ONLY in Bangla. Do not include any English.
2. If the user writes ONLY in English, reply ONLY in English. Do not include any Bangla.
3. If the user writes in Banglish (a mix of English letters to write Bangla words, e.g. "etar price koto?" or "vai amake help koro"), reply in BOTH Bangla AND English — give the full answer first in Bangla, then repeat the same answer in English below it.
Always be fluent and natural. Never switch languages unless rule 3 applies.

━━━━━━━━━━━━━━━━━━━━━━━━
ABOUT ADIXO
━━━━━━━━━━━━━━━━━━━━━━━━
ADIXO is a trusted, premium game top-up and services platform. We offer fast, safe, and affordable gaming credits, memberships, AI bots, level up services, and PC games. Our Telegram: @adixoglory (updates), @AdiXO_TV (payment support).

━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO ORDER (Step-by-step)
━━━━━━━━━━━━━━━━━━━━━━━━
1. Go to the game you want on the homepage (e.g. Free Fire, PUBG, Mobile Legends, etc.)
2. Click the game card to open its package list
3. Select a package (diamonds, UC, membership, etc.)
4. Enter your Player ID (or User ID + Zone ID for ML)
5. Choose a payment method: bKash, Nagad, Rocket, or Binance
6. Send the exact amount to the payment number shown
7. Enter your Transaction ID (TrxID) in the field
8. Click "Confirm & Pay" — your order is submitted instantly
9. Orders are processed within minutes. You'll see status updates in your Order History.
10. For issues, contact @AdiXO_TV on Telegram.

━━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT METHODS
━━━━━━━━━━━━━━━━━━━━━━━━
- bKash (pink) — most popular
- Nagad (orange)
- Rocket (purple)
- Binance (crypto, yellow)
All payments are in BDT (Bangladeshi Taka) unless otherwise stated.

━━━━━━━━━━━━━━━━━━━━━━━━
FREE FIRE — Diamond Top-Up Prices (BDT)
━━━━━━━━━━━━━━━━━━━━━━━━
25 Diamonds = ৳25 | 50 = ৳40 | 115 = ৳80 | 240 = ৳160 | 355 = ৳240 | 480 = ৳320 | 505 = ৳340 (Popular) | 610 = ৳405 | 725 = ৳485 | 1240 = ৳810 | 2530 = ৳1620 | 5060 = ৳3240 | 7590 = ৳4865 | 10120 = ৳6490 | 12650 = ৳8100

FREE FIRE — Memberships:
Weekly Membership = ৳160 | Monthly Membership = ৳785 | Weekly Lite = ৳45 | 4×Weekly Lite = ৳180
Evo 3 Days = ৳75 | Evo 7 Days = ৳113 | Evo 30 Days = ৳347

FREE FIRE — Level Up Pass:
6 Levels = ৳46 | 10 Levels = ৳82 | 15 Levels = ৳82 | 20 Levels = ৳82 | 25 Levels = ৳82 | 30 Levels = ৳133 | Full Level Up Pass = ৳500

━━━━━━━━━━━━━━━━━━━━━━━━
MOBILE LEGENDS — Diamond Top-Up (BDT)
━━━━━━━━━━━━━━━━━━━━━━━━
11 = ৳25 | 22 = ৳45 | 56 = ৳110 | 112 = ৳220 | 223 = ৳440 | 336 = ৳660 | 570 = ৳1095 | 1163 = ৳2190 | 2398 = ৳4385 | 6042 = ৳11020
Bundle packs: 55+45 = ৳105 | 165+135 = ৳305 | 275+225 = ৳490 | 565+435 = ৳1010

ML Memberships: Elite Weekly = ৳105 | Epic Monthly = ৳530 | Weekly Pass = ৳200 | Twilight Pass = ৳1040
(Note: ML requires User ID + Zone ID)

━━━━━━━━━━━━━━━━━━━━━━━━
PUBG MOBILE — UC Top-Up (BDT)
━━━━━━━━━━━━━━━━━━━━━━━━
60 UC = ৳120 | 120 = ৳240 | 180 = ৳360 | 240 = ৳475 | 325 = ৳600 (Popular) | 385 = ৳730 | 660 = ৳1200 | 720 = ৳1340 | 985 = ৳1825 | 1800 = ৳2950 | 3850 = ৳5875 | 8100 = ৳11750 | 16200 = ৳23500

PUBG Memberships: Royale Pass Lv50 = ৳730 | Royale Pass Lv100 = ৳1340 | A16 Elite Pass (1-100) = ৳1320 | A16 Elite Plus (1-100) = ৳3235 | Bonus Pass (1-60) = ৳1800
Special: Speed Drift Guaranteed = ৳35780

━━━━━━━━━━━━━━━━━━━━━━━━
BLOOD STRIKE — Gold Top-Up (BDT)
━━━━━━━━━━━━━━━━━━━━━━━━
51 Gold = ৳54 | 105 = ৳98 | 320 = ৳337 | 540 = ৳490 | 1100 = ৳975 | 2260 = ৳1950 | 5800 = ৳4880
Memberships: Value Season Pass = ৳135 | Lucky Bag Week = ৳124 | Valor Pre-Order = ৳240 | Ultra Skin Lucky Chest = ৳59 | Strike Pass Elite = ৳455 | Strike Pass Premium = ৳1020
Level Up Pass = ৳235

━━━━━━━━━━━━━━━━━━━━━━━━
CALL OF DUTY: MOBILE — COD Points (BDT)
━━━━━━━━━━━━━━━━━━━━━━━━
80 CP = ৳132 | 240 = ৳363 | 420 = ৳605 | 880 = ৳1210 | 2400 = ৳3025 | 5000 = ৳6050 | 10800 = ৳12100
Weekly Supply Pass = ৳132 | Monthly Supply Pass = ৳484

━━━━━━━━━━━━━━━━━━━━━━━━
AI BOTS SERVICE (Free Fire Guild Bots)
━━━━━━━━━━━━━━━━━━━━━━━━
GLORY PACKAGES (bot teams for guild ranking):
- Regional Elite: Guild Lvl 6 + Region Top 100 = ৳1764
- Regional Master: Guild Lvl 6 + Region Top 50 = ৳2268 (Popular)
- Regional Grandmaster: Guild Lvl 7 + Region Top 30 = ৳3276

HIRE BOTS:
- Starter Bots: 2 Bots × 1 Week = ৳1386
- Pro/Glory Bots: 4 Bots × 1 Week = ৳2520

MYSTERY BOXES (random glory drops):
- Basic Mystery Box: 4 Bots | 50K–370K Glory = ৳252
- Epic Mystery Box: 4 Bots | 350K–1.2M Glory = ৳504
- Super Mystery Box: 4 Bots | 1.2M–3.4M Glory = ৳1008

GUILD LEVEL UP:
- Level 5 = ৳550 | Level 6 = ৳850 | Level 7 + 4-Week Glory Bonus = ৳1400

━━━━━━━━━━━━━━━━━━━━━━━━
LEVEL UP SERVICE (Free Fire Character Level)
━━━━━━━━━━━━━━━━━━━━━━━━
Level 1→30 = ৳600 | 30→40 = ৳850 | 40→50 = ৳1800 | 50→60 = ৳3000 | 60→70 = ৳8000 | 70→80 = ৳20000 | 80→90 = ৳38000 | 90→100 (SUPREME) = ৳55000

━━━━━━━━━━━━━━━━━━━━━━━━
EVENT BYPASS (Free Fire)
━━━━━━━━━━━━━━━━━━━━━━━━
5 Event Bypass = ৳250 | 14 Event Bypass = ৳460 (Popular) | 30 = ৳830 | 60 = ৳1400

━━━━━━━━━━━━━━━━━━━━━━━━
BUY GUILD (Pre-leveled Free Fire Guilds)
━━━━━━━━━━━━━━━━━━━━━━━━
- FNHAD OFC Guild: Level 7, 50 Players, BD Server = ৳1400 (Popular)
- ADIXO Store Guild: Level 4, 35 Players, BD Server = ৳600

━━━━━━━━━━━━━━━━━━━━━━━━
FF LIKES (Free Fire Profile Likes)
━━━━━━━━━━━━━━━━━━━━━━━━
220 Likes/Day delivered daily:
14 Days (3080 total) = ৳210 (Popular) | 28 Days (6160) = ৳370 | 60 Days (13200) = ৳700 | 120 Days (26400) = ৳1300 | 150 Days (33000) = ৳1600 | 365 Days (80300) = ৳2500 | Unlimited (450/day, no end) = ৳3000

━━━━━━━━━━━━━━━━━━━━━━━━
FF PANEL (Tools & APK Mods) — All ৳100 each
━━━━━━━━━━━━━━━━━━━━━━━━
BRMod Android Root | BRMod SilentAim PC | Snake Carrom Pool | Drip Client APKMod | HG Cheat APKMod | LKTeam Root+PC | Drip Client Root | 8BP EZTeam Android | PSH4X 8Ball Pool | PaToTeam APKMod | Fluorite iOS FF | eSign Certificate | AKLoader Android | Prime APKMod | GBox Official | Haxxcker Root | Drip Client PC EXE
(License key sent to your Email/WhatsApp after payment)

━━━━━━━━━━━━━━━━━━━━━━━━
PC GAMES (30% discount, account delivered via Email/WhatsApp)
━━━━━━━━━━━━━━━━━━━━━━━━
GTA V Premium Online = ৳2254 (was ৳2990) | RDR2 = ৳3299 (was ৳6099) | Hitman 2 = ৳890 | Human: Fall Flat = ৳1150 | EA FC 25 = ৳1250 | FC 26 = ৳3795 | GTA 4 = ৳1790 | Resident Evil 4 = ৳2150 | Resident Evil 2 = ৳4949 | RE3 = ৳4729 | Cyberpunk 2077 = ৳5775 | Forza Horizon 5 Premium = ৳4399 | Spider-Man 2 = ৳6599 | God of War = ৳6919 | The Crew 2 = ৳3575 | The Crew Motorfest = ৳7205 | Watch Dogs Legion = ৳4179 | Cities Skylines II = ৳4399 | COD Black Ops III Zombies = ৳4069 | Assetto Corsa Competizione = ৳3839

━━━━━━━━━━━━━━━━━━━━━━━━
SUPPORT & CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━
Telegram Group (updates & community): https://t.me/adixoglory
Direct Support (payment & order issues): https://t.me/AdiXO_TV
We are available 24/7.

━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE STYLE
━━━━━━━━━━━━━━━━━━━━━━━━
- Be concise but complete. Use bullet points or tables for pricing lists.
- Be warm and helpful. Never be rude or dismissive.
- If you don't know something specific (like live stock status), tell the user to contact support on Telegram.
- Do NOT make up prices or information not in the above data.
- If someone asks how to pay or place an order, walk them through the steps clearly.
- For Bangla responses, use proper Bengali script. Don't mix scripts awkwardly.`;

app.post('/api/chat', async (req, res) => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(503).json({ error: 'AI service not configured. Please contact support on Telegram.' });
  }

  const { message, history = [] } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    // Build messages array for Groq (OpenAI-compatible)
    const recentHistory = history.slice(-20);
    const messages = [
      { role: 'system', content: ADIXO_SYSTEM_PROMPT },
      ...recentHistory.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);

    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty response from AI');
    res.json({ reply: text });
  } catch (err) {
    console.error('Groq chat error:', err.message);
    res.status(500).json({ error: 'AI temporarily unavailable. Please try again or contact support on Telegram.' });
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
    console.log('🤖 Telegram bot ready (webhook managed by Netlify)');
  }
});
