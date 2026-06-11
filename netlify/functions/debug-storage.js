import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  const results = {};

  results.hasTelegramToken = !!process.env.TELEGRAM_BOT_TOKEN;
  results.hasTelegramChatId = !!process.env.TELEGRAM_CHAT_ID;
  results.hasSiteID = !!process.env.SITE_ID;
  results.hasNetlifyToken = !!process.env.NETLIFY_TOKEN;

  try {
    const store = getStore('adixo-orders');
    await store.setJSON('test_key', { status: 'test', ts: Date.now() });
    results.blobsWrite = 'OK';
    const val = await store.get('test_key', { type: 'json' });
    results.blobsRead = val ? `OK: ${JSON.stringify(val)}` : 'NULL';
  } catch (err) {
    results.blobsError = err.message;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results, null, 2),
  };
};
