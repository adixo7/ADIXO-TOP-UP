import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const id = event.queryStringParameters?.id || event.path.split('/').pop();

  try {
    const store = getStore('orders');
    const order = await store.get(id, { type: 'json' });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: order ? order.status : 'processing' }),
    };
  } catch {
    return { statusCode: 200, headers, body: JSON.stringify({ status: 'processing' }) };
  }
};
