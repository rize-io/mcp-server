import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { RizeClient, QUERIES, MUTATIONS } from '../dist/rize-client.js';

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

function stubFetch(handler) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return handler(url, init);
  };
  return calls;
}

test('query posts the GraphQL document and bearer token to the Rize API', async () => {
  const calls = stubFetch(() => Response.json({ data: { currentUser: { email: 'a@b.c' } } }));
  const client = new RizeClient('secret-key');

  const data = await client.query(QUERIES.GET_CURRENT_USER, { first: 5 });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.rize.io/api/v1/graphql');
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer secret-key');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    query: QUERIES.GET_CURRENT_USER,
    variables: { first: 5 },
  });
  assert.deepEqual(data, { currentUser: { email: 'a@b.c' } });
});

test('query rejects on non-2xx HTTP responses without parsing the body', async () => {
  stubFetch(() => new Response('nope', { status: 401, statusText: 'Unauthorized' }));
  const client = new RizeClient('bad-key');

  await assert.rejects(client.query(QUERIES.GET_CURRENT_USER), {
    message: 'Rize API error: 401 Unauthorized',
  });
});

test('query surfaces GraphQL errors as a single joined message', async () => {
  stubFetch(() =>
    Response.json({ errors: [{ message: 'Not found' }, { message: 'Forbidden' }] })
  );
  const client = new RizeClient('key');

  await assert.rejects(client.query(QUERIES.GET_PROJECT, { id: 'x' }), {
    message: 'GraphQL error: Not found, Forbidden',
  });
});

test('every predefined operation is a non-empty query or mutation document', () => {
  for (const [name, doc] of Object.entries(QUERIES)) {
    assert.match(doc.trim(), /^query\s/, `QUERIES.${name} must start with "query"`);
  }
  for (const [name, doc] of Object.entries(MUTATIONS)) {
    assert.match(doc.trim(), /^mutation\s/, `MUTATIONS.${name} must start with "mutation"`);
  }
});
