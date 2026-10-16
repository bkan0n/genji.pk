import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  createMapNameLocalizer,
  isValidChineseMapLabel,
  mapNameTranslationAliases,
  mapTranslationKey,
} from '../resources/js/utils/map-name-localization.js';

export function duplicateJsonKeys(text) {
  const tokens = text.match(/"(?:\\.|[^"\\])*"|[{}\[\]:,]|[^\s{}\[\]:,]+/g) || [];
  const stack = [],
    duplicates = [];
  tokens.forEach((token, index) => {
    if (token === '{') stack.push(new Set());
    else if (token === '[') stack.push(null);
    else if (token === '}' || token === ']') stack.pop();
    else if (token.startsWith('"') && tokens[index + 1] === ':') {
      const key = JSON.parse(token),
        keys = stack.at(-1);
      if (keys.has(key)) duplicates.push(key);
      keys.add(key);
    }
  });
  return duplicates;
}

export function auditMapTranslations(data, englishNames, legacy, sources = {}) {
  const entries = Object.values(data);
  const names = [
    ...new Map(
      [
        ...entries.map((entry) => entry?.['en-US']),
        ...englishNames,
        ...Object.keys(sources),
        ...Object.keys(mapNameTranslationAliases),
      ]
        .filter((name) => typeof name === 'string' && name.trim())
        .map((name) => [mapTranslationKey(name), name])
    ).values(),
  ];
  const localize = createMapNameLocalizer(data, 'cn', legacy);
  const duplicates = [],
    invalid = [],
    seenNames = new Set(),
    seenLabels = new Map();
  for (const [key, entry] of Object.entries(data)) {
    const name = entry?.['en-US'];
    if (typeof name !== 'string' || !name.trim() || name.trim() !== name) {
      invalid.push(`${key}: invalid en-US canonical name`);
      continue;
    }
    const normalized = mapTranslationKey(name);
    if (seenNames.has(normalized)) duplicates.push(`canonical name: ${name}`);
    seenNames.add(normalized);
    const label = entry['zh-CN'];
    if (label === undefined) continue;
    if (!isValidChineseMapLabel(label))
      invalid.push(`${name}: invalid zh-CN ${JSON.stringify(label)}`);
    if (seenLabels.has(label)) duplicates.push(`zh-CN ${label}: ${seenLabels.get(label)}, ${name}`);
    seenLabels.set(label, name);
  }
  const missing = names
    .filter((name) => !isValidChineseMapLabel(localize(name)))
    .map((name) => ({
      name,
      reason: sources[name]?.reason || 'No verified Simplified Chinese translation recorded.',
      documented: sources[name]?.status === 'unresolved',
    }));
  const missingDatasetLabels = entries
    .filter((entry) => !isValidChineseMapLabel(entry?.['zh-CN']))
    .map((entry) => entry?.['en-US'] || '(invalid canonical name)');
  return {
    datasetEntries: entries.length,
    auditedNames: names.length,
    translatedNames: names.length - missing.length,
    missingDatasetLabels,
    missing,
    invalid,
    duplicates,
  };
}

export function readRepositoryMapTranslations() {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const php = JSON.parse(
    execFileSync(
      'php',
      [
        '-r',
        `
    $names = [];
    foreach (glob('resources/lang/en/*.php') as $file) {
      $data = require $file;
      foreach (['map_name', 'map_names'] as $key) {
        if (isset($data[$key]) && is_array($data[$key])) $names = array_merge($names, array_values($data[$key]));
      }
    }
    $cn = require 'resources/lang/cn/search.php';
    echo json_encode(['names' => $names, 'legacy' => $cn['map_name']], JSON_THROW_ON_ERROR);
  `,
      ],
      { cwd: root, encoding: 'utf8' }
    )
  );
  const text = readFileSync(new URL('../public/translations/maps.json', import.meta.url), 'utf8');
  const sourcesText = readFileSync(
    new URL('../resources/data/map-name-translation-sources.json', import.meta.url),
    'utf8'
  );
  const data = JSON.parse(text),
    sources = JSON.parse(sourcesText);
  const report = auditMapTranslations(data, php.names, php.legacy, sources);
  report.duplicates.push(
    ...duplicateJsonKeys(text).map((key) => `JSON key: ${key}`),
    ...duplicateJsonKeys(sourcesText).map((key) => `source key: ${key}`)
  );
  return report;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const report = readRepositoryMapTranslations();
  console.log(JSON.stringify(report, null, 2));
  // Documented unresolved names are reported, not guessed. Newly missing or invalid
  // labels fail validation. This command never calls the live API.
  process.exitCode =
    report.invalid.length ||
    report.duplicates.length ||
    report.missing.some((entry) => !entry.documented)
      ? 1
      : 0;
}
