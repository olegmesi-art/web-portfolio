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

document.querySelectorAll('.compare-card, .benefit-grid article, .studio-stats article, .project, .service-list article, .service-card, .price-card, .included-grid span, .calc-choice, .calc-addon, .timeline article, .concept-steps article, .seo-format-card, .seo-industry-card, .seo-result-card, .seo-step, .insight-card, .related-card').forEach(item => {
  item.classList.add('reveal');
  observer.observe(item);
});

const serviceTabs = [...document.querySelectorAll('[data-service-tab]')];
const servicePanels = [...document.querySelectorAll('[data-service-panel]')];

const activateServiceTab = tab => {
  const target = tab.dataset.serviceTab;

  serviceTabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });

  servicePanels.forEach(panel => {
    const active = panel.dataset.servicePanel === target;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
    if (active) panel.querySelectorAll('.service-card').forEach(card => card.classList.add('visible'));
  });
};

serviceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateServiceTab(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const backwards = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    const nextIndex = (index + (backwards ? -1 : 1) + serviceTabs.length) % serviceTabs.length;
    serviceTabs[nextIndex].focus();
    activateServiceTab(serviceTabs[nextIndex]);
  });
});

if (serviceTabs.length) activateServiceTab(serviceTabs.find(tab => tab.classList.contains('active')) || serviceTabs[0]);

const calculator = document.getElementById('cost-calculator');

if (calculator) {
  const isEnglish = calculator.dataset.language === 'en';
  const priceOutput = calculator.querySelector('#calculator-price');
  const timeOutput = calculator.querySelector('#calculator-time');
  const telegramLink = calculator.querySelector('#calc-telegram');
  const pagesInput = calculator.querySelector('#extra-pages');
  const typeInputs = [...calculator.querySelectorAll('input[name="site-type"]')];
  const addonInputs = [...calculator.querySelectorAll('[data-addon-key]')];

  const clampPages = value => Math.min(20, Math.max(0, Number.parseInt(value, 10) || 0));
  const formatPrice = price => isEnglish
    ? `from UAH ${price.toLocaleString('en-US')}`
    : `від ${price.toLocaleString('uk-UA')} ₴`;
  const formatTime = (min, max) => isEnglish
    ? `${min}–${max} working days`
    : `${min}–${max} робочих днів`;

  const updateCalculator = () => {
    const selectedType = typeInputs.find(input => input.checked) || typeInputs[0];
    const included = new Set((selectedType.dataset.includes || '').split(',').filter(Boolean));
    const pages = clampPages(pagesInput.value);
    pagesInput.value = String(pages);

    let price = Number(selectedType.dataset.price);
    let minDays = Number(selectedType.dataset.daysMin);
    let maxDays = Number(selectedType.dataset.daysMax);
    const selectedAddons = [];

    addonInputs.forEach(addon => {
      if (!addon.checked) return;
      selectedAddons.push(addon.dataset.label);
      if (included.has(addon.dataset.addonKey)) return;
      price += Number(addon.dataset.price);
      minDays += Number(addon.dataset.days);
      maxDays += Number(addon.dataset.days);
    });

    price += pages * 1200;
    minDays += Math.ceil(pages / 2);
    maxDays += pages;

    const priceText = formatPrice(price);
    const timeText = formatTime(minDays, maxDays);
    priceOutput.textContent = priceText;
    timeOutput.textContent = timeText;

    const addonsText = selectedAddons.length
      ? selectedAddons.join(', ')
      : (isEnglish ? 'none selected' : 'не обрано');
    const message = isEnglish
      ? `Hello, SHTR Studio! I created an estimate on your website.\nWebsite: ${selectedType.dataset.label}\nAdditional features: ${addonsText}\nAdditional pages: ${pages}\nIndicative budget: ${priceText}\nIndicative timeline: ${timeText}\nI would like to discuss the project details.`
      : `Вітаю, SHTR Studio! Я зробив(ла) розрахунок на сайті.\nФормат: ${selectedType.dataset.label}\nДодаткові можливості: ${addonsText}\nДодаткові сторінки: ${pages}\nОрієнтовна вартість: ${priceText}\nОрієнтовний строк: ${timeText}\nХочу обговорити деталі проєкту.`;
    telegramLink.href = `https://t.me/Oleghshatarsky?text=${encodeURIComponent(message)}`;
  };

  calculator.addEventListener('change', updateCalculator);
  pagesInput.addEventListener('input', updateCalculator);
  calculator.querySelectorAll('[data-page-action]').forEach(button => {
    button.addEventListener('click', () => {
      const direction = button.dataset.pageAction === 'plus' ? 1 : -1;
      pagesInput.value = String(clampPages(Number(pagesInput.value) + direction));
      updateCalculator();
    });
  });
  calculator.addEventListener('submit', event => event.preventDefault());
  updateCalculator();
}

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
