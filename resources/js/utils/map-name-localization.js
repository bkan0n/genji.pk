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
export const mapNameTranslationAliases = {
  arena_victoria: 'arena_victoriae',
  shambali: 'shambali_monastery',
};

export function isValidChineseMapLabel(label) {
  return (
    typeof label === 'string' &&
    label.trim() === label &&
    /[\u3400-\u9fff]/u.test(label) &&
    !/[?\uFFFD\u0000-\u001f]/u.test(label)
  );
}

export function createMapNameLocalizer(data, locale, fallback = {}) {
  const language = locales[locale] || locale;
  const labels = new Map();
  for (const entry of Object.values(data || {})) {
    if (!entry || typeof entry !== 'object' || !entry['en-US']) continue;
    const label = entry[language];
    if (
      typeof label === 'string' &&
      label.trim() &&
      (language !== 'zh-CN' || isValidChineseMapLabel(label))
    ) {
      labels.set(mapTranslationKey(entry['en-US']), label);
    }
  }
  return (name) => {
    if (language === 'en-US') return name;
    const key = mapTranslationKey(name);
    const alias = mapNameTranslationAliases[key] || key;
    const legacy = fallback[key] || fallback[alias];
    return (
      labels.get(alias) ||
      labels.get(key) ||
      (language === 'zh-CN' ? isValidChineseMapLabel(legacy) && legacy : legacy) ||
      name
    );
  };
}

// Prefer the shared Chinese dataset over API labels, which may just echo English.
export function mapNameAutocompleteLabel(item, locale, localize) {
  const name = String(item.map_name || '');
  const label = localize(name);
  return locale === 'cn' || locale === 'zh-CN'
    ? isValidChineseMapLabel(label)
      ? label
      : isValidChineseMapLabel(item.translated_map_name)
        ? item.translated_map_name
        : name
    : item.translated_map_name || label;
}
