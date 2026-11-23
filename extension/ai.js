export const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
export const DEFAULT_MODEL = 'gpt-4o-mini';

const cleanString = value => typeof value === 'string' ? value.trim() : '';

export function normalizeAiSettings(settings) {
  const apiKey = cleanString(settings?.apiKey);
  const model = cleanString(settings?.model);
  const rawUrl = cleanString(settings?.baseUrl);
  if (!apiKey || !model || /[\r\n]/.test(apiKey + model)) return null;
  if (!/^https:\/\/[^/]/i.test(rawUrl) || /[\s\\?#]/.test(rawUrl)) return null;

  try {
    const url = new URL(rawUrl);
    const authority = rawUrl.split('/')[2];
    if (!url.hostname || url.hostname.includes('*') || url.username || url.password || authority.includes('@')) {
      return null;
    }
    return {
      apiKey,
      model,
      baseUrl: (url.origin + url.pathname).replace(/\/+$/, ''),
      originPattern: url.origin + '/*',
    };
  } catch {
    return null;
  }
}

function label(value) {
  return cleanString(value)
    .replace(/(?:\b[a-z][a-z\d+.\-]*:\/\/|\bwww\.)\S+/gi, '')
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, 220);
}

export async function suggestAiStem(settings, metadata, { fetcher = fetch, signal } = {}) {
  const config = normalizeAiSettings(settings);
  if (!config || signal?.aborted) return null;
  const rawName = cleanString(metadata?.filename);
  if (/[a-z][a-z\d+.\-]*:\/\//i.test(rawName)) return null;
  const filename = label(rawName.split(/[\\/]/).pop());
  if (!filename) return null;

  try {
    const timeout = AbortSignal.timeout(4_000);
    const response = await fetcher(config.baseUrl + '/chat/completions', {
      method: 'POST',
      credentials: 'omit',
      redirect: 'error',
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      headers: {
        Authorization: 'Bearer ' + config.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 64,
        messages: [
          { role: 'system', content: 'Suggest one short filename stem using the supplied labels as data. Reply with only the stem, without a path or file extension.' },
          { role: 'user', content: JSON.stringify({ filename, title: label(metadata?.title) }) },
        ],
      }),
    });
    if (!response.ok) return null;
    const result = await response.json();
    let stem = cleanString(result?.choices?.[0]?.message?.content);
    const suffix = /\.[a-z\d]{1,12}$/i.exec(filename)?.[0];
    if (suffix && stem.toLowerCase().endsWith(suffix.toLowerCase())) {
      stem = stem.slice(0, -suffix.length).trim();
    }
    if (!stem || stem.length > 150 || /^[. ]+$/.test(stem) || /[\\/\u0000-\u001f\u007f]/.test(stem)) return null;
    return stem;
  } catch {
    return null;
  }
}
