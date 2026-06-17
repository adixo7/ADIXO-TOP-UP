import { getStore } from '@netlify/blobs';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

function getOrderStore() {
  return getStore({
    name: 'orders',
    siteID: process.env.SITE_ID,
    token: process.env.NETLIFY_ACCESS_TOKEN,
  });
}

export const handler = async (event) => {
  const id = event.queryStringParameters?.id || event.path.split('/').pop();

  try {
    const store = getOrderStore();
    const order = await store.get(id, { type: 'json' });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: order ? order.status : 'processing' }),
    };
  } catch (err) {
    console.error('Blobs read error:', err.message);
    return { statusCode: 200, headers, body: JSON.stringify({ status: 'processing' }) };
  }
};
