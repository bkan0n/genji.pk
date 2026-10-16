// Match spelling variants for display only. Never use this key as an API value.
export function mapTranslationKey(name) {
  return String(name ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’"()]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

const locales = { en: 'en-US', fr: 'fr-FR', ru: 'ru-RU', cn: 'zh-CN' };
// Known API spellings that differ from the translation dataset.
const aliases = { arena_victoria: 'arena_victoriae', shambali: 'shambali_monastery' };

export function createMapNameLocalizer(data, locale, fallback = {}) {
  const language = locales[locale] || locale;
  const labels = new Map();
  for (const entry of Object.values(data || {})) {
    if (!entry || typeof entry !== 'object' || !entry['en-US']) continue;
    const label = entry[language];
    if (typeof label === 'string' && label.trim()) {
      labels.set(mapTranslationKey(entry['en-US']), label);
    }
  }
  return (name) => {
    if (language === 'en-US') return name;
    const key = mapTranslationKey(name);
    const alias = aliases[key] || key;
    return labels.get(alias) || labels.get(key) || fallback[key] || fallback[alias] || name;
  };
}
