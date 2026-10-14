import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/reflection.js';

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    setHeader(name, value) { this.headers[name] = value; },
  };
}

function createRequest(method = 'POST', body = {}) {
  return { method, body };
}

test('rejects methods other than POST', async () => {
  const response = createResponse();
  await handler(createRequest('GET'), response);
  assert.equal(response.statusCode, 405);
});

test('rejects unknown topics', async () => {
  const response = createResponse();
  await handler(createRequest('POST', { topics: ['diagnosis'] }), response);
  assert.equal(response.statusCode, 400);
});

test('rejects more than five topics', async () => {
  const response = createResponse();
  await handler(createRequest('POST', { topics: ['stress', 'anxiety', 'low', 'sleep', 'talk', 'extra'] }), response);
  assert.equal(response.statusCode, 400);
});

test('requires at least one topic', async () => {
  const response = createResponse();
  await handler(createRequest('POST', { topics: [] }), response);
  assert.equal(response.statusCode, 400);
});

test('returns a local fallback signal when no Gemini key is configured', async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    const response = createResponse();
    await handler(createRequest('POST', { topics: ['stress'] }), response);
    assert.equal(response.statusCode, 503);
  } finally {
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  }
});

test('returns a short reflection and does not cache it', async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.GEMINI_API_KEY = 'test-key';
  let sentBody;
  globalThis.fetch = async (_url, options) => {
    sentBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'You deserve support at your pace.' }] } }] }),
    };
  };
  try {
    const response = createResponse();
    await handler(createRequest('POST', { topics: ['stress', 'sleep'] }), response);
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.reflection, 'You deserve support at your pace.');
    assert.equal(response.headers['Cache-Control'], 'no-store');
    assert.equal(sentBody.contents[0].parts[0].text, 'Selected check-in topics: stress, sleep.');
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  }
});

test('returns a safe error when Gemini is unavailable', async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.GEMINI_API_KEY = 'test-key';
  globalThis.fetch = async () => ({ ok: false });
  try {
    const response = createResponse();
    await handler(createRequest('POST', { topics: ['talk'] }), response);
    assert.equal(response.statusCode, 502);
    assert.deepEqual(response.body, { error: 'AI reflection is unavailable' });
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  }
});
