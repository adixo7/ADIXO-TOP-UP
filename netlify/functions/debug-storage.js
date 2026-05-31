import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  const results = {};

  try {
    const store = getStore({
      name: 'adixo-orders',
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_TOKEN,
    });
    await store.setJSON('test_key', { status: 'test', ts: Date.now() });
    results.write = 'OK';
    const val = await store.get('test_key', { type: 'json' });
    results.read = val ? `OK: ${JSON.stringify(val)}` : 'NULL';
  } catch (err) {
    results.error = err.message;
  }

  results.hasSiteID = !!process.env.SITE_ID;
  results.hasToken = !!process.env.NETLIFY_TOKEN;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results, null, 2),
  };
};
