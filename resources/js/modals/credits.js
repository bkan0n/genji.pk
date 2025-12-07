// ============================================================================
// Helpers credits
// ============================================================================
function showCreditsModal() {
  const modal = document.getElementById('creditsModal');
  const backdrop = document.getElementById('creditsBackdrop');
  const card = document.getElementById('creditsCard');
  if (!modal || !backdrop || !card) return;

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  requestAnimationFrame(() => {
    backdrop.classList.remove('opacity-0');
    backdrop.classList.add('opacity-100');

    card.classList.remove('translate-y-4', 'scale-95', 'opacity-0');
    card.classList.add('translate-y-0', 'scale-100', 'opacity-100');
  });
}

function hideCreditsModal() {
  const modal = document.getElementById('creditsModal');
  const backdrop = document.getElementById('creditsBackdrop');
  const card = document.getElementById('creditsCard');
  if (!modal || !backdrop || !card) return;

  backdrop.classList.remove('opacity-100');
  backdrop.classList.add('opacity-0');

  card.classList.add('translate-y-4', 'scale-95', 'opacity-0');
  card.classList.remove('translate-y-0', 'scale-100', 'opacity-100');

  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }, 200);
}

function initCreditsModal() {
  const modal = document.getElementById('creditsModal');
  if (!modal) return;

  document.querySelectorAll('[data-open="credits"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showCreditsModal();
    });
  });

  document.getElementById('creditsModalClose')?.addEventListener('click', hideCreditsModal);
  document.getElementById('creditsBackdrop')?.addEventListener('click', hideCreditsModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) hideCreditsModal();
  });

  populateCredits();
}

// --------------------------------------------------------------------------
// UI helpers
// --------------------------------------------------------------------------
function createContributorItem({ name, avatar, role, note, discord, discordLabel }) {
  const wrap = document.createElement('div');

  if (role) {
    wrap.className = [
      'contributor group flex items-center gap-4',
      'rounded-2xl bg-zinc-900/80 px-4 py-3',
      'ring-1 ring-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7)]',
      'hover:bg-zinc-900 hover:ring-emerald-400/40 transition'
    ].join(' ');

    wrap.innerHTML = `
      <div class="relative h-12 w-12 shrink-0">
        <img src="${avatar}" alt="${name}"
             class="h-12 w-12 rounded-full object-cover ring-1 ring-white/15 shadow-md">
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <p class="truncate text-sm font-semibold text-white/95">${name}</p>
          <span class="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5
                       text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
            ${role}
          </span>
        </div>
        <div class="mt-0.5 space-y-0.5 text-xs text-zinc-400">
          ${note ? `<p class="line-clamp-2">${note}</p>` : ''}
          ${discord
            ? `<p class="font-mono text-[11px] text-zinc-500">
                 ${(discordLabel || 'Discord')}:
                 <span class="text-zinc-300">${discord}</span>
               </p>`
            : ''
          }
        </div>
      </div>
    `;
  } else {
    wrap.className = [
      'contributor inline-flex items-center gap-2',
      'rounded-full bg-white/5 px-3 py-1.5',
      'ring-1 ring-white/10 shadow-sm'
    ].join(' ');

    wrap.innerHTML = `
      <img src="${avatar}" alt="${name}"
           class="h-8 w-8 rounded-full object-cover ring-1 ring-white/10">
      <span class="text-xs font-medium text-zinc-100">${name}</span>
    `;
  }

  return wrap;
}

// --------------------------------------------------------------------------
// Data
// --------------------------------------------------------------------------
function populateCredits() {
  const translators = [
    { name: 'CoralMage',   avatar: 'assets/profile/coralmage.webp' },
    { name: 'Poiliu', avatar: 'assets/profile/poiliu.webp' },
  ];

  const trEl = document.getElementById('creditsTranslations');
  const backendRole   = trEl?.dataset.backendRole   || 'Backend';
  const frontendRole  = trEl?.dataset.frontendRole  || 'Frontend';
  const backendNote   = trEl?.dataset.backendNote   || 'API, data model & bot integration.';
  const frontendNote  = trEl?.dataset.frontendNote  || 'UI/UX, map browser & OCR integration.';
  const discordLabel  = trEl?.dataset.discordLabel  || 'Discord';

  const websiteCreators = [
    {
      name: 'Joe',
      avatar: 'assets/profile/joe.jpg',
      role: backendRole,
      note: backendNote,
      discord: 'youngnebula',
      discordLabel,
    },
    {
      name: 'Arrow',
      avatar: 'assets/profile/arrow.png',
      role: frontendRole,
      note: frontendNote,
      discord: '.aiapaec',
      discordLabel,
    },
  ];

  const translatorsList = document.getElementById('translatorsList');
  const websiteCreatorsList = document.getElementById('websiteCreatorsList');

  if (translatorsList) translatorsList.innerHTML = '';
  if (websiteCreatorsList) websiteCreatorsList.innerHTML = '';

  websiteCreators.forEach((c) =>
    websiteCreatorsList?.appendChild(createContributorItem(c))
  );
  translators.forEach((t) =>
    translatorsList?.appendChild(createContributorItem(t))
  );
}

document.addEventListener('DOMContentLoaded', initCreditsModal);

window.openCreditsModal = showCreditsModal;
window.closeCreditsModal = hideCreditsModal;
