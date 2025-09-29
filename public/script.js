function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openApp(e) {
  if (e) e.preventDefault();
  window.location.href = '/';
  return false;
}

// Decorative stars
(function makeStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  const count = Math.min(120, Math.floor(window.innerWidth / 10));
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
    s.style.opacity = (0.2 + Math.random() * 0.6).toFixed(2);
    container.appendChild(s);
  }
})();

// Year
document.getElementById('year').textContent = new Date().getFullYear();

