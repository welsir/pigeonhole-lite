import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

let handleDownload;
let tabs, aiSettings, granted, calls, request, permissionChecks;
globalThis.chrome = {
  action: { onClicked: { addListener() {} } },
  downloads: { onDeterminingFilename: { addListener(fn) { handleDownload = fn; } } },
  tabs: { query: async () => tabs },
  permissions: { contains: async () => { permissionChecks++; return granted; } },
  storage: { local: { get: async () => ({ aiSettings }) } },
};
await import('../extension/background.js');

const referrer = 'https://example.test/reports';
const item = { filename: '附件1.pdf', referrer, mime: 'application/pdf' };
const mockSettings = { baseUrl: 'https://model.example.test/v1', apiKey: 'unit-test', model: 'demo' };

beforeEach(() => {
  aiSettings = null;
  granted = false;
  calls = 0;
  permissionChecks = 0;
  tabs = [{ url: referrer, title: '季度报告 | 示例站' }];
  request = async () => Response.json({ choices: [{ message: { content: '第四季度报告' } }] });
  globalThis.fetch = (...args) => { calls++; return request(...args); };
});

async function resolveDownload(value) {
  const suggestions = [];
  await new Promise(resolve => handleDownload(value, suggestion => {
    suggestions.push(suggestion);
    resolve();
  }));
  assert.equal(suggestions.length, 1);
  return suggestions[0];
}

test('basic naming works without a key and makes no permission or model request', async () => {
  assert.deepEqual(await resolveDownload(item), { filename: '季度报告_示例站.pdf', conflictAction: 'uniquify' });
  assert.equal(calls, 0);
  assert.equal(permissionChecks, 0);
});

test('preserves readable names, other extensions’ downloads and missing or ambiguous sources', async () => {
  aiSettings = mockSettings;
  granted = true;
  assert.equal(await resolveDownload({ ...item, filename: '季度报告.pdf' }), undefined);
  assert.equal(await resolveDownload({ ...item, byExtensionId: 'another-extension' }), undefined);
  assert.equal(await resolveDownload({ ...item, referrer: '' }), undefined);
  tabs.push({ url: 'https://example.test/', title: 'An unrelated home page' });
  assert.equal(await resolveDownload({ ...item, referrer: 'https://example.test/' }), undefined);
  assert.equal(calls, 0);
});

test('a bare origin never borrows even the only open tab title or calls a configured model', async () => {
  aiSettings = mockSettings;
  granted = true;
  const root = 'https://example.test/';
  for (const url of [root, root + 'other-page']) {
    tabs = [{ url, title: 'Unrelated title' }];
    assert.equal(await resolveDownload({ ...item, referrer: root }), undefined);
  }
  assert.equal(permissionChecks, 0);
  assert.equal(calls, 0);
});

test('uses only local rules if the host permission is missing or the download is private', async () => {
  aiSettings = mockSettings;
  assert.equal((await resolveDownload(item)).filename, '季度报告_示例站.pdf');
  granted = true;
  tabs[0].incognito = true;
  assert.equal((await resolveDownload({ ...item, incognito: true })).filename, '季度报告_示例站.pdf');
  assert.equal(calls, 0);
});

test('uses a permitted user model and preserves a safe local result on provider errors', async () => {
  aiSettings = mockSettings;
  granted = true;
  assert.equal((await resolveDownload(item)).filename, '第四季度报告_示例站.pdf');
  request = async () => new Response('', { status: 401 });
  assert.equal((await resolveDownload(item)).filename, '季度报告_示例站.pdf');
  assert.equal(calls, 2);
});

test('finishes exactly once when a provider resolves after the download deadline', async t => {
  aiSettings = mockSettings;
  granted = true;
  let releaseResponse, notifyStarted;
  const started = new Promise(resolve => { notifyStarted = resolve; });
  request = () => new Promise(resolve => {
    releaseResponse = resolve;
    notifyStarted();
  });
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const suggestions = [];
  const pending = handleDownload(item, value => suggestions.push(value));
  assert.equal(pending, true);
  await started;
  t.mock.timers.tick(6001);
  assert.deepEqual(suggestions, [{ filename: '季度报告_示例站.pdf', conflictAction: 'uniquify' }]);
  releaseResponse(Response.json({ choices: [{ message: { content: '晚到的建议' } }] }));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(suggestions.length, 1);
});
