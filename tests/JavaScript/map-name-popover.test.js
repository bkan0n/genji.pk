import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';
import {
  createMapNameLocalizer,
  mapTranslationKey,
} from '../../resources/js/utils/map-name-localization.js';
import {
  createMapNamePopover,
  matchingMaps,
  selectMapScope,
  loadMapNames,
} from '../../resources/js/components/map-name-popover.js';
import {
  normalizeMapNames,
  serializeSearchFilters,
} from '../../resources/js/utils/search-filters.js';

const maps = [
  { name: 'Hanamura', label: '花村' },
  { name: 'Eichenwalde', label: 'Eichenwalde' },
  { name: "King's Row", label: '国王大道' },
];

test('search matches canonical and translated names without case sensitivity', () => {
  assert.deepEqual(matchingMaps(maps, ' HANA '), [maps[0]]);
  assert.deepEqual(matchingMaps(maps, '国王'), [maps[2]]);
  assert.deepEqual(matchingMaps(maps, 'unknown'), []);
});

test('select all uses the complete dataset and deduplicates existing selections', () => {
  assert.deepEqual(selectMapScope(['hanamura'], maps, true), [
    'hanamura',
    'Eichenwalde',
    "King's Row",
  ]);
  assert.deepEqual(
    selectMapScope([], maps, true),
    maps.map(({ name }) => name)
  );
});

test('scoped select and clear preserve selections outside the query', () => {
  const scope = matchingMaps(maps, 'hana');
  assert.deepEqual(selectMapScope(['Eichenwalde'], scope, true), ['Eichenwalde', 'Hanamura']);
  assert.deepEqual(selectMapScope(['Eichenwalde', 'Hanamura'], scope, false), ['Eichenwalde']);
  assert.deepEqual(selectMapScope(['Eichenwalde'], [], true), ['Eichenwalde']);
});

test('clear all restores the empty no-restriction API behavior', () => {
  const selected = selectMapScope(
    maps.map(({ name }) => name),
    maps,
    false
  );
  assert.deepEqual(selected, []);
  assert.equal(serializeSearchFilters({ map_name: selected }), '');
});

test('selected canonical values round trip through the shareable array encoding', () => {
  const names = selectMapScope([], matchingMaps(maps, '国王'), true);
  const query = new URLSearchParams(serializeSearchFilters({ map_name: names }));
  assert.deepEqual(query.getAll('map_name[]'), ["King's Row"]);
});

test('complete list loader uses the exhaustive route without autocomplete limits', async () => {
  const names = Array.from({ length: 125 }, (_, i) => `Map ${i}`);
  const result = await loadMapNames(async (url) => {
    assert.equal(url, '/api/map-names');
    return { ok: true, json: async () => names };
  });
  assert.equal(result.length, 125);
});

test('loading failures and malformed lists reject rather than enabling partial bulk actions', async () => {
  await assert.rejects(
    loadMapNames(async () => {
      throw new Error('offline');
    })
  );
  await assert.rejects(loadMapNames(async () => ({ ok: false })));
  for (const data of [{ error: true }, [], ['Hanamura', null]]) {
    await assert.rejects(loadMapNames(async () => ({ ok: true, json: async () => data })));
  }
});

// Minimal DOM fixture exercises actual control event handlers without adding a browser dependency.
function fixture(loader = async () => maps, i18n = null) {
  class Element {
    constructor(tag) {
      this.tag = tag;
      this.children = [];
      this.events = {};
      this.attributes = {};
      this.style = {};
      this.value = '';
      this.hidden = false;
      this.isConnected = true;
      const classes = new Set();
      this.classList = {
        add: (...names) => names.forEach((name) => classes.add(name)),
        remove: (...names) => names.forEach((name) => classes.delete(name)),
        contains: (name) => classes.has(name),
      };
    }
    append(...items) {
      this.children.push(...items);
    }
    replaceChildren(...items) {
      this.children = items;
    }
    setAttribute(key, value) {
      this.attributes[key] = value;
    }
    addEventListener(type, handler) {
      (this.events[type] ||= []).push(handler);
    }
    fire(type, data = {}) {
      for (const handler of this.events[type] || [])
        handler({ target: this, preventDefault() {}, stopPropagation() {}, ...data });
    }
    focus() {
      doc.activeElement = this;
    }
    contains(target) {
      return this === target || this.children.some((child) => child.contains(target));
    }
    getBoundingClientRect() {
      return { left: 100, bottom: 100, height: 360 };
    }
    querySelectorAll(tag) {
      return this.children.flatMap((child) => [
        ...(child.tag === tag ? [child] : []),
        ...child.querySelectorAll(tag),
      ]);
    }
  }
  const doc = new Element('document');
  doc.createElement = (tag) => new Element(tag);
  doc.body = new Element('body');
  const button = new Element('button');
  button.id = 'map_nameFilterButton';
  const badge = new Element('span');
  badge.classList.add('hidden');
  button.querySelector = (selector) => (selector === '.filter-badge' ? badge : null);
  doc.querySelectorAll = (selector) =>
    ['.toolbar-button', '#map_nameFilterButton'].includes(selector) ? [button] : [];
  globalThis.window = { innerWidth: 800, innerHeight: 700, addEventListener() {} };
  const source = readFileSync(
    new URL('../../resources/js/pages/search.js', import.meta.url),
    'utf8'
  );
  const toolbarRenderer = source.slice(
    source.indexOf('function updateToolbarButtonStates('),
    source.indexOf('\n// The Completions section shares')
  );
  const pickerSetup = source.slice(
    source.indexOf('const mapNamePicker ='),
    source.indexOf('/* =========================', source.indexOf('const mapNamePicker ='))
  );
  const persistentFilters = { map_name: ['Eichenwalde'] };
  const context = {
    activeFilters: { ...persistentFilters },
    persistentFilters,
    document: doc,
    CURRENT_LANG: 'en',
    t: (key, params = {}) => `${key}${params.count ?? params.total ?? ''}`,
    syncRecordArchivedVisibility() {},
    createMapNamePopover: (options) =>
      createMapNamePopover({ ...options, document: doc, loadMaps: loader }),
  };
  if (i18n) {
    const translator = source.slice(
      source.indexOf('function t(path,'),
      source.indexOf('const mapNamePicker =')
    );
    context.t = runInNewContext(`${translator}\nt`, { translations: i18n });
  }
  const picker = runInNewContext(`${toolbarRenderer}\n${pickerSetup}\nmapNamePicker`, context);
  context.updateToolbarButtonStates();
  return {
    doc,
    button,
    badge,
    picker,
    persistentFilters,
    selected: () => context.activeFilters.map_name || [],
    restore: (names) => {
      context.activeFilters = { map_name: names };
      context.updateToolbarButtonStates();
    },
  };
}

test('popover opens, autofocuses, toggles checkboxes and preserves selection on reopening', async () => {
  const { doc, button, picker, selected } = fixture();
  await picker.toggle(button);
  const panel = doc.body.children[0];
  const search = panel.querySelectorAll('input')[0];
  assert.equal(panel.hidden, false);
  assert.equal(button.attributes['aria-expanded'], 'true');
  assert.equal(doc.activeElement, search);
  panel.querySelectorAll('input')[1].fire('change');
  assert.deepEqual(selected(), ['Eichenwalde', 'Hanamura']);
  assert.equal(panel.querySelectorAll('input')[1].checked, true);
  panel.querySelectorAll('input')[1].fire('change');
  assert.deepEqual(selected(), ['Eichenwalde']);
  await picker.toggle(button);
  assert.equal(panel.hidden, true);
  assert.equal(doc.activeElement, button);
  await picker.toggle(button);
  assert.equal(panel.querySelectorAll('input')[2].checked, true);
});

const localeData = JSON.parse(
  execFileSync(
    'php',
    [
      '-r',
      '$out=[]; foreach (["en","fr","ru","cn"] as $locale) {$out[$locale]=require "resources/lang/$locale/search.php";} echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);',
    ],
    { encoding: 'utf8' }
  )
);
const mapTranslations = JSON.parse(
  readFileSync(new URL('../../public/translations/maps.json', import.meta.url), 'utf8')
);
const completedChineseMaps = {
  Gogadoro: '高架车站',
  'Redwood Dam': '红杉水坝',
  'Place Lacroix': '拉克瓦广场',
};

test('map JSON and Chinese PHP translations contain no duplicate keys', () => {
  const json = readFileSync(
    new URL('../../public/translations/maps.json', import.meta.url),
    'utf8'
  );
  const tokens = json.match(/"(?:\\.|[^"\\])*"|[{}\[\]:,]|[^\s{}\[\]:,]+/g);
  const stack = [];
  tokens.forEach((token, index) => {
    if (token === '{') stack.push(new Set());
    else if (token === '[') stack.push(null);
    else if (token === '}' || token === ']') stack.pop();
    else if (token.startsWith('"') && tokens[index + 1] === ':') {
      const key = JSON.parse(token);
      const keys = stack.at(-1);
      assert.equal(keys.has(key), false, `Duplicate JSON key: ${key}`);
      keys.add(key);
    }
  });
  const duplicates = JSON.parse(
    execFileSync(
      'php',
      [
        '-r',
        `
    $tokens = token_get_all(file_get_contents('resources/lang/cn/search.php'));
    $stack = []; $duplicates = [];
    foreach ($tokens as $i => $token) {
      if ($token === '[') { $stack[] = []; }
      elseif ($token === ']') { array_pop($stack); }
      elseif (is_array($token) && $token[0] === T_CONSTANT_ENCAPSED_STRING && count($stack)) {
        $j = $i + 1;
        while (isset($tokens[$j]) && is_array($tokens[$j]) && in_array($tokens[$j][0], [T_WHITESPACE, T_COMMENT, T_DOC_COMMENT])) { $j++; }
        if (isset($tokens[$j]) && is_array($tokens[$j]) && $tokens[$j][0] === T_DOUBLE_ARROW) {
          $depth = count($stack) - 1; $key = $token[1];
          if (isset($stack[$depth][$key])) { $duplicates[] = $key; }
          $stack[$depth][$key] = true;
        }
      }
    }
    echo json_encode($duplicates, JSON_THROW_ON_ERROR);
  `,
      ],
      { encoding: 'utf8' }
    )
  );
  assert.deepEqual(duplicates, []);
});

test('complete local map-name audit has no missing Chinese labels or duplicate canonical names', () => {
  const entries = Object.values(mapTranslations);
  const canonicalKeys = entries.map((entry) => mapTranslationKey(entry['en-US']));
  assert.equal(new Set(canonicalKeys).size, entries.length);
  for (const entry of entries) {
    assert.equal(typeof entry['zh-CN'], 'string', entry['en-US']);
    assert.equal(/[?\uFFFD]/u.test(entry['zh-CN']), false, entry['en-US']);
    assert.ok(entry['zh-CN'].trim(), entry['en-US']);
  }
  const names = [
    ...new Map(
      [
        ...entries.map((entry) => entry['en-US']),
        ...Object.values(localeData.en.map_name),
        'Arena Victoria',
      ].map((name) => [mapTranslationKey(name), name])
    ).values(),
  ];
  const label = createMapNameLocalizer(mapTranslations, 'cn', localeData.cn.map_name);
  assert.deepEqual(
    names.filter((name) => label(name) === name),
    []
  );
  // New labels stay in the shared dataset, rather than a second PHP map dictionary.
  for (const name of Object.keys(completedChineseMaps)) {
    assert.equal(Object.hasOwn(localeData.cn.map_name, mapTranslationKey(name)), false);
  }
});

test('each completed Chinese map displays, searches, selects and restores with its canonical API value', async () => {
  const localize = createMapNameLocalizer(mapTranslations, 'cn', localeData.cn.map_name);
  const names = Object.keys(completedChineseMaps);
  const { doc, button, picker, selected, restore } = fixture(
    async () => names.map((name) => ({ name, label: localize(name) })),
    localeData.cn
  );
  restore([]);
  await picker.toggle(button);
  const panel = doc.body.children[0];
  const search = panel.querySelectorAll('input')[0];
  for (const [name, chinese] of Object.entries(completedChineseMaps)) {
    for (const query of [chinese, name.toLowerCase()]) {
      search.value = query;
      search.fire('input');
      const checkbox = panel.querySelectorAll('input')[1];
      assert.equal(panel.children[3].children.length, 1);
      assert.equal(panel.children[3].children[0].children[1].textContent, chinese);
      assert.equal(checkbox.value, name);
      checkbox.fire('change');
      assert.deepEqual(selected(), [name]);
      assert.deepEqual(
        new URLSearchParams(serializeSearchFilters({ map_name: selected() })).getAll('map_name[]'),
        [name]
      );
      checkbox.fire('change');
      assert.deepEqual(selected(), []);
    }
  }
  search.value = '';
  search.fire('input');
  panel.querySelectorAll('button')[0].fire('click');
  assert.deepEqual(selected(), names);
  const source = readFileSync(
    new URL('../../resources/js/pages/search.js', import.meta.url),
    'utf8'
  );
  const constants = source.slice(
    source.indexOf('const URL_FILTER_KEYS ='),
    source.indexOf('let __urlBootstrapped')
  );
  const reader = source.slice(
    source.indexOf('function __urlReadFilters()'),
    source.indexOf('\nfunction ', source.indexOf('function __urlReadFilters()') + 1)
  );
  const url = new URL('https://genji.test/search');
  selected().forEach((name) => url.searchParams.append('map_name', name));
  const restored = runInNewContext(`${constants}\n${reader}\n__urlReadFilters()`, {
    URL,
    location: { href: url.href },
    normalizeMapNames,
  });
  picker.close();
  restore(Array.from(restored.map_name));
  await picker.toggle(button);
  assert.deepEqual(selected(), names);
  assert.equal(
    panel
      .querySelectorAll('input')
      .slice(1)
      .every((box) => box.checked),
    true
  );
  panel.querySelectorAll('button')[1].fire('click');
  assert.deepEqual(selected(), []);
});

test('all popover translations are valid UTF-8, complete and free of lossy question marks', () => {
  for (const locale of ['en', 'fr', 'ru', 'cn']) {
    const bytes = readFileSync(
      new URL(`../../resources/lang/${locale}/search.php`, import.meta.url)
    );
    new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    assert.deepEqual(
      Object.keys(localeData[locale].map_picker).sort(),
      Object.keys(localeData.en.map_picker).sort()
    );
    for (const value of Object.values(localeData[locale].map_picker)) {
      assert.equal(/[?\uFFFD]/u.test(value), false, `${locale}: ${value}`);
    }
  }
  assert.equal(localeData.cn.filters_toolbar.map_name, '地图名称');
  assert.equal(localeData.cn.map_picker.search, '搜索地图...');
  assert.equal(localeData.cn.map_picker.select_all, '全选');
  assert.equal(localeData.cn.map_picker.clear, '清除选择');
  assert.equal(localeData.fr.map_picker.select_all, 'Tout sélectionner');
  assert.equal(localeData.ru.map_picker.search, 'Поиск карт...');
});

test('Chinese map labels resolve official names, API aliases, accents and existing PHP translations', () => {
  const label = createMapNameLocalizer(mapTranslations, 'cn', localeData.cn.map_name);
  for (const [name, expected] of [
    ["King's Row", '国王大道'],
    ['King’s Row (Winter)', '圣诞节国王大道'],
    ['Chateau Guillard (Halloween)', '万圣节吉拉德堡'],
    ['Aatlis', '阿特利斯'],
    ['Adlersbrunn', '阿德勒斯布鲁恩'],
    ['Arena Victoria', '维多利亚竞技场'],
    ['Arena Victoriae', '维多利亚竞技场'],
    ['Busan (Lunar New Year)', '春节釜山'],
    ['Framework', '框架'],
    ['Shambali', '香巴里寺院'],
    ['Unknown Custom Map', 'Unknown Custom Map'],
  ])
    assert.equal(label(name), expected);
  assert.equal(createMapNameLocalizer({}, 'cn', localeData.cn.map_name)('Aatlis'), '阿特利斯');
  for (const [name, expected] of Object.entries(completedChineseMaps))
    assert.equal(label(name), expected);
  for (const entry of Object.values(mapTranslations)) {
    if (entry['zh-CN']) assert.equal(label(entry['en-US']), entry['zh-CN']);
  }
});

test('Chinese loading and error states use actual localized Unicode strings', async () => {
  let rejectLoading;
  const { doc, button, picker } = fixture(
    () =>
      new Promise((_, reject) => {
        rejectLoading = reject;
      }),
    localeData.cn
  );
  const opening = picker.toggle(button);
  const panel = doc.body.children[0];
  assert.equal(panel.children[3].children[0].textContent, '正在加载地图...');
  rejectLoading(new Error('offline'));
  await opening;
  assert.equal(panel.children[3].children[0].textContent, '地图加载失败。请关闭后重新打开以重试。');
  assert.equal(panel.querySelectorAll('button')[0].disabled, true);
});

test('localized popover preserves English canonical selections across locales and Chinese scoped actions', async () => {
  const names = ["King's Row", 'Aatlis', 'Framework'];
  for (const locale of ['en', 'cn', 'fr', 'ru']) {
    const localize = createMapNameLocalizer(mapTranslations, locale, localeData[locale].map_name);
    const { doc, button, picker, selected, restore, badge } = fixture(
      async () => names.map((name) => ({ name, label: localize(name) })),
      localeData[locale]
    );
    restore(["King's Row"]);
    await picker.toggle(button);
    const panel = doc.body.children[0];
    const search = panel.querySelectorAll('input')[0];
    assert.equal(panel.querySelectorAll('input')[1].value, "King's Row");
    assert.equal(panel.children[3].children[0].children[1].textContent, localize("King's Row"));
    assert.equal(badge.textContent, '1');
    assert.deepEqual(selected(), ["King's Row"]);
    if (locale !== 'cn') continue;
    assert.equal(search.placeholder, '搜索地图...');
    assert.equal(panel.attributes['aria-label'], '地图名称');
    assert.equal(panel.children[0].children[1].textContent, '已选择 1 项');
    assert.equal(panel.children[4].textContent, '3 张地图可选');
    const [selectAll, clear] = panel.querySelectorAll('button');
    for (const query of ['国王', 'King']) {
      search.value = query;
      search.fire('input');
      assert.equal(panel.children[3].children.length, 1);
      assert.equal(panel.querySelectorAll('input')[1].value, "King's Row");
    }
    clear.fire('click');
    assert.deepEqual(selected(), []);
    selectAll.fire('click');
    assert.deepEqual(selected(), ["King's Row"]);
    search.value = '';
    search.fire('input');
    selectAll.fire('click');
    assert.deepEqual(selected(), names);
    assert.equal(panel.children[0].children[1].textContent, '已选择 3 项');
    const params = new URLSearchParams(serializeSearchFilters({ map_name: selected() }));
    assert.deepEqual(params.getAll('map_name[]'), names);
    clear.fire('click');
    assert.equal(panel.children[0].children[1].textContent, '已选择 0 项');
    search.value = 'missing';
    search.fire('input');
    assert.equal(panel.children[3].children[0].textContent, '没有找到匹配的地图');
  }
});

test('keyboard arrows, Home, End, Escape and outside click operate the popover', async () => {
  const { doc, button, picker } = fixture();
  await picker.toggle(button);
  const panel = doc.body.children[0];
  const [search, first, , last] = panel.querySelectorAll('input');
  panel.fire('keydown', { target: search, key: 'ArrowDown' });
  assert.equal(doc.activeElement, first);
  panel.fire('keydown', { target: first, key: 'End' });
  assert.equal(doc.activeElement, last);
  panel.fire('keydown', { target: last, key: 'Home' });
  assert.equal(doc.activeElement, first);
  panel.fire('keydown', { key: 'Escape' });
  assert.equal(panel.hidden, true);
  assert.equal(doc.activeElement, button);
  await picker.toggle(button);
  doc.fire('pointerdown', { target: doc.body });
  assert.equal(panel.hidden, true);
  assert.equal(button.attributes['aria-expanded'], 'false');
});

test('bulk action controls use the visible query and retain other selected maps', async () => {
  const { doc, button, picker, selected } = fixture();
  await picker.toggle(button);
  const panel = doc.body.children[0];
  const search = panel.querySelectorAll('input')[0];
  const [select, clear] = panel.querySelectorAll('button');
  search.value = 'hana';
  search.fire('input');
  select.fire('click');
  select.fire('click');
  assert.deepEqual(selected(), ['Eichenwalde', 'Hanamura']);
  clear.fire('click');
  assert.deepEqual(selected(), ['Eichenwalde']);
  search.value = '';
  search.fire('input');
  select.fire('click');
  assert.equal(selected().length, 3);
  clear.fire('click');
  assert.deepEqual(selected(), []);
});

test('existing URL reader restores multiple, legacy and empty map filters', () => {
  const source = readFileSync(
    new URL('../../resources/js/pages/search.js', import.meta.url),
    'utf8'
  );
  const constants = source.slice(
    source.indexOf('const URL_FILTER_KEYS ='),
    source.indexOf('let __urlBootstrapped')
  );
  const reader = source.slice(
    source.indexOf('function __urlReadFilters()'),
    source.indexOf('\nfunction ', source.indexOf('function __urlReadFilters()') + 1)
  );
  for (const [query, expected] of [
    ['map_name=Hanamura&map_name=Eichenwalde&map_name=hanamura', ['Hanamura', 'Eichenwalde']],
    ['mapName=Hanamura', ['Hanamura']],
    ['map_name=Hanamura,Eichenwalde', ['Hanamura', 'Eichenwalde']],
    ['map_name=', undefined],
  ]) {
    const restored = runInNewContext(`${constants}\n${reader}\n__urlReadFilters()`, {
      URL,
      location: { href: `https://genji.test/search?${query}` },
      normalizeMapNames,
    });
    assert.deepEqual(restored.map_name && Array.from(restored.map_name), expected);
  }
});

test('failed loading disables bulk actions, retains selections and retries on reopening', async () => {
  let attempts = 0;
  const { doc, button, picker, selected } = fixture(async () => {
    if (++attempts === 1) throw new Error('offline');
    return maps;
  });
  await picker.toggle(button);
  const panel = doc.body.children[0];
  assert.equal(panel.querySelectorAll('button')[0].disabled, true);
  assert.equal(panel.children[3].children[0].textContent, 'map_picker.failed');
  assert.deepEqual(selected(), ['Eichenwalde']);
  picker.close();
  await picker.toggle(button);
  assert.equal(attempts, 2);
  assert.equal(panel.querySelectorAll('button')[0].disabled, false);
  assert.equal(panel.querySelectorAll('input')[2].checked, true);
});

test('badge and header update immediately for individual and bulk pending changes without rebuilding rows', async () => {
  const { doc, button, badge, picker, selected, persistentFilters } = fixture();
  await picker.toggle(button);
  const panel = doc.body.children[0];
  const search = panel.querySelectorAll('input')[0];
  const list = panel.children[3];
  const headerCount = panel.children[0].children[1];
  const [selectAll, clear] = panel.querySelectorAll('button');
  const checkbox = list.querySelectorAll('input')[0];
  list.scrollTop = 56;
  checkbox.focus();
  checkbox.fire('change');
  assert.equal(badge.textContent, '2');
  assert.equal(headerCount.textContent, 'map_picker.selected2');
  assert.equal(doc.activeElement, checkbox);
  assert.equal(list.querySelectorAll('input')[0], checkbox);
  checkbox.fire('change');
  assert.equal(badge.textContent, '1');
  assert.equal(headerCount.textContent, 'map_picker.selected1');
  search.value = 'hana';
  search.fire('input');
  search.focus();
  selectAll.fire('click');
  assert.equal(badge.textContent, '2');
  assert.equal(search.value, 'hana');
  assert.equal(doc.activeElement, search);
  clear.fire('click');
  assert.equal(badge.textContent, '1');
  search.value = '';
  search.fire('input');
  list.scrollTop = 56;
  selectAll.fire('click');
  assert.equal(badge.textContent, '3');
  assert.equal(headerCount.textContent, 'map_picker.selected3');
  assert.equal(panel.children[4].textContent, 'map_picker.available3');
  clear.fire('click');
  assert.equal(badge.textContent, '');
  assert.equal(badge.classList.contains('hidden'), true);
  assert.equal(headerCount.textContent, 'map_picker.selected0');
  assert.equal(panel.hidden, false);
  assert.equal(list.scrollTop, 56);
  assert.deepEqual(selected(), []);
  assert.deepEqual(persistentFilters.map_name, ['Eichenwalde']);
});

test('restored selections use the existing badge renderer and synchronize on reopening', async () => {
  const { doc, button, badge, picker, restore } = fixture();
  assert.equal(badge.textContent, '1');
  restore(['Hanamura', "King's Row"]);
  assert.equal(badge.textContent, '2');
  await picker.toggle(button);
  const panel = doc.body.children[0];
  assert.equal(panel.children[0].children[1].textContent, 'map_picker.selected2');
  assert.equal(panel.querySelectorAll('input')[1].checked, true);
  picker.close();
  restore([]);
  assert.equal(badge.classList.contains('hidden'), true);
  await picker.toggle(button);
  assert.equal(panel.children[0].children[1].textContent, 'map_picker.selected0');
  assert.equal(
    panel
      .querySelectorAll('input')
      .slice(1)
      .some((box) => box.checked),
    false
  );
});
