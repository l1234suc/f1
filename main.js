/* ─── FLOWLY WIKI · main.js ─── */

const SECTIONS = ['s0','s1','s2','s3','s4','s5','s6','s7','s8','s9'];

/* ── Smooth scroll to section ── */
function goto(i) {
  const el = document.getElementById(SECTIONS[i]);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
window.goto = goto;

/* ── Show mindmap node info ── */
function showInfo(msg) {
  const el = document.getElementById('node-info');
  if (!el) return;
  el.textContent = '🔬 ' + msg;
  el.style.borderColor = 'var(--sage)';
}
window.showInfo = showInfo;

/* ── Animate a number counter ── */
function animateNum(id, from, to, suffix, dur, decimals = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / dur, 1);
    const val = from + (to - from) * p;
    el.textContent = val.toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ── Draw mindmap connection lines ── */
let linesDrawn = false;
function drawLines() {
  const s1 = document.getElementById('s1');
  if (!s1 || linesDrawn) return;
  const rect = s1.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.7) {
    linesDrawn = true;
    ['l1','l2','l3','l4'].forEach((id, i) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.style.transition = 'opacity 0.4s';
          el.style.opacity    = '1';
        }
      }, i * 150);
    });
  }
}

/* ── Animate KPIs once testing section visible ── */
let kpisDone = false;
function animateKPIs() {
  const el = document.getElementById('s5');
  if (!el || kpisDone) return;
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8) {
    kpisDone = true;
    animateNum('kv1', 0, 100,  '%',  800, 0);
    animateNum('kv2', 0, 22.2, '%',  800, 1);
    animateNum('kv3', 0, 0,    '',   400, 0);
    animateNum('kv4', 0, 25,   '€',  900, 0);
  }
}

/* ── Scroll handler ── */
function onScroll() {
  const doc      = document.documentElement;
  const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);

  /* progress bar */
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = (scrolled * 100) + '%';

  /* active nav link */
  const mid = window.scrollY + window.innerHeight / 2;
  let cur   = 0;
  SECTIONS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= mid) cur = i;
  });

  document.querySelectorAll('.nav-link').forEach((l, i) => {
    l.classList.toggle('active', i === cur);
  });

  const counter = document.getElementById('section-counter');
  if (counter) counter.textContent = String(cur + 1).padStart(2, '0') + ' / 10';

  /* fade-in sections */
  SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85) el.classList.add('visible');
  });

  /* mindmap + kpis */
  drawLines();
  animateKPIs();
}

/* ── Mindmap node hover effect ── */
function initMindmapHover() {
  document.querySelectorAll('[id^="mn"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const shape = el.querySelector('ellipse');
      if (shape) shape.style.filter = 'brightness(1.3)';
    });
    el.addEventListener('mouseleave', () => {
      const shape = el.querySelector('ellipse');
      if (shape) shape.style.filter = '';
    });
  });
}

/* ── Init ── */
window.addEventListener('scroll', onScroll, { passive: true });
document.addEventListener('DOMContentLoaded', () => {
  initMindmapHover();
  /* slight delay so layout is ready */
  setTimeout(() => onScroll(), 120);
});
