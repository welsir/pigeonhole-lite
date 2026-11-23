import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_BASE_URL, DEFAULT_MODEL, normalizeAiSettings, suggestAiStem } from '../extension/ai.js';

const settings = { apiKey: 'test-only', model: DEFAULT_MODEL, baseUrl: 'https://model.example/v1/' };
const metadata = { filename: 'notes.pdf', title: 'Project notes' };
const reply = content => Response.json({ choices: [{ message: { content } }] });

test('requires an explicit key, model, and HTTPS endpoint without credentials, query or fragment', () => {
  assert.equal(DEFAULT_BASE_URL, 'https://api.openai.com/v1');
  assert.deepEqual(normalizeAiSettings({ ...settings, apiKey: ' test-only ', model: ' model ' }), {
    apiKey: 'test-only', model: 'model', baseUrl: 'https://model.example/v1', originPattern: 'https://model.example/*',
  });
  for (const value of [
    null, {}, { ...settings, apiKey: ' ' }, { ...settings, model: '' },
    ...['', 'model.example', 'http://model.example', 'https://user@model.example', 'https://@model.example',
      'https://model.example/?query=1', 'https://model.example/?', 'https://model.example/#', 'https://model.example/#section',
      'https://*.example', 'https://%2a.example', 'https://model.example\\path'].map(baseUrl => ({ ...settings, baseUrl })),
  ]) {
    assert.equal(normalizeAiSettings(value), null);
  }
});

test('invalid settings, cancelled requests, and missing filenames make zero network calls', async () => {
  let calls = 0;
  const fetcher = async () => { calls++; return reply('unexpected'); };
  for (const value of [null, {}, { ...settings, apiKey: '' }, { ...settings, baseUrl: 'http://model.example' }]) {
    assert.equal(await suggestAiStem(value, metadata, { fetcher }), null);
  }
  assert.equal(await suggestAiStem(settings, {}, { fetcher }), null);
  assert.equal(await suggestAiStem(settings, { filename: 'https://internal.example/private/file' }, { fetcher }), null);
  assert.equal(await suggestAiStem(settings, metadata, { fetcher, signal: AbortSignal.abort() }), null);
  assert.equal(calls, 0);
});

test('sends only bounded filename/title labels and returns a stem', async () => {
  let calls = 0;
  const fetcher = async (url, req) => {
    calls++;
    assert.equal(url, 'https://model.example/v1/chat/completions');
    assert.equal(req.method, 'POST');
    assert.equal(req.credentials, 'omit');
    assert.equal(req.redirect, 'error');
    assert.equal(req.referrerPolicy, 'no-referrer');
    assert.equal(req.headers.Authorization, 'Bearer test-only');
    assert.ok(req.signal instanceof AbortSignal);
    const body = JSON.parse(req.body);
    assert.equal(body.model, DEFAULT_MODEL);
    assert.deepEqual(JSON.parse(body.messages[1].content), { filename: 'notes.pdf', title: 'Meeting' });
    assert.doesNotMatch(req.body, /private-dir|intranet\.example|extra-body-content|test-only/);
    return reply('Meeting notes.PDF');
  };
  const stem = await suggestAiStem(settings, {
    filename: 'private-dir/notes.pdf',
    title: 'Meeting https://intranet.example/private',
    url: 'https://intranet.example/',
    text: 'extra-body-content',
  }, { fetcher });
  assert.equal(stem, 'Meeting notes');
  assert.equal(calls, 1);
});

test('provider errors, malformed replies, blank and unsafe names yield no suggestion', async () => {
  for (const fetcher of [
    async () => { throw new Error('network failure'); },
    async () => new Response(null, { status: 401 }),
    async () => new Response('invalid JSON'),
    async () => Response.json({ choices: [] }),
    ...['', ' ', '.pdf', '../folder', '..', 'a\nb', 'a'.repeat(151)].map(value => async () => reply(value)),
  ]) {
    assert.equal(await suggestAiStem(settings, metadata, { fetcher }), null);
  }
});

test('caller cancellation stops an in-flight request', async () => {
  const controller = new AbortController();
  let observed = false;
  const fetcher = async (_url, { signal }) => new Promise((_, reject) => {
    signal.addEventListener('abort', () => { observed = true; reject(signal.reason); }, { once: true });
  });
  const pending = suggestAiStem(settings, metadata, { fetcher, signal: controller.signal });
  controller.abort();
  assert.equal(await pending, null);
  assert.equal(observed, true);
});

test('bounds provider latency without caller cancellation', async () => {
  let abortedByTimeout = false;
  const fetcher = (_url, { signal }) => new Promise((_, reject) => {
    const watchdog = setTimeout(() => reject(new Error('request exceeded timeout')), 6000);
    signal.addEventListener('abort', () => {
      clearTimeout(watchdog);
      abortedByTimeout = signal.reason.name === 'TimeoutError';
      reject(signal.reason);
    }, { once: true });
  });
  assert.equal(await suggestAiStem(settings, metadata, { fetcher }), null);
  assert.equal(abortedByTimeout, true);
});
