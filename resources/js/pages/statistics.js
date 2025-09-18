/* =========================
   Graphs
   ========================= */

const CURRENT_LANG = document.documentElement.lang || 'en';
let translations = window.STATISTICS_I18N || {};
const API_STATS = '/api/community/statistics';

/* ---------- i18n ---------- */
function t(key, params = {}) {
  const parts = key.split('.');
  let out = translations;
  for (const p of parts) {
    if (!out?.[p]) return key;
    out = out[p];
  }
  if (typeof out === 'string') {
    Object.entries(params).forEach(([k, v]) => {
      out = out.replace(new RegExp(`{${k}}`, 'g'), v);
    });
  }
  return out;
}

/* ---------- Theme  ---------- */
const tw = {
  text: '#e4e4e7',
  subtext: '#a1a1aa',
  border: 'rgba(255,255,255,0.10)',
  grid: 'rgba(255,255,255,0.10)',
  gridSoft: 'rgba(255,255,255,0.06)',
  panel: 'rgba(24,24,27,0.6)',
  tooltipBg: 'rgba(24,24,27,0.95)',
  tooltipBd: 'rgba(255,255,255,0.12)',
  brand: '#22c55e',
  brandAlt: '#34d399',
};

/* ======================================================================
   Dropdowns Tailwind (accessible + sync <select>)
   ====================================================================== */
const dropdownUX = new Map();

function enhanceDropdown(selectOrId) {
  const select = typeof selectOrId === 'string' ? document.getElementById(selectOrId) : selectOrId;
  if (!select) return null;
  if (dropdownUX.has(select)) {
    const inst = dropdownUX.get(select);
    inst.sync();
    return inst;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'relative inline-block text-left';
  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);

  select.classList.add('sr-only');
  select.tabIndex = -1;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className =
    'inline-flex items-center gap-2 rounded-md border border-white/10 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-500/40';
  btn.setAttribute('aria-haspopup', 'listbox');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = `<span class="truncate"></span><svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20"><path fill="currentColor" d="M5 8l5 5 5-5H5z"/></svg>`;
  wrapper.insertBefore(btn, select);

  const menu = document.createElement('ul');
  menu.className =
    'invisible opacity-0 translate-y-1 transition absolute left-0 mt-2 min-w-40 rounded-lg bg-zinc-900/95 backdrop-blur shadow-lg ring-1 ring-white/10 py-1.5 z-50 max-h-56 overflow-y-auto';
  menu.setAttribute('role', 'listbox');
  wrapper.appendChild(menu);

  let open = false;
  let activeIndex = -1;

  function labelFor(v) {
    const opt = [...select.options].find((o) => o.value === v);
    return opt ? opt.textContent || opt.value : '';
  }
  function buildItems() {
    menu.innerHTML = '';
    [...select.options].forEach((opt, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('data-value', opt.value);
      li.className =
        'px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/10 cursor-pointer flex items-center justify-between';
      if (opt.disabled) li.classList.add('opacity-50', 'cursor-not-allowed');
      const isSel = opt.value === select.value;
      li.innerHTML = `<span class="truncate">${opt.textContent}</span>${isSel ? '<svg class="h-4 w-4 text-emerald-400" viewBox="0 0 20 20"><path fill="currentColor" d="M7.6 13.2L4.4 10l-1.4 1.4 4.6 4.6L18 6.6 16.6 5.2z"/></svg>' : ''}`;
      li.addEventListener('click', () => {
        if (opt.disabled) return;
        if (select.value !== opt.value) {
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        buildItems();
        syncButton();
        closeMenu();
      });
      menu.appendChild(li);
    });
  }
  function syncButton() {
    btn.querySelector('span').textContent =
      labelFor(select.value) || select.options[0]?.textContent || '';
  }
  function openMenu() {
    if (open) return;
    open = true;
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.remove('invisible', 'opacity-0', 'translate-y-1');
    activeIndex = [...select.options].findIndex((o) => o.value === select.value);
    highlightActive();
    document.addEventListener('click', onDocClick, { capture: true });
    document.addEventListener('keydown', onKeyDown);
  }
  function closeMenu() {
    if (!open) return;
    open = false;
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.add('invisible', 'opacity-0', 'translate-y-1');
    document.removeEventListener('click', onDocClick, { capture: true });
    document.removeEventListener('keydown', onKeyDown);
  }
  function toggleMenu() {
    open ? closeMenu() : openMenu();
  }
  function onDocClick(e) {
    if (!wrapper.contains(e.target)) closeMenu();
  }
  function highlightActive() {
    [...menu.children].forEach((el, i) => {
      el.classList.toggle('bg-white/10', i === activeIndex);
      if (i === activeIndex) el.scrollIntoView({ block: 'nearest' });
    });
  }
  function onKeyDown(e) {
    if (!open) return;
    const items = [...menu.children];
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1 + items.length) % items.length;
      highlightActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      highlightActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      items[activeIndex]?.click();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      btn.focus();
    }
  }
  btn.addEventListener('click', toggleMenu);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMenu();
    }
  });

  buildItems();
  syncButton();
  select.addEventListener('change', () => {
    syncButton();
    buildItems();
  });

  const inst = {
    wrapper,
    btn,
    menu,
    select,
    open: openMenu,
    close: closeMenu,
    sync() {
      buildItems();
      syncButton();
    },
    destroy() {
      closeMenu();
      wrapper.replaceWith(select);
      select.classList.remove('sr-only');
      dropdownUX.delete(select);
    },
  };
  dropdownUX.set(select, inst);
  return inst;
}
function enhanceOrUpdateDropdown(id) {
  const el = document.getElementById(id);
  if (el) enhanceDropdown(el)?.sync();
}

/* ======================================================================
   Modal plein écran (graphiques)
   ====================================================================== */
let __modalChartInstance = null;

function closeChartModal() {
  if (__modalChartInstance) {
    try {
      __modalChartInstance.destroy();
    } catch {}
    __modalChartInstance = null;
  }
  document.getElementById('chartModalOverlay')?.remove();
  document.body.classList.remove('overflow-hidden');
}
function createBaseModal(titleText) {
  const overlay = document.createElement('div');
  overlay.id = 'chartModalOverlay';
  overlay.className =
    'fixed inset-0 z-[140] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4';

  const box = document.createElement('div');
  box.className =
    'w-[92vw] h-[82vh] max-w-7xl rounded-2xl border border-white/10 bg-zinc-950/95 ring-1 ring-white/10 shadow-2xl overflow-hidden flex flex-col';
  overlay.appendChild(box);

  const header = document.createElement('header');
  header.className =
    'flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-gradient-to-b from-zinc-950/95 to-zinc-950/80';
  header.innerHTML = `
    <div class="text-sm font-semibold text-zinc-200 truncate">${titleText || 'Chart'}</div>
    <div class="flex items-center gap-2">
      <button id="chartModalClose" class="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5">Esc</button>
    </div>`;
  box.appendChild(header);

  const body = document.createElement('div');
  body.className = 'flex-1 p-3 min-h-0';
  box.appendChild(body);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeChartModal();
  });
  header.querySelector('#chartModalClose').addEventListener('click', closeChartModal);
  window.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') {
      closeChartModal();
      window.removeEventListener('keydown', esc);
    }
  });

  document.body.appendChild(overlay);
  document.body.classList.add('overflow-hidden');
  return { overlay, body };
}

function openChartModalFromChartJS(chartInstance, titleText) {
  closeChartModal();

  const { body } = createBaseModal(titleText);
  const canvas = document.createElement('canvas');
  canvas.className = 'w-full h-full';
  body.appendChild(canvas);

  const type = chartInstance.config.type;
  const data = JSON.parse(JSON.stringify(chartInstance.config.data || chartInstance.data || {}));
  const options = JSON.parse(
    JSON.stringify(chartInstance.options || chartInstance.config.options || {})
  );

  const ctx = canvas.getContext('2d');
  __modalChartInstance = new Chart(ctx, {
    type,
    data,
    options: {
      ...options,
      responsive: true,
      maintainAspectRatio: false,
      animation: { ...(options.animation || {}), duration: 600 },
    },
  });

  canvas.addEventListener('dblclick', closeChartModal);
}

function openSvgModalFromElement(svgEl, titleText) {
  if (!svgEl) return;

  closeChartModal();

  const { body } = createBaseModal(titleText);

  const wrap = document.createElement('div');
  wrap.className = 'w-full h-full flex items-center justify-center overflow-hidden min-h-0';
  body.appendChild(wrap);

  const clone = svgEl.cloneNode(true);
  clone.removeAttribute('width');
  clone.removeAttribute('height');
  clone.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', '0 0 600 600');
  clone.setAttribute('class', 'block w-full h-full');
  clone.style.width = '100%';
  clone.style.height = '100%';
  clone.style.maxWidth = '100%';
  clone.style.maxHeight = '100%';
  clone.style.display = 'block';

  wrap.appendChild(clone);
  clone.addEventListener('dblclick', closeChartModal);
}

/* ======================================================================
   Chart.js defaults
   ====================================================================== */
function applyChartJsDefaults() {
  if (!window.Chart) return;
  const d = Chart.defaults;
  d.color = tw.text;
  d.font = { ...(d.font || {}), family: 'Inter, ui-sans-serif', weight: '600' };
  d.plugins = d.plugins || {};
  d.plugins.legend = d.plugins.legend || {};
  d.plugins.legend.labels = d.plugins.legend.labels || {};
  d.plugins.tooltip = d.plugins.tooltip || {};
  d.scales = d.scales || {};
  d.scales.linear = d.scales.linear || {};
  d.scales.linear.grid = d.scales.linear.grid || {};
  d.scales.category = d.scales.category || {};
  d.scales.category.grid = d.scales.category.grid || {};
  d.plugins.legend.labels.color = tw.subtext;
  d.plugins.tooltip.backgroundColor = tw.tooltipBg;
  d.plugins.tooltip.titleColor = tw.text;
  d.plugins.tooltip.bodyColor = tw.subtext;
  d.plugins.tooltip.borderColor = tw.tooltipBd;
  d.plugins.tooltip.borderWidth = 1;
  d.scales.linear.grid.color = tw.gridSoft;
  d.scales.category.grid.color = tw.gridSoft;
}

/* ======================================================================
   Donut SVG
   ====================================================================== */
async function fetchRankData(endpoint) {
  try {
    const r = await fetch(`${API_STATS}/${endpoint}`, { cache: 'no-store' });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return await r.json();
  } catch (e) {
    console.error('Erreur lors du chargement des données:', e);
    return [];
  }
}
function getSvgGeometry() {
  const rings = document.getElementById('rings-container');
  const svg = rings?.ownerSVGElement;
  if (!svg) return null;
  const vb = (svg.getAttribute('viewBox') || '0 0 600 600').split(/\s+/).map(Number);
  const width = vb[2] || 600,
    height = vb[3] || 600;
  const minDim = Math.min(width, height);
  const cx = width / 2,
    cy = height / 2;
  const radiusOuter = Math.round(minDim * 0.33);
  const radiusInner = radiusOuter - 24;
  return { svg, cx, cy, radiusInner, radiusOuter };
}
async function generateSVG(endpoint) {
  const raw = await fetchRankData(endpoint);
  if (!Array.isArray(raw) || raw.length === 0) return;
  const isSkillEndpoint = endpoint.includes('skill/players');
  const filtered = isSkillEndpoint ? raw.filter((r) => r.tier !== 'Ninja') : raw;
  const total = filtered.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  if (!total) return;

  const ringsContainer = document.getElementById('rings-container');
  const figuresContainer = document.getElementById('figures-container');
  const linesContainer = document.getElementById('lines-container');
  const hoverText = document.getElementById('hover-text');
  if (!ringsContainer || !figuresContainer || !linesContainer || !hoverText) return;

  const geom = getSvgGeometry();
  if (!geom) return;
  const { svg, cx, cy, radiusInner, radiusOuter } = geom;

  ringsContainer.innerHTML = '';
  figuresContainer.innerHTML = '';
  linesContainer.innerHTML = '';

  let startAngle = -90;
  const skillTierColors = ['#bef264', '#fde047', '#fb923c', '#f97316', '#ef4444', '#991b1b'];
  const tierColors = [
    '#a3e635',
    '#84cc16',
    '#bef264',
    '#fde047',
    '#fbbf24',
    '#fb923c',
    '#f97316',
    '#ff6b3d',
    '#ef4444',
    '#dc2626',
    '#b91c1c',
    '#991b1b',
    '#7f1d1d',
    '#781313',
    '#5f1010',
    '#4a0d0d',
    '#3f0a0a',
    '#350808',
    '#280606',
    '#1e0505',
    '#160404',
  ];
  const colors = isSkillEndpoint ? skillTierColors : tierColors;

  hoverText.setAttribute('x', cx);
  hoverText.setAttribute('y', cy + 40);
  hoverText.setAttribute('font-size', '16');
  hoverText.setAttribute('fill', tw.text);
  hoverText.setAttribute('font-family', 'Inter, ui-sans-serif');
  hoverText.setAttribute('text-anchor', 'middle');
  hoverText.setAttribute('font-weight', '600');
  hoverText.style.opacity = 0;

  if (svg && !svg.querySelector('#segShadow')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `<filter id="segShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="rgba(0,0,0,0.5)"/></filter>`;
    svg.prepend(defs);
  }

  filtered.forEach((rank, i) => {
    const amount = Number(rank.amount) || 0;
    const pct = total ? amount / total : 0;
    if (pct <= 0) return;
    const sweep = pct * 360;
    const endAngle = startAngle + sweep;
    const largeArc = sweep > 180 ? 1 : 0;
    const x1 = cx + radiusInner * Math.cos((Math.PI / 180) * startAngle);
    const y1 = cy + radiusInner * Math.sin((Math.PI / 180) * startAngle);
    const x2 = cx + radiusInner * Math.cos((Math.PI / 180) * endAngle);
    const y2 = cy + radiusInner * Math.sin((Math.PI / 180) * endAngle);
    const x3 = cx + radiusOuter * Math.cos((Math.PI / 180) * endAngle);
    const y3 = cy + radiusOuter * Math.sin((Math.PI / 180) * endAngle);
    const x4 = cx + radiusOuter * Math.cos((Math.PI / 180) * startAngle);
    const y4 = cy + radiusOuter * Math.sin((Math.PI / 180) * startAngle);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      `M${x1},${y1} A${radiusInner},${radiusInner} 0 ${largeArc},1 ${x2},${y2} L${x3},${y3} A${radiusOuter},${radiusOuter} 0 ${largeArc},0 ${x4},${y4} Z`
    );
    path.setAttribute('class', 'segment');
    path.setAttribute('fill', colors[i % colors.length]);
    path.setAttribute('filter', 'url(#segShadow)');
    path.style.opacity = 0;

    path.addEventListener('mouseenter', () => {
      gsap.to(path, { duration: 0.15, scale: 1.01, transformOrigin: `${cx}px ${cy}px` });
      hoverText.textContent = t('playersInTier', { amount, tier: rank.tier });
      hoverText.style.opacity = 1;
    });
    path.addEventListener('mouseleave', () => {
      gsap.to(path, { duration: 0.2, scale: 1 });
      hoverText.style.opacity = 0;
    });

    ringsContainer.appendChild(path);

    const mid = startAngle + sweep / 2;
    const sx = cx + radiusOuter * Math.cos((Math.PI / 180) * mid);
    const sy = cy + radiusOuter * Math.sin((Math.PI / 180) * mid);
    const ex = cx + (radiusOuter + 16) * Math.cos((Math.PI / 180) * mid);
    const ey = cy + (radiusOuter + 16) * Math.sin((Math.PI / 180) * mid);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', sx);
    line.setAttribute('y1', sy);
    line.setAttribute('x2', ex);
    line.setAttribute('y2', ey);
    line.setAttribute('stroke', tw.grid);
    line.setAttribute('stroke-width', '1');
    line.setAttribute('class', 'label-line');
    line.style.opacity = 0;
    linesContainer.appendChild(line);

    const tx = cx + (radiusOuter + 44) * Math.cos((Math.PI / 180) * mid);
    const ty = cy + (radiusOuter + 44) * Math.sin((Math.PI / 180) * mid);

    const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t1.setAttribute('x', tx);
    t1.setAttribute('y', ty - 10);
    t1.setAttribute('font-size', '12');
    t1.setAttribute('fill', tw.text);
    t1.setAttribute('font-family', 'Inter, ui-sans-serif');
    t1.setAttribute('font-weight', '700');
    t1.setAttribute('text-anchor', 'middle');
    t1.setAttribute('class', 'label-text');
    t1.style.opacity = 0;
    t1.textContent = String(rank.tier).toUpperCase();
    figuresContainer.appendChild(t1);

    const t2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t2.setAttribute('x', tx);
    t2.setAttribute('y', ty + 8);
    t2.setAttribute('font-size', '11');
    t2.setAttribute('fill', tw.subtext);
    t2.setAttribute('font-family', 'Inter, ui-sans-serif');
    t2.setAttribute('font-weight', '600');
    t2.setAttribute('text-anchor', 'middle');
    t2.setAttribute('class', 'label-percentage');
    t2.style.opacity = 0;
    t2.textContent = `${(pct * 100).toFixed(1)}%`;
    figuresContainer.appendChild(t2);

    startAngle = endAngle;
  });

  function animateSegments() {
    document.querySelectorAll('.segment').forEach((p, i) => {
      gsap.fromTo(
        p,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: 'power2.out', delay: i * 0.1 }
      );
    });
  }
  function animateLabelsAndLines() {
    const lines = document.querySelectorAll('.label-line');
    const labels = document.querySelectorAll('.label-text, .label-percentage');
    lines.forEach((l, i) => {
      gsap.fromTo(
        l,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: 'power2.out', delay: i * 0.05 }
      );
    });
    labels.forEach((lab, i) => {
      gsap.fromTo(
        lab,
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          delay: lines.length * 0.05 + i * 0.04,
        }
      );
    });
  }
  setTimeout(() => {
    animateSegments();
    animateLabelsAndLines();
  }, 400);
}

/* ======================================================================
   Click-to-zoom helpers
   ====================================================================== */
function registerChartZoom(el, chartInstance, title) {
  if (!el) return;
  el.style.cursor = 'zoom-in';

  el.__currentChart = chartInstance;
  el.__modalTitle = title || 'Chart';

  if (!el.__zoomHandler) {
    el.__zoomHandler = () => {
      if (!el.__currentChart) return;
      closeChartModal();
      openChartModalFromChartJS(el.__currentChart, el.__modalTitle);
    };
    el.addEventListener('click', el.__zoomHandler);
  }
}

/* ======================================================================
   MAPS PER DIFFICULTY — BAR
   ====================================================================== */
async function initBarDifficulty() {
  const res = await fetch(`${API_STATS}/maps/difficulty`, { cache: 'no-store' });
  const mapData = await res.json();

  const labels = mapData.map((it) => t(String(it.difficulty).toLowerCase()));
  const data = mapData.map((it) => Number(it.amount) || 0);
  const colors = ['#22c55e', '#eab308', '#fb923c', '#f97316', '#ef4444', '#991b1b'];

  const el = document.getElementById('difficultyBarChart');
  const chart = new Chart(el, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: t('mapDifficultyDistribution'),
          data,
          backgroundColor: colors,
          borderColor: '#0ea5e9',
          borderWidth: 0,
          borderRadius: { topLeft: 10, topRight: 10 },
          borderSkipped: false,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1000 },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: t('amountOfMaps'),
            color: tw.subtext,
            font: { size: 14, weight: '700' },
          },
          ticks: { color: tw.subtext, font: { size: 12, weight: '600' } },
          grid: { color: tw.gridSoft, drawBorder: true },
        },
        x: {
          title: {
            display: true,
            text: t('difficultyLevel'),
            color: tw.subtext,
            font: { size: 14, weight: '700' },
          },
          ticks: { color: tw.subtext, font: { size: 11, weight: '600' } },
          grid: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => t('mapsTooltip', { count: ctx.raw }) } },
      },
    },
    plugins: [
      {
        id: 'verticalLinesBetweenBars',
        beforeDraw: (chart) => {
          const {
            ctx,
            chartArea: { bottom, top },
            scales: { x },
          } = chart;
          if (!x?.ticks?.length) return;
          ctx.save();
          ctx.strokeStyle = tw.border;
          ctx.lineWidth = 0.5;
          for (let i = 0; i < x.ticks.length - 1; i++) {
            const mid = (x.getPixelForTick(i) + x.getPixelForTick(i + 1)) / 2;
            ctx.beginPath();
            ctx.moveTo(mid, bottom - 3);
            ctx.lineTo(mid, top + 10);
            ctx.stroke();
          }
          ctx.restore();
        },
      },
    ],
  });

  registerChartZoom(el, chart, t('mapDifficultyDistribution') || 'Maps per Difficulty');
}

/* ======================================================================
   POPULAR CREATORS — SCATTER
   ====================================================================== */
function initPopularCreators() {
  const ctx = document.getElementById('qualityDotChart').getContext('2d');
  let chart;

  function render(data) {
    const sorted = data
      .slice()
      .sort((a, b) => b.map_count - a.map_count)
      .slice(0, 18);
    const creators = sorted.map((x) => x.name);
    const counts = sorted.map((x) => Number(x.map_count) || 0);
    const avgQ = sorted.map((x) => Number(x.average_quality) || 0);
    const points = creators.map((_, i) => ({ x: counts[i], y: avgQ[i] }));

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: t('popularCreators'),
            data: points,
            backgroundColor: '#22c55e',
            borderColor: '#22c55e',
            pointRadius: 6,
            pointHoverRadius: 8,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        scales: {
          x: {
            type: 'logarithmic',
            title: {
              display: true,
              text: t('mapAmountLogScale'),
              color: tw.subtext,
              font: { size: 14, weight: '700' },
            },
            ticks: { color: tw.subtext, font: { size: 11, weight: '600' } },
            grid: { color: tw.gridSoft },
          },
          y: {
            title: {
              display: true,
              text: t('averageQuality'),
              color: tw.subtext,
              font: { size: 14, weight: '700' },
            },
            ticks: { color: tw.subtext, font: { size: 11, weight: '600' } },
            grid: { color: tw.gridSoft },
            beginAtZero: true,
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const i = ctx.dataIndex;
                return t('tooltipLabel', {
                  creator: creators[i],
                  mapCount: counts[i],
                  quality: avgQ[i].toFixed(2),
                });
              },
            },
          },
        },
      },
    });

    registerChartZoom(ctx.canvas, chart, t('popularCreators') || 'Popular Creators');
  }

  fetch(`${API_STATS}/creators/popular`)
    .then((r) => r.json())
    .then((d) => (Array.isArray(d) ? render(d) : console.error('Unexpected response', d)))
    .catch((e) => console.error('Error fetching popular creators:', e));
}

/* ======================================================================
   MOST PLAYED MAPS — BUBBLE
   ====================================================================== */
function initMostPlayedMaps() {
  const canvas = document.getElementById('mostPlayedMapsChart');
  const ctx = canvas.getContext('2d');
  let chart;

  const difficultyColors = {
    Easy: 'rgba(34,197,94,0.6)',
    Medium: 'rgba(234,179,8,0.6)',
    Hard: 'rgba(251,146,60,0.6)',
    'Very Hard': 'rgba(249,115,22,0.6)',
    Extreme: 'rgba(239,68,68,0.6)',
    Hell: 'rgba(153,27,27,0.6)',
  };

  function populateOptions(difficulties) {
    const sel = document.getElementById('difficultySelect');
    sel.innerHTML = '';
    difficulties.forEach((d) => {
      const o = document.createElement('option');
      o.value = d;
      o.textContent = t(d.toLowerCase()) || d;
      sel.appendChild(o);
    });
    enhanceOrUpdateDropdown('difficultySelect');
  }

  function updateChart(difficulty, rows) {
    const codes = rows.map((r) => r.code);
    const compl = rows.map((r) => Number(r.completions) || 0);
    const quality = rows.map((r) => Number(r.quality) || 0);

    const labels = codes;
    const points = codes.map((_, i) => ({ x: i, y: compl[i], r: Math.max(quality[i] * 2, 3) }));
    const color = difficultyColors[difficulty] || 'rgba(52,211,153,0.6)';

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'bubble',
      data: {
        labels,
        datasets: [
          {
            label: t('topMapsFor', { difficulty: t(difficulty.toLowerCase()) }),
            data: points,
            backgroundColor: color,
            borderColor: tw.border,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeInQuad' },
        parsing: false,
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: t('mapCodes'),
              color: tw.subtext,
              font: { size: 14, weight: '700' },
            },
            ticks: { color: tw.subtext, font: { size: 11, weight: '600' } },
            grid: { display: false },
          },
          y: {
            title: {
              display: true,
              text: t('completions'),
              color: tw.subtext,
              font: { size: 14, weight: '700' },
            },
            ticks: { color: tw.subtext, font: { size: 11, weight: '600' } },
            beginAtZero: true,
            grid: { color: tw.gridSoft },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                t('completionsTooltip', {
                  map: labels[ctx.raw.x],
                  completions: ctx.raw.y,
                  quality: quality[ctx.dataIndex].toFixed(2),
                }),
            },
          },
        },
      },
    });

    registerChartZoom(canvas, chart, t('topMapsFor') || 'Most Played Maps');
  }

  function fetchAllAndInit() {
    fetch(`${API_STATS}/maps/popular`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Unexpected response');
        const diffs = [...new Set(data.map((r) => r.difficulty))];
        populateOptions(diffs);
        const sel = document.getElementById('difficultySelect');
        function renderSel() {
          const d = sel.value;
          const rows = data.filter((x) => x.difficulty === d);
          updateChart(d, rows);
        }
        sel.addEventListener('change', renderSel);
        renderSel();
      })
      .catch((e) => console.error('Error fetching difficulties/data:', e));
  }

  fetchAllAndInit();
}

/* ======================================================================
   MAPS COUNT — BAR (compact)
   ====================================================================== */
function initMapsCount() {
  fetch(`${API_STATS}/maps/all`)
    .then((r) => r.json())
    .then((data) => {
      if (data?.error) throw new Error(data.error);
      const labels = data.map((x) => x.map_name).slice(0, 25);
      const values = data.map((x) => Number(x.amount) || 0).slice(0, 25);
      const el = document.getElementById('mapsCountChart');
      const ctx = el.getContext('2d');

      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: t('amountOfMaps'),
              data: values,
              backgroundColor: 'rgba(52,211,153,0.2)',
              borderColor: '#34d399',
              borderWidth: 1,
              barThickness: 6,
              borderRadius: 14,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1000 },
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: t('map'),
                color: tw.subtext,
                font: { size: 14, weight: '700' },
              },
              ticks: { display: false, color: tw.subtext, font: { size: 11, weight: '600' } },
              grid: { display: false },
            },
            y: {
              title: {
                display: true,
                text: t('amount'),
                color: tw.subtext,
                font: { size: 14, weight: '700' },
              },
              ticks: { color: tw.subtext, font: { size: 11, weight: '600' }, beginAtZero: true },
              grid: { color: tw.gridSoft },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: { label: (ctx) => `${ctx.chart.data.labels[ctx.dataIndex]}: ${ctx.raw}` },
            },
          },
        },
      });

      registerChartZoom(el, chart, t('totalMapCounts') || 'Total Map Counts');
    })
    .catch((e) => console.error('Erreur lors de la récupération des données:', e));
}

/* ======================================================================
   TIME PLAYED PER DIFFICULTY — LINE
   ====================================================================== */
function initTimePlayed() {
  fetch(`${API_STATS}/ranks/time-played`)
    .then((r) => r.json())
    .then((data) => {
      if (data?.error) throw new Error(data.error);
      const labels = data.map((x) => x.difficulty);
      const totalHours = data.map((x) => (Number(x.total_seconds) || 0) / 3600);
      const el = document.getElementById('timePlayedChart');
      const ctx = el.getContext('2d');

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: t('time_played_per_difficulty'),
              data: totalHours,
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34,197,94,0.15)',
              pointBackgroundColor: '#34d399',
              pointBorderWidth: 0,
              borderWidth: 2,
              tension: 0.35,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1000 },
          scales: {
            x: {
              title: {
                display: true,
                text: t('difficultyLevel'),
                color: tw.subtext,
                font: { size: 14, weight: '700' },
              },
              ticks: { color: tw.subtext, font: { size: 11, weight: '600' } },
              grid: { color: tw.gridSoft },
            },
            y: {
              title: {
                display: true,
                text: t('total_amount_time'),
                color: tw.subtext,
                font: { size: 14, weight: '700' },
              },
              ticks: {
                color: tw.subtext,
                font: { size: 11, weight: '600' },
                beginAtZero: true,
                callback: (v) => `${Number(v).toFixed(0)} h`,
              },
              grid: { color: tw.gridSoft },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  `${ctx.chart.data.labels[ctx.dataIndex]}: ${Number(ctx.raw || 0).toFixed(2)} h`,
              },
            },
          },
        },
      });

      registerChartZoom(el, chart, t('time_played_per_difficulty') || 'Time Played per Difficulty');
    })
    .catch((e) => console.error('Erreur lors de la récupération des données:', e));
}

/* ======================================================================
   LAZY INIT
   ====================================================================== */
function lazyInit(selector, initFn) {
  const el = document.querySelector(selector);
  if (!el) return;
  const once = { done: false };
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !once.done) {
          once.done = true;
          initFn();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.15 }
  );
  obs.observe(el);
}

/* ======================================================================
   BOOT
   ====================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  applyChartJsDefaults();

  document.querySelectorAll('.rounded-2xl.border').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(8px)';
    setTimeout(() => {
      card.style.transition = 'opacity .5s ease, transform .5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 90 * i);
  });

  enhanceOrUpdateDropdown('rankSelect');

  const loadDonutFor = (val) => {
    const endpoint = val === 'communityRanks' ? 'xp/players' : 'skill/players';
    return generateSVG(endpoint);
  };

  const rankSelect = document.getElementById('rankSelect');
  await loadDonutFor(rankSelect?.value || 'normalRanks');

  rankSelect?.addEventListener('change', (e) => {
    loadDonutFor(e.target.value);
  });

  const donutSvg = document.querySelector('#rings-container')?.ownerSVGElement;
  if (donutSvg) {
    donutSvg.style.cursor = 'zoom-in';
    donutSvg.addEventListener('click', () => {
      const sel = document.getElementById('rankSelect');
      const title =
        sel?.value === 'communityRanks'
          ? t('tierRank') || 'Community ranks'
          : t('skillRank') || 'Skill tiers';
      openSvgModalFromElement(donutSvg, title);
    });
  }

  lazyInit('#difficultyBarChart', initBarDifficulty);
  lazyInit('#qualityDotChart', initPopularCreators);
  lazyInit('#mostPlayedMapsChart', initMostPlayedMaps);
  lazyInit('#mapsCountChart', initMapsCount);
  lazyInit('#timePlayedChart', initTimePlayed);
});
