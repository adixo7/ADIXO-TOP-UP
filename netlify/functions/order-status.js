export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const BACKEND = process.env.REPLIT_BACKEND_URL;
  if (!BACKEND) return { statusCode: 500, headers, body: JSON.stringify({ status: 'processing' }) };

  const id = event.queryStringParameters?.id || event.path.split('/').pop();

  try {
    const res = await fetch(`${BACKEND}/api/order/${id}`);
    const data = await res.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch {
    return { statusCode: 200, headers, body: JSON.stringify({ status: 'processing' }) };
  }
};
