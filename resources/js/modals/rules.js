// ============================================================================
// Helpers for Community Rules
// ============================================================================
function showRulesModal() {
  const modal = document.getElementById('rulesModal');
  const backdrop = document.getElementById('rulesBackdrop');
  const card = document.getElementById('rulesCard');
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

function hideRulesModal() {
  const modal = document.getElementById('rulesModal');
  const backdrop = document.getElementById('rulesBackdrop');
  const card = document.getElementById('rulesCard');
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

function initRulesModal() {
  const modal = document.getElementById('rulesModal');
  if (!modal) return;

  document.querySelectorAll('[data-open="rules"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showRulesModal();
    });
  });

  document.getElementById('rulesModalClose')?.addEventListener('click', hideRulesModal);
  document.getElementById('rulesBackdrop')?.addEventListener('click', hideRulesModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) hideRulesModal();
  });
}

document.addEventListener('DOMContentLoaded', initRulesModal);

window.openRulesModal = showRulesModal;
window.closeRulesModal = hideRulesModal;
