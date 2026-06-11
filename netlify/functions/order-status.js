function getBlobsCtx() {
  try {
    const raw = process.env.NETLIFY_BLOBS_CONTEXT;
    if (!raw) return null;
    return JSON.parse(Buffer.from(raw, 'base64').toString());
  } catch { return null; }
}

async function readStatus(orderId) {
  try {
    const ctx = getBlobsCtx();
    if (!ctx) return null;
    const { edgeURL, rawSiteID, token } = ctx;
    const res = await fetch(`${edgeURL}/${rawSiteID}/adixo-orders/status_${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const id = event.queryStringParameters?.id || event.path.split('/').pop();

  const data = await readStatus(id);
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ status: data?.status || 'processing' }),
  };
};
