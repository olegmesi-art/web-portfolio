const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const header = document.querySelector('.site-header');

const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.prepend(progress);

const updateScrollUI = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  header?.classList.toggle('scrolled', window.scrollY > 18);
};

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !nav?.classList.contains('open')) return;
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  menuButton?.focus();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.compare-card, .benefit-grid article, .studio-stats article, .project, .service-list article, .price-card, .included-grid span, .timeline article, .concept-steps article, .seo-format-card, .seo-industry-card, .seo-result-card, .seo-step, .insight-card, .related-card').forEach(item => {
  item.classList.add('reveal');
  observer.observe(item);
});

const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (motionAllowed && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1100px) rotateX(${-y * 2.5}deg) rotateY(${x * 3}deg) translateY(-10px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

document.getElementById('brief-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const isEnglish = document.documentElement.lang === 'en';
  const text = isEnglish
    ? `Hello, SHTR Studio! My name is ${data.get('name')}. Business sector: ${data.get('business')}. Contact: ${data.get('contact')}. Website format: ${data.get('format')}. I need: ${data.get('details')}`
    : `Вітаю, SHTR Studio! Мене звати ${data.get('name')}. Сфера бізнесу: ${data.get('business')}. Контакт: ${data.get('contact')}. Формат сайту: ${data.get('format')}. Потрібно: ${data.get('details')}`;
  window.open(`https://t.me/Oleghshatarsky?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});
