import { isBadName, makeFilename } from './naming.js';
import { normalizeAiSettings, suggestAiStem } from './ai.js';

function webPage(value) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    url.hash = '';
    return url;
  } catch {
    return null;
  }
}

async function sourceTitle(referrer, incognito) {
  const tabs = await chrome.tabs.query({ url: referrer.protocol + '//' + referrer.hostname + '/*' });
  const matches = tabs.filter(tab => Boolean(tab.incognito) === incognito &&
    webPage(tab.url)?.href === referrer.href);
  if (!matches.length || matches.some(tab => tab.title !== matches[0].title)) return '';
  return matches[0].title?.trim() || '';
}

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  if (!item.filename || item.byExtensionId || !isBadName(item.filename)) {
    suggest();
    return;
  }
  const referrer = webPage(item.referrer);
  // A bare origin can describe any page on the site, including a tab already closed.
  if (!referrer || (referrer.pathname === '/' && !referrer.search)) {
    suggest();
    return;
  }

  let fallback;
  let finished = false;
  const controller = new AbortController();
  const finish = filename => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    controller.abort();
    if (filename) suggest({ filename, conflictAction: 'uniquify' });
    else suggest();
  };
  const timer = setTimeout(() => finish(fallback), 6000);

  async function decide() {
    const title = await sourceTitle(referrer, Boolean(item.incognito));
    if (!title || finished) return;
    fallback = makeFilename(item.filename, item.mime, title, referrer.hostname);
    if (item.incognito) return fallback;
    const { aiSettings } = await chrome.storage.local.get('aiSettings');
    const settings = normalizeAiSettings(aiSettings);
    if (!settings || finished) return fallback;
    const granted = await chrome.permissions.contains({ origins: [settings.originPattern] });
    if (!granted || finished) return fallback;
    const filename = item.filename.replaceAll('\\', '/').split('/').at(-1);
    const stem = await suggestAiStem(settings, { filename, title }, { signal: controller.signal });
    return makeFilename(item.filename, item.mime, title, referrer.hostname, stem || '') || fallback;
  }

  decide().then(finish, () => finish(fallback));
  return true;
});
