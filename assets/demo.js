const demoMenu = document.querySelector('.demo-menu');
const demoNav = document.querySelector('.demo-nav');

demoMenu?.addEventListener('click', () => {
  demoNav.classList.toggle('open');
});

document.querySelectorAll('.demo-nav a').forEach(link => {
  link.addEventListener('click', () => demoNav?.classList.remove('open'));
});

document.querySelectorAll('.demo-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    form.querySelector('.form-note')?.classList.add('show');
    form.reset();
  });
});

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(item => {
      item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
    });
  });
});

const areaRange = document.getElementById('area-range');
const buildType = document.getElementById('build-type');
const areaValue = document.getElementById('area-value');
const calcTotal = document.getElementById('calc-total');

function calculateBuild() {
  if (!areaRange || !buildType || !areaValue || !calcTotal) return;
  const area = Number(areaRange.value);
  const rate = Number(buildType.value);
  areaValue.textContent = `${area} м²`;
  calcTotal.textContent = `${(area * rate).toLocaleString('uk-UA')} ₴`;
}

areaRange?.addEventListener('input', calculateBuild);
buildType?.addEventListener('change', calculateBuild);
calculateBuild();

const packages = {
  start: ['Start Clean', 'від 1 900 ₴', 'Комплексне миття, очищення дисків, пилосос і догляд за пластиком.'],
  pro: ['Pro Detail', 'від 4 900 ₴', 'Глибоке очищення салону, захисний віск і відновлення зовнішнього блиску.'],
  ultimate: ['Ultimate', 'від 11 900 ₴', 'Детейлінг салону, полірування кузова та керамічний захист.']
};

document.querySelectorAll('[data-package]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-package]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const [name, price, text] = packages[button.dataset.package];
    document.getElementById('package-name').textContent = name;
    document.getElementById('package-price').textContent = price;
    document.getElementById('package-text').textContent = text;
  });
});
