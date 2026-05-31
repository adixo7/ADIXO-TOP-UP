import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  const results = {};

  // Test 1: Can we write?
  try {
    const store = getStore('adixo-orders');
    await store.setJSON('test_key', { status: 'test', ts: Date.now() });
    results.write = 'OK';
  } catch (err) {
    results.write = `FAILED: ${err.message}`;
  }

  // Test 2: Can we read back?
  try {
    const store = getStore('adixo-orders');
    const val = await store.get('test_key', { type: 'json' });
    results.read = val ? `OK: ${JSON.stringify(val)}` : 'NULL (key not found)';
  } catch (err) {
    results.read = `FAILED: ${err.message}`;
  }

  // Test 3: Env vars present?
  results.hasContext = !!process.env.NETLIFY_BLOBS_CONTEXT;
  results.hasSiteID = !!process.env.SITE_ID;
  results.nodeEnv = process.env.NODE_ENV;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results, null, 2),
  };
};
