import { getStore } from '@netlify/blobs';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function getSiteStore() {
  return getStore({ name: 'site-control', siteID: process.env.SITE_ID, token: process.env.NETLIFY_ACCESS_TOKEN });
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const store = getSiteStore();
    const status = await store.get('status', { type: 'json' });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(status || { maintenance: false, announcement: null, activeBanner: 0 }),
    };
  } catch {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ maintenance: false, announcement: null, activeBanner: 0 }),
    };
  }
};
