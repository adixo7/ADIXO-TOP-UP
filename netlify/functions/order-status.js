import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const id = event.queryStringParameters?.id || event.path.split('/').pop();

  try {
    const store = getStore('adixo-orders');
    const data = await store.get(`status_${id}`, { type: 'json' });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: data?.status || 'processing' }),
    };
  } catch (err) {
    console.warn('Blobs read error:', err.message);
    return { statusCode: 200, headers, body: JSON.stringify({ status: 'processing' }) };
  }
};
