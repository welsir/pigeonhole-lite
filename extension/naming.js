function splitName(name) {
  const base = name.replaceAll('\\', '/').split('/').at(-1);
  const dot = base.lastIndexOf('.');
  return dot > 0 ? { stem: base.slice(0, dot), ext: base.slice(dot) } : { stem: base, ext: '' };
}

export function isBadName(name) {
  const { stem: raw } = splitName(name);
  // A browser's copy number never makes a name meaningful: 附件1 (2), download（3）.
  const stem = raw.replace(/\s*[(（]\d+[)）]$/, '').trim();
  return (
    /^\d+$/.test(stem) ||
    /^[a-f\d]{16,}$/i.test(stem) ||
    /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(stem) ||
    /^(?:附件|download|file|image|untitled|未命名|document|下载|图片|文件)[_\s()-]*\d*$/i.test(
      stem,
    ) ||
    (/^[A-Za-z\d+_=-]{16,}$/.test(stem) &&
      /[A-Z]/.test(stem) &&
      /\d/.test(stem) &&
      !/[ _-][a-z]{3,}/i.test(stem)) ||
    /^s\d{4,}-\d{2,}-\d+(?:-\w+)?$/i.test(stem) ||
    // arXiv identifiers: 2410.01234v2
    /^\d{4}\.\d{4,5}(?:v\d+)?$/i.test(stem) ||
    // Catalogue codes with a short uppercase prefix and a long number.
    /^[A-Z]{1,6}\d{8,}$/.test(stem) ||
    // Numeric image IDs used by CDNs.
    /^u=\d+,\d+(?:&.*)?$/i.test(stem) ||
    // Camera and chat-app filenames with numeric or timestamp suffixes.
    /^(?:img|dsc|dscn|pxl|vid|mvimg|mmexport|wx_camera|微信图片|qq图片)[\s_-]*[\d\s_.-]+$/i.test(
      stem,
    )
  );
}

const mimeExtensions = new Map([
  ['application/pdf', '.pdf'], ['text/plain', '.txt'], ['image/jpeg', '.jpg'],
  ['image/png', '.png'], ['image/webp', '.webp'], ['audio/mpeg', '.mp3'],
  ['video/mp4', '.mp4'], ['application/zip', '.zip'],
  ['application/msword', '.doc'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'],
]);

function usableStem(value) {
  return value.normalize('NFKC')
    .replace(/【[^】]*(?:网|下载)[^】]*】/gu, '')
    .replace(/[\\/:*?"<>|\p{Cc}\p{Cf}]/gu, '_')
    .replace(/\s+/gu, ' ')
    .replace(/_+/gu, '_')
    .replace(/^[\s._-]+|[\s._-]+$/gu, '');
}

/** Build a single filename using the browser-provided suffix and the source page. */
export function makeFilename(original, mime, pageTitle, hostname, aiStem = '') {
  const parts = pageTitle.split(/\s+[|–—-]\s+/u).map(part => part.trim()).filter(Boolean);
  const { ext } = splitName(original);
  if (ext && !/^\.[\p{L}\d_-]{1,16}$/u.test(ext)) return undefined;
  const suffix = ext || mimeExtensions.get(mime) || '';
  let title = usableStem(aiStem) || usableStem(parts[0] || '');
  if (suffix && title.toLowerCase().endsWith(suffix.toLowerCase())) {
    title = usableStem(title.slice(0, -suffix.length));
  }
  if (!title) return undefined;
  const source = usableStem(parts.length > 1 ? parts.at(-1) : hostname.replace(/^www\./i, ''));
  let stem = source && title !== source ? title + '_' + source : title;
  if (!suffix) stem = stem.replaceAll('.', '_');
  if (/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/iu.test(stem)) stem = '_' + stem;

  // Keep the complete suffix and stay below filesystem byte and character limits.
  let clipped = '';
  const encoder = new TextEncoder();
  for (const character of Array.from(stem).slice(0, 80 - Array.from(suffix).length)) {
    if (encoder.encode(clipped + character + suffix).length > 240) break;
    clipped += character;
  }
  return clipped.replace(/[. ]+$/u, '') + suffix;
}
