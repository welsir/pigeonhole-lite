import assert from 'node:assert/strict';
import test from 'node:test';
import { isBadName, makeFilename } from '../extension/naming.js';

test('recognizes the original generic, numeric, identifier and camera filename patterns', () => {
  for (const name of [
    '附件1 (2).pdf', 'download（3）.zip', '880013.pdf', 'abcdef0123456789.pdf',
    '00000000-0000-4000-8000-000000000000.pdf', '2401.12345v2.pdf',
    'AA20200100017.pdf', 'u=12,34&fmt=auto.jpg', 'IMG_0012.jpg',
    'mmexport1234567.png', 's1234-12-34.pdf', 'Abcd12345678Efgh.pdf',
  ]) assert.ok(isBadName(name), name);
  for (const name of ['采购清单.xlsx', 'Meeting notes.pdf', 'summer-trip.jpg', 'notes_v2.md']) {
    assert.equal(isBadName(name), false, name);
  }
});

test('keeps the browser suffix, falls back to a hostname and accepts a short AI suggestion', () => {
  const title = '会议纪要 | 示例站';
  assert.equal(makeFilename('file.pdf', '', title, 'example.test'), '会议纪要_示例站.pdf');
  assert.equal(makeFilename('file.pdf', '', title, 'example.test', '八月例会.pdf'), '八月例会_示例站.pdf');
  assert.equal(makeFilename('附件1', 'application/pdf', '会议纪要', 'www.example.test'), '会议纪要_example.test.pdf');
});

test('produces one portable basename within the byte limit', () => {
  const name = makeFilename('file.pdf', '', '../a/b:c\u202etest | lab', 'example.test');
  assert.doesNotMatch(name, /[/\\:\u202e]/u);
  assert.ok(name.endsWith('.pdf'));
  const long = makeFilename('file.pdf', '', '😀'.repeat(180), 'example.test');
  assert.ok(Buffer.byteLength(long) <= 240);
  assert.ok(long.endsWith('.pdf'));
  assert.equal(makeFilename('file', '', 'page.exe | example.com', 'example.com').includes('.'), false);
  assert.equal(makeFilename('file.pdf', '', 'CON', ''), '_CON.pdf');
  assert.equal(makeFilename('file.bad+ext', '', 'Report', ''), undefined);
});
