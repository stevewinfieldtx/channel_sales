// Smooth scroll helper
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Open the app root (unused but retained for parity)
function openApp(e) {
  if (e) e.preventDefault();
  window.location.href = '/';
  return false;
}


// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Generic fetch wrapper that returns JSON or text
async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

// Status bar helper
function setStatus(msg) {
  const el = document.getElementById('status');
  if (el) el.textContent = msg || '';
}

// Render result to the page and show the download button
function setResult(content) {
  const el = document.getElementById('result');
  if (!el) return;
  el.classList.remove('hidden');
  const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  const html = window.marked ? marked.parse(text) : text;
  el.innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;
  // reveal PDF download button
  const pdfBtn = document.getElementById('download-pdf-btn');
  if (pdfBtn) pdfBtn.classList.remove('hidden');
}

// Toast helper for transient notifications
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
}

// Load industries and subindustries from the API
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

// Handle form submission and trigger analysis
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