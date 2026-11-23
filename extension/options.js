import { DEFAULT_BASE_URL, DEFAULT_MODEL, normalizeAiSettings } from './ai.js';

const form = document.querySelector('#ai-form');
const controls = document.querySelector('#controls');
const keyInput = document.querySelector('#api-key');
const baseInput = document.querySelector('#base-url');
const modelInput = document.querySelector('#model');
const advanced = document.querySelector('#advanced');
const clearButton = document.querySelector('#clear');
const note = document.querySelector('#ai-note');
const status = document.querySelector('#status');

let saved = null;

function message(text, error = false) {
  status.dataset.error = String(error);
  status.textContent = text;
}

function describeService() {
  let destination = '';
  try {
    const url = new URL(baseInput.value);
    if (url.protocol === 'https:' && !url.username && !url.password) destination = url.host;
  } catch {
    // The address may be incomplete while the user is typing.
  }
  note.textContent = destination
    ? '启用后，只将待改名的文件名和网页标题发送至 ' + destination + '。'
    : '填写你自己的 API Key 和兼容服务的 HTTPS 地址。';
}

function showSettings(settings, hasStoredSettings) {
  saved = settings;
  baseInput.value = settings?.baseUrl ?? DEFAULT_BASE_URL;
  modelInput.value = settings?.model ?? DEFAULT_MODEL;
  keyInput.value = '';
  keyInput.placeholder = settings ? '已保存，留空保留原密钥' : '';
  clearButton.hidden = !hasStoredSettings;
  describeService();
}

async function load() {
  try {
    const { aiSettings } = await chrome.storage.local.get('aiSettings');
    const settings = normalizeAiSettings(aiSettings);
    showSettings(settings, aiSettings != null);
    if (aiSettings != null && !settings) message('已保存的配置无效，请重新填写或清除。', true);
    controls.disabled = false;
  } catch {
    message('无法读取本机设置，请重新打开设置页。', true);
  }
}

async function releaseOrigin(pattern) {
  if (!pattern) return true;
  try {
    await chrome.permissions.remove({ origins: [pattern] });
    return true;
  } catch {
    return false;
  }
}

function sameSettings(a, b) {
  return a?.baseUrl === b?.baseUrl && a?.model === b?.model && a?.apiKey === b?.apiKey;
}

baseInput.addEventListener('input', describeService);
form.addEventListener('invalid', (event) => {
  if (advanced.contains(event.target)) advanced.open = true;
}, true);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (controls.disabled) return;
  const typedKey = keyInput.value.trim();
  if (!typedKey && !saved) {
    message('请填写你自己的 API Key。', true);
    keyInput.focus();
    return;
  }
  const next = normalizeAiSettings({
    apiKey: typedKey || saved.apiKey,
    baseUrl: baseInput.value.trim(),
    model: modelInput.value.trim(),
  });
  if (!next) {
    advanced.open = true;
    message('请检查 API Key、模型和 HTTPS 服务地址。', true);
    return;
  }
  if (!typedKey && next.baseUrl !== saved.baseUrl) {
    message('更换服务地址时，请重新填写该服务的 API Key。', true);
    keyInput.focus();
    return;
  }

  controls.disabled = true;
  try {
    // Request permission directly from the submit gesture, before any async work.
    const allowed = await chrome.permissions.request({ origins: [next.originPattern] });
    if (!allowed) {
      message('未获得该服务的网站权限，设置未保存。', true);
      return;
    }
    await navigator.locks.request('pigeonhole-ai-settings', async () => {
      const { aiSettings } = await chrome.storage.local.get('aiSettings');
      const current = normalizeAiSettings(aiSettings);
      if (!sameSettings(current, saved)) {
        showSettings(current, aiSettings != null);
        message('设置已在其他页面更改，请重新确认。', true);
        return;
      }
      const { baseUrl, model, apiKey } = next;
      await chrome.storage.local.set({ aiSettings: { baseUrl, model, apiKey } });
      showSettings(next, true);
      if (current && current.originPattern !== next.originPattern && !(await releaseOrigin(current.originPattern))) {
        message('设置已保存。旧服务的网站权限可在扩展管理中移除。');
        return;
      }
      message('已保存，AI 命名已启用。');
    });
  } catch {
    message('未能保存设置，请检查该服务的网站权限后重试。', true);
  } finally {
    controls.disabled = false;
  }
});

clearButton.addEventListener('click', async () => {
  if (controls.disabled) return;
  controls.disabled = true;
  try {
    await navigator.locks.request('pigeonhole-ai-settings', async () => {
      const { aiSettings } = await chrome.storage.local.get('aiSettings');
      const current = normalizeAiSettings(aiSettings);
      await chrome.storage.local.remove('aiSettings');
      showSettings(null, false);
      const released = await releaseOrigin(current?.originPattern);
      message(released ? '密钥已清除，下载将使用本地命名。' : '密钥已清除。网站权限可在扩展管理中移除。');
    });
  } catch {
    message('未能清除密钥，请重试。', true);
  } finally {
    controls.disabled = false;
  }
});

void load();
