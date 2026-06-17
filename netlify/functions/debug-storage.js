import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  const results = {
    hasTelegramToken: !!process.env.TELEGRAM_BOT_TOKEN,
    hasTelegramChatId: !!process.env.TELEGRAM_CHAT_ID,
    hasNetlifyAccessToken: !!process.env.NETLIFY_ACCESS_TOKEN,
    hasSiteId: !!process.env.SITE_ID,
    siteId: process.env.SITE_ID || 'NOT SET',
    hasNetlifyBlobsContext: !!process.env.NETLIFY_BLOBS_CONTEXT,
  };

  // Test Blobs with explicit credentials
  if (process.env.NETLIFY_ACCESS_TOKEN && process.env.SITE_ID) {
    try {
      const store = getStore({
        name: 'orders',
        siteID: process.env.SITE_ID,
        token: process.env.NETLIFY_ACCESS_TOKEN,
      });
      await store.setJSON('__test__', { ok: true, ts: Date.now() });
      const val = await store.get('__test__', { type: 'json' });
      results.blobsTest = val?.ok === true ? '✅ WORKING' : '❌ Read failed';
    } catch (err) {
      results.blobsTest = `❌ ERROR: ${err.message}`;
    }
  } else {
    results.blobsTest = '⚠️ Skipped — NETLIFY_ACCESS_TOKEN or SITE_ID missing';
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results, null, 2),
  };
};
