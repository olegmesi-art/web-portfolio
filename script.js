const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.benefit-grid article, .project, .service-list article, .timeline article, .seo-format-card, .seo-industry-card, .seo-step, .insight-card, .related-card').forEach(item => {
  item.classList.add('reveal');
  observer.observe(item);
});

document.getElementById('brief-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const isEnglish = document.documentElement.lang === 'en';
  const text = isEnglish
    ? `Hello, SHTR Studio! My name is ${data.get('name')}. Business sector: ${data.get('business')}. I need: ${data.get('details')}`
    : `Вітаю, SHTR Studio! Мене звати ${data.get('name')}. Сфера бізнесу: ${data.get('business')}. Потрібно: ${data.get('details')}`;
  window.open(`https://t.me/Oleghshatarsky?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});
