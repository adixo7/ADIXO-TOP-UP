function getBlobsCtx() {
  try {
    const raw = process.env.NETLIFY_BLOBS_CONTEXT;
    if (!raw) return null;
    return JSON.parse(Buffer.from(raw, 'base64').toString());
  } catch { return null; }
}

export const handler = async (event) => {
  const results = {
    hasTelegramToken: !!process.env.TELEGRAM_BOT_TOKEN,
    hasTelegramChatId: !!process.env.TELEGRAM_CHAT_ID,
    hasNetlifyBlobsContext: !!process.env.NETLIFY_BLOBS_CONTEXT,
  };

  const ctx = getBlobsCtx();
  if (ctx) {
    results.blobsCtxKeys = Object.keys(ctx);
    try {
      const { edgeURL, rawSiteID, token } = ctx;
      const putRes = await fetch(`${edgeURL}/${rawSiteID}/adixo-orders/test_key`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'test', ts: Date.now() }),
      });
      results.blobsWrite = putRes.ok ? 'OK' : `HTTP ${putRes.status}`;

      const getRes = await fetch(`${edgeURL}/${rawSiteID}/adixo-orders/test_key`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      results.blobsRead = getRes.ok ? 'OK' : `HTTP ${getRes.status}`;
    } catch (err) {
      results.blobsError = err.message;
    }
  } else {
    results.blobsError = 'NETLIFY_BLOBS_CONTEXT not available';
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results, null, 2),
  };
};
