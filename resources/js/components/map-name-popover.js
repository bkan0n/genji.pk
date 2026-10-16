import { normalizeMapNames, toggleMapName } from '../utils/search-filters.js';
import { mapTranslationKey } from '../utils/map-name-localization.js';

export function matchingMaps(maps, query) {
  const needle = query.trim().toLocaleLowerCase();
  const normalized = mapTranslationKey(query);
  return maps.filter(
    ({ name, label }) =>
      `${name} ${label}`.toLocaleLowerCase().includes(needle) ||
      (normalized && mapTranslationKey(`${name} ${label}`).includes(normalized))
  );
}

export function selectMapScope(selected, maps, select) {
  const names = maps.map(({ name }) => name);
  const scope = new Set(names.map((name) => name.toLowerCase()));
  return select
    ? normalizeMapNames([...normalizeMapNames(selected), ...names])
    : normalizeMapNames(selected).filter((name) => !scope.has(name.toLowerCase()));
}

export async function loadMapNames(fetcher = fetch) {
  // Autocomplete requires a query and truncates at 50. This existing upstream
  // list endpoint is exhaustive; translations alone include unavailable maps.
  const response = await fetcher('/api/map-names', { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Map list request failed');
  const names = await response.json();
  if (
    !Array.isArray(names) ||
    !names.length ||
    names.some((name) => typeof name !== 'string' || !name.trim())
  ) {
    throw new Error('Invalid map list');
  }
  return normalizeMapNames(names);
}

export function createMapNamePopover({
  t,
  getSelection,
  setSelection,
  loadMaps,
  document: doc = document,
}) {
  let panel,
    anchor,
    maps = [],
    loaded = false,
    loading = false,
    failed = false;
  let input, list, count, footer, selectAll, clear;
  const tr = (key, params) => t(`map_picker.${key}`, params);
  function close(restore = true) {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    anchor?.setAttribute('aria-expanded', 'false');
    if (restore && anchor?.isConnected) anchor.focus();
  }
  function position() {
    if (!panel || panel.hidden) return;
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(360, Math.max(0, window.innerWidth - 16));
    panel.style.width = `${width}px`;
    panel.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))}px`;
    const height = panel.getBoundingClientRect().height;
    panel.style.top = `${Math.max(8, Math.min(rect.bottom + 6, window.innerHeight - height - 8))}px`;
    panel.style.maxHeight = `${window.innerHeight - 16}px`;
  }
  function syncSelection() {
    const selected = normalizeMapNames(getSelection());
    count.textContent = tr('selected', { count: selected.length });
    const selectedKeys = new Set(selected.map((name) => name.toLowerCase()));
    list.querySelectorAll('input').forEach((checkbox) => {
      checkbox.checked = selectedKeys.has(checkbox.value.toLowerCase());
    });
  }
  function changeSelection(names) {
    setSelection(names);
    syncSelection();
  }
  function render() {
    footer.textContent = loaded ? tr('available', { total: maps.length }) : '';
    selectAll.disabled = clear.disabled = !loaded;
    list.replaceChildren();
    if (!loaded) {
      const status = doc.createElement('p');
      status.className = 'p-3 text-sm text-zinc-500 dark:text-zinc-400';
      status.setAttribute('role', 'status');
      status.textContent = tr(failed ? 'failed' : 'loading');
      list.append(status);
    } else {
      const matches = matchingMaps(maps, input.value);
      if (!matches.length) {
        const empty = doc.createElement('p');
        empty.className = 'p-3 text-sm text-zinc-500 dark:text-zinc-400';
        empty.textContent = tr('empty');
        list.append(empty);
      }
      for (const { name, label } of matches) {
        const row = doc.createElement('label');
        row.className =
          'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm leading-5 transition-colors duration-100 motion-reduce:transition-none hover:bg-zinc-100 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500/60 dark:hover:bg-white/5';
        const checkbox = doc.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'h-3.5 w-3.5 shrink-0 cursor-pointer accent-emerald-500';
        checkbox.addEventListener('change', () => {
          changeSelection(toggleMapName(getSelection(), name));
        });
        checkbox.value = name;
        const text = doc.createElement('span');
        text.className = 'min-w-0 truncate';
        text.textContent = label;
        text.title = label;
        row.append(checkbox, text);
        list.append(row);
      }
    }
    syncSelection();
    position();
  }
  function init() {
    panel = doc.createElement('section');
    panel.id = 'mapNamePopover';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', t('filters_toolbar.map_name'));
    panel.className =
      'fixed z-[10000] overflow-y-auto rounded-xl border border-zinc-200/80 bg-white p-2.5 text-zinc-900 shadow-lg dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100';
    const header = doc.createElement('div');
    header.className = 'mb-2 flex items-center justify-between gap-2 px-1 text-sm font-semibold';
    const title = doc.createElement('span');
    title.textContent = t('filters_toolbar.map_name');
    count = doc.createElement('span');
    count.className = 'shrink-0 text-xs font-normal text-zinc-500 dark:text-zinc-400';
    count.setAttribute('aria-live', 'polite');
    header.append(title, count);
    input = doc.createElement('input');
    input.type = 'search';
    input.placeholder = tr('search');
    input.setAttribute('aria-label', tr('search'));
    input.className =
      'h-8 w-full rounded-md border border-zinc-200/80 bg-zinc-50/70 px-2.5 text-sm placeholder:text-zinc-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/[0.03] dark:placeholder:text-zinc-400';
    input.addEventListener('input', render);
    const actions = doc.createElement('div');
    actions.className = 'flex items-center justify-between gap-2 py-1.5';
    for (const select of [true, false]) {
      const button = doc.createElement('button');
      button.type = 'button';
      button.textContent = tr(select ? 'select_all' : 'clear');
      button.className =
        'cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-zinc-600 transition-colors duration-100 motion-reduce:transition-none hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-default disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100 dark:active:bg-white/10';
      button.addEventListener('click', () => {
        changeSelection(selectMapScope(getSelection(), matchingMaps(maps, input.value), select));
      });
      actions.append(button);
      if (select) selectAll = button;
      else clear = button;
    }
    list = doc.createElement('div');
    list.className = 'map-name-picker-list max-h-60 overflow-y-auto overscroll-contain';
    list.setAttribute('aria-label', t('filters_toolbar.map_name'));
    footer = doc.createElement('p');
    footer.className =
      'mt-1.5 border-t border-zinc-100 px-1 pt-1.5 text-[11px] text-zinc-500 dark:border-white/10 dark:text-zinc-400';
    panel.append(header, input, actions, list, footer);
    panel.addEventListener('pointerdown', (event) => event.stopPropagation());
    panel.addEventListener('click', (event) => event.stopPropagation());
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
      const boxes = [...list.querySelectorAll('input')];
      if (
        ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) &&
        (event.target === input || boxes.includes(event.target))
      ) {
        event.preventDefault();
        let index = boxes.indexOf(event.target);
        if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = boxes.length - 1;
        else index = (index + (event.key === 'ArrowDown' ? 1 : -1) + boxes.length) % boxes.length;
        boxes[index]?.focus();
      }
    });
    doc.addEventListener('pointerdown', (event) => {
      if (!panel.hidden && !panel.contains(event.target) && !anchor.contains(event.target)) close();
    });
    doc.addEventListener('focusin', (event) => {
      if (!panel.hidden && !panel.contains(event.target) && event.target !== anchor) close(false);
    });
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    doc.body.append(panel);
  }
  return {
    close,
    async toggle(button) {
      if (!panel) init();
      if (!panel.hidden && anchor === button) {
        close();
        return;
      }
      anchor = button;
      anchor.setAttribute('aria-haspopup', 'dialog');
      anchor.setAttribute('aria-controls', panel.id);
      anchor.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
      if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        panel.animate?.(
          [
            { opacity: 0, transform: 'translateY(3px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 140, easing: 'ease-out' }
        );
      }
      input.value = '';
      render();
      input.focus();
      if (loaded || loading) return;
      loading = true;
      failed = false;
      render();
      try {
        maps = await loadMaps();
        loaded = true;
      } catch {
        failed = true;
      } finally {
        loading = false;
        render();
      }
    },
  };
}
