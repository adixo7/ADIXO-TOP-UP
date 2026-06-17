import { getStore } from '@netlify/blobs';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export const handler = async (event) => {
  const id = event.queryStringParameters?.id || event.path.split('/').pop();

  try {
    const store = getStore({ name: 'orders', consistency: 'strong' });
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
