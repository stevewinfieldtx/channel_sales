<<<<<<< HEAD
// Smooth scroll helper
=======
>>>>>>> c8899f8e4e3b0b8a0787a8397fe7a0b87707462a
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

<<<<<<< HEAD
// Open the app root (unused but retained for parity)
=======
>>>>>>> c8899f8e4e3b0b8a0787a8397fe7a0b87707462a
function openApp(e) {
  if (e) e.preventDefault();
  window.location.href = '/';
  return false;
}

<<<<<<< HEAD

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Generic fetch wrapper that returns JSON or text
=======
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
>>>>>>> c8899f8e4e3b0b8a0787a8397fe7a0b87707462a
async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

<<<<<<< HEAD
// Status bar helper
=======
>>>>>>> c8899f8e4e3b0b8a0787a8397fe7a0b87707462a
function setStatus(msg) {
  const el = document.getElementById('status');
  if (el) el.textContent = msg || '';
}

<<<<<<< HEAD
// Render result to the page and show the download button
=======
>>>>>>> c8899f8e4e3b0b8a0787a8397fe7a0b87707462a
function setResult(content) {
  const el = document.getElementById('result');
  if (!el) return;
  el.classList.remove('hidden');
  const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  const html = window.marked ? marked.parse(text) : text;
  el.innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;
<<<<<<< HEAD
  // reveal PDF download button
  const pdfBtn = document.getElementById('download-pdf-btn');
  if (pdfBtn) pdfBtn.classList.remove('hidden');
}

// Toast helper for transient notifications
=======
}

>>>>>>> c8899f8e4e3b0b8a0787a8397fe7a0b87707462a
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
}

<<<<<<< HEAD
// Load industries and subindustries from the API
=======
>>>>>>> c8899f8e4e3b0b8a0787a8397fe7a0b87707462a
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

<<<<<<< HEAD
// Handle form submission and trigger analysis
=======
>>>>>>> c8899f8e4e3b0b8a0787a8397fe7a0b87707462a
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

<<<<<<< HEAD
// Convert the result panel into a downloadable PDF
async function downloadPDF() {
  const el = document.getElementById('result');
  if (!el) return;
  const opt = {
    margin: 10,
    filename: 'channel_sales_analysis.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };
  await html2pdf().set(opt).from(el).save();
}

// Initialise page once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadIndustries();
});
=======
document.addEventListener('DOMContentLoaded', () => {
  loadIndustries();
});

>>>>>>> c8899f8e4e3b0b8a0787a8397fe7a0b87707462a
