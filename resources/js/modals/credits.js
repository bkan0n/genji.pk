// ============================================================================
// Helpers modaux
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

function createContributorItem({ name, avatar }) {
  const wrap = document.createElement('div');
  wrap.className =
    'contributor inline-flex items-center gap-3 rounded-lg bg-white/5 ' +
    'p-2 ring-1 ring-white/10';
  wrap.innerHTML = `
    <img src="${avatar}" alt="${name}"
         class="h-10 w-10 rounded-full object-cover ring-1 ring-white/10">
    <p class="text-sm font-medium text-white/90">${name}</p>
  `;
  return wrap;
}

function populateCredits() {
  const translators = [
    { name: 'Vertigo', avatar: 'assets/profile/vertigo.webp' },
    { name: 'CoralMage', avatar: 'assets/profile/coralmage.webp' },
    { name: 'Lacepanties', avatar: 'assets/profile/lacepanties.webp' },
    { name: '干しガキ', avatar: 'assets/profile/weds.webp' },
  ];
  const websiteCreators = [
    { name: 'Joe', avatar: 'assets/profile/joe.jpg' },
    { name: 'Arrow', avatar: 'assets/profile/arrow.png' },
  ];

  const translatorsList = document.getElementById('translatorsList');
  const websiteCreatorsList = document.getElementById('websiteCreatorsList');
  translatorsList && (translatorsList.innerHTML = '');
  websiteCreatorsList && (websiteCreatorsList.innerHTML = '');
  translators.forEach((t) => translatorsList?.appendChild(createContributorItem(t)));
  websiteCreators.forEach((c) => websiteCreatorsList?.appendChild(createContributorItem(c)));
}

document.addEventListener('DOMContentLoaded', initCreditsModal);

window.openCreditsModal = showCreditsModal;
window.closeCreditsModal = hideCreditsModal;
