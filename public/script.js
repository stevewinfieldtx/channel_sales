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

// API helpers
async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

function setStatus(msg) {
  const el = document.getElementById('status');
  if (el) el.textContent = msg || '';
}

function setResult(content) {
  const el = document.getElementById('result');
  if (!el) return;
  el.classList.remove('hidden');
  const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  const html = window.marked ? marked.parse(text) : text;
  el.innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;
}

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
}

async function loadIndustries() {
  try {
    const data = await fetchJSON('/api/industries');
    if (!Array.isArray(data)) return;
    const industrySel = document.getElementById('select-industry');
    const subSel = document.getElementById('select-subindustries');
    if (!industrySel || !subSel) return;
    industrySel.innerHTML = '';
    data.forEach((item, idx) => {
      const opt = document.createElement('option');
      opt.value = item.industry;
      opt.textContent = item.industry;
      if (idx === 0) opt.selected = true;
      industrySel.appendChild(opt);
    });
    function populateSubs(industryName) {
      const found = data.find(d => d.industry === industryName);
      subSel.innerHTML = '';
      (found?.subindustries || []).forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        subSel.appendChild(opt);
      });
    }
    populateSubs(industrySel.value);
    industrySel.addEventListener('change', () => populateSubs(industrySel.value));
  } catch (e) {
    setStatus('Failed to load industries');
  }
}

async function onStart(e) {
  if (e) e.preventDefault();
  const url = document.getElementById('input-url').value.trim();
  const companyType = document.getElementById('select-company').value;
  const subSel = document.getElementById('select-subindustries');
  const subindustries = Array.from(subSel.selectedOptions).map(o => o.value);
  if (!url) return false;
  setStatus('Analyzing...');
  document.getElementById('run-btn').disabled = true;
  try {
    const result = await fetchJSON('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, companyType, subindustries })
    });
    if (result && result.error) {
      toast('Error: ' + result.error);
    } else {
      setResult(result);
    }
  } catch (err) {
    toast('Request failed');
  } finally {
    setStatus('');
    document.getElementById('run-btn').disabled = false;
  }
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  loadIndustries();
});

