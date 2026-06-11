import { getStore } from '@netlify/blobs';

function getOrderStore() {
  return getStore({
    name: 'adixo-orders',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_ACCESS_TOKEN,
  });
}

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const id = event.queryStringParameters?.id || event.path.split('/').pop();

  try {
    const store = getOrderStore();
    const data = await store.get(`status_${id}`, { type: 'json' });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: data?.status || 'processing' }),
    };
  } catch {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'processing' }),
    };
  }
};
