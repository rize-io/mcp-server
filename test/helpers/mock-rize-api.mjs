// Preloaded into the server process with `node --import` so tests never reach
// the live Rize API. Any request to another host fails loudly.
const RIZE_API_URL = 'https://api.rize.io/api/v1/graphql';

globalThis.fetch = async (url, init = {}) => {
  if (String(url) !== RIZE_API_URL) {
    throw new Error(`Unexpected network request in test: ${url}`);
  }

  const body = JSON.parse(init.body ?? '{}');
  const auth = init.headers?.Authorization ?? '';

  if (auth !== 'Bearer test-api-key') {
    return new Response('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  }

  if (body.variables?.id === 'missing') {
    return Response.json({ errors: [{ message: 'Record not found' }] });
  }

  return Response.json({
    data: {
      mock: true,
      operation: body.query.trim().split(/\s+/).slice(0, 2).join(' '),
      variables: body.variables ?? null,
    },
  });
};
