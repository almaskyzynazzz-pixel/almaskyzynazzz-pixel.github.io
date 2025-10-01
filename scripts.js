/* Core interactions for VelvetChoco */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// Mobile nav toggle
const toggleBtn = $('.nav__toggle');
const navList = $('#navMenu');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const open = navList.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(open));
  });
}

// Smooth scroll
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id && id.length > 1) {
      const target = $(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navList.classList.remove('is-open');
        toggleBtn?.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Products dataset
const PRODUCTS = [
  { id: 'b1', type: 'bars', name: 'Горькая плитка 72%', tag: 'орехи', price: 2200, img: 'https://images.unsplash.com/photo-1623227772811-2c788a9e9f6e?q=80&w=1200&auto=format&fit=crop' },
  { id: 'b2', type: 'bars', name: 'Молочная плитка карамель', tag: 'карамель', price: 1900, img: 'https://images.unsplash.com/photo-1542332213-9b6f1b4c1c86?q=80&w=1200&auto=format&fit=crop' },
  { id: 't1', type: 'truffles', name: 'Трюфели классические', tag: 'какао', price: 2600, img: 'https://images.unsplash.com/photo-1542442828-287225c294d6?q=80&w=1200&auto=format&fit=crop' },
  { id: 't2', type: 'truffles', name: 'Трюфели с ликёром', tag: 'ликёр', price: 2800, img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop' },
  { id: 's1', type: 'sets', name: 'Подарочный набор Classic', tag: 'набор', price: 5900, img: 'https://images.unsplash.com/photo-1511381939415-c1c76ac76c53?q=80&w=1200&auto=format&fit=crop' },
  { id: 's2', type: 'sets', name: 'Ассорти Velvet', tag: 'ассорти', price: 6900, img: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?q=80&w=1200&auto=format&fit=crop' }
];

function createProductCard(p){
  const el = document.createElement('article');
  el.className = 'product reveal';
  el.dataset.type = p.type;
  el.innerHTML = `
    <img class="product__img" src="${p.img}" alt="${p.name}">
    <div class="product__body">
      <div class="row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span class="tag">${p.tag}</span>
        <span class="price">${p.price.toLocaleString('ru-RU')} ₸</span>
      </div>
      <h3 style="margin:8px 0 6px">${p.name}</h3>
      <button class="btn btn--sm" data-buy="${p.id}">В корзину</button>
    </div>`;
  return el;
}

// Render products
const grid = $('#productGrid');
if (grid) {
  PRODUCTS.forEach(p => grid.appendChild(createProductCard(p)));
}

// Filters
const filterButtons = $$('.chip[data-filter]');
filterButtons.forEach(btn => btn.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  const f = btn.dataset.filter;
  $$('.product', grid).forEach(card => {
    const show = f === 'all' || card.dataset.type === f;
    card.style.display = show ? '' : 'none';
  });
}));

// Works gallery demo
const WORKS = [
  'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543525324-2eebf532048f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1610621087335-5a9c1a4f62e7?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1549396535-c6c9a1a8b9aa?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582571352032-448f7928eca9?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop'
];
const gallery = $('#worksGallery');
if (gallery) {
  WORKS.forEach(src => {
    const t = document.createElement('figure');
    t.className = 'tile reveal';
    t.innerHTML = `<img src="${src}" alt="Работа VelvetChoco">`;
    gallery.appendChild(t);
  });
}

// Scroll reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      revealObserver.unobserve(e.target);
    }
  });
},{ threshold:.12 });

$$('.reveal, .product, .gallery .tile').forEach(el => revealObserver.observe(el));

// Modal logic
function openModal(id){
  const m = $(id);
  if(!m) return;
  m.setAttribute('aria-hidden','false');
}
function closeModal(m){
  m.setAttribute('aria-hidden','true');
}

$$('[data-open-modal]').forEach(btn => btn.addEventListener('click', () => {
  openModal(btn.getAttribute('data-open-modal'));
}));

$$('[data-close-modal]').forEach(el => el.addEventListener('click', () => {
  const m = el.closest('.modal');
  if (m) closeModal(m);
}));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') $$('.modal[aria-hidden="false"]').forEach(closeModal);
});

// Simple forms fake submit
function handleForm(form, noteSel){
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const note = noteSel ? (typeof noteSel === 'string' ? $(noteSel) : noteSel) : $('.form__note', form);
    if (note) {
      note.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
    }
    form.reset();
  });
}
handleForm($('#orderForm'));
handleForm($('#tasteForm'), $('#tasteNote'));

// Footer year
const y = $('#year'); if (y) y.textContent = new Date().getFullYear();


