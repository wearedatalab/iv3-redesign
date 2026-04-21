// ===== IV3 Redesign — interactions =====

// Nav scroll state
const nav = document.getElementById('nav');
const progress = document.getElementById('scrollProgress');

function onScroll() {
  const y = window.scrollY;
  if (y > 80) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');

  const h = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (y / h) * 100;
  progress.style.width = pct + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile burger
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('active');
});

// Tabs in trajectory
const tabs = document.querySelectorAll('.tab');
tabs.forEach(t => {
  t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('tab--active'));
    t.classList.add('tab--active');
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll(
  '.project, .service, .tproj, .idea, .about__text, .about__visual, .manifesto__text, .hero__content'
);
revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => io.observe(el));

// Smooth anchor offset accounting for fixed nav already handled by scroll-behavior
// Count-up for hero stats (optional niceness)
const counters = document.querySelectorAll('.hero__stats strong, .about__counters strong');
const countUp = (el) => {
  const raw = el.textContent.trim();
  const match = raw.match(/([\d.]+)(.*)/);
  if (!match) return;
  const target = parseFloat(match[1]);
  const suffix = match[2] || '';
  if (isNaN(target)) return;
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    const display = target % 1 === 0 ? Math.round(val) : val.toFixed(1);
    el.textContent = display + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target);
      counterIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterIO.observe(c));
