// ============================================
// MAGNETIC TILT ON FOOD CARDS + WHY CARDS
// ============================================
function initMagneticTilt() {
  const cards = document.querySelectorAll('.food-card, .why-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

function observeRevealElements() {
  document.querySelectorAll('.reveal, .reveal-slide-left, .reveal-slide-right, .reveal-scale, .cascade-left, .cascade-right').forEach(el => {
    revealObserver.observe(el);
  });
}
// Run immediately for any elements already in DOM
observeRevealElements();

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounter(el, target, suffix, duration) {
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = suffix ? current + suffix : current;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = parseInt(el.dataset.duration) || 1800;
      animateCounter(el, target, suffix, duration);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

function initCounterObserver() {
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
}

// ============================================
// MOBILE NAV
// ============================================
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger) burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
});

// ============================================
// SHRINKING NAVBAR ON SCROLL
// ============================================
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('shrunk');
    } else {
      nav.classList.remove('shrunk');
    }
  });
}

// ============================================
// PARALLAX HERO
// ============================================
const heroMedia = document.querySelector('.hero__media');
const heroGlow = document.querySelector('.hero__glow');
if (heroMedia && heroGlow) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < 800) {
      heroMedia.style.transform = `translateY(${scrollY * 0.15}px)`;
      heroGlow.style.transform = `translateY(${scrollY * 0.25}px) translateX(${scrollY * -0.1}px)`;
    }
  });
}

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================
function initTestimonials() {
  const track = document.querySelector('.testimonial-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dots button');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  if (!track || cards.length === 0) return;

  let current = 0;
  let autoPlay;

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() {
    goTo((current + 1) % cards.length);
  }

  function prev() {
    goTo((current - 1 + cards.length) % cards.length);
  }

  function startAuto() {
    stopAuto();
    autoPlay = setInterval(next, 4000);
  }

  function stopAuto() {
    clearInterval(autoPlay);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  dots.forEach((d, i) => {
    d.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    startAuto();
  });

  goTo(0);
  startAuto();
}

// ============================================
// ELEGANT CURSOR
// ============================================
function initElegantCursor() {
  if (window.innerWidth <= 1199) return;
  
  const cursor = document.createElement('div');
  cursor.classList.add('elegant-cursor');
  cursor.innerHTML = '<div class="cursor-inner"></div><div class="cursor-ring"></div>';
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const hoverTargets = document.querySelectorAll('a, button, .food-card, .why-card, .chip, .cat, .ig-card, .btn, .wa-fab, .cart-fab, .modal__x, .mini-chip');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  function animate() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

// ============================================
// LOADING SCREEN
// ============================================
function initLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 600);
  });
}

// ============================================
// LOGIN MODAL (after 5s, first visit)
// ============================================
const modal = document.getElementById('loginModal');
function openModal() { if (modal) modal.classList.add('open'); }
function closeModal() { if (modal) modal.classList.remove('open'); }
if (modal) {
  if (!localStorage.getItem('rrk_member')) setTimeout(openModal, 5000);
  // Use event delegation so close buttons work even after dynamic render
  modal.addEventListener('click', function(e) {
    if (e.target.closest('[data-close]')) closeModal();
  });
  modal.addEventListener('submit', function(e) {
    if (e.target.id === 'loginForm') {
      e.preventDefault();
      const form = document.getElementById('loginForm');
      if (!form) return;
      const name = form.querySelector('input[type="text"]').value;
      const phone = form.querySelector('input[type="tel"]').value;
      const dob = form.querySelector('input[type="date"]').value;
      try {
        const customers = JSON.parse(localStorage.getItem('rrk_customers') || '[]');
        customers.push({ name: name, phone: phone, dob: dob, created_at: new Date().toISOString() });
        localStorage.setItem('rrk_customers', JSON.stringify(customers));
      } catch(e) {}
      localStorage.setItem('rrk_member', '1');
      closeModal();
      window.open('https://chat.whatsapp.com/YOUR_COMMUNITY_LINK', '_blank');
    }
  });
}

// ============================================
// CART LOGIC
// ============================================
const CART_KEY = 'rrk_cart';
function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); renderCart(); }
function addToCart(name, price) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });
  saveCart(cart);
  openCart();
}
function changeQty(name, delta) {
  let cart = getCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  saveCart(cart);
}
function removeItem(name) { saveCart(getCart().filter(i => i.name !== name)); }
function cartTotal() { return getCart().reduce((s, i) => s + i.price * i.qty, 0); }
function renderCart() {
  const wrap = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartCount');
  if (!wrap) return;
  const cart = getCart();
  if (countEl) countEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
  if (cart.length === 0) {
    wrap.innerHTML = '<div class="cart-empty"><div class="cart-empty__ic">&#x1f6cd;&#xfe0f;</div><p>Your plate is empty</p><span>Add something delicious!</span></div>';
  } else {
    wrap.innerHTML = cart.map(i => `<div class="cart-row"><div><b>${i.name}</b><span>&#8377;${i.price}</span></div><div class="qty"><button onclick="changeQty('${i.name}',-1)" aria-label="Decrease quantity">&#8722;</button><span>${i.qty}</span><button onclick="changeQty('${i.name}',1)" aria-label="Increase quantity">+</button><button class="del" onclick="removeItem('${i.name}')" aria-label="Remove item">&#x1f5d1;&#xfe0f;</button></div></div>`).join('');
  }
  if (totalEl) totalEl.textContent = '\u20B9' + cartTotal();
  const upsell = document.getElementById('upsell');
  if (upsell && cartTotal() > 1000 && !sessionStorage.getItem('upsell_seen')) {
    upsell.classList.add('open');
    sessionStorage.setItem('upsell_seen', '1');
  }
}
function openCart() { const d = document.getElementById('cartDrawer'); if (d) d.classList.add('open'); }
function closeCart() { const d = document.getElementById('cartDrawer'); if (d) d.classList.remove('open'); }
function closeUpsell() { const u = document.getElementById('upsell'); if (u) u.classList.remove('open'); }
function checkout() {
  const cart = getCart();
  if (cart.length === 0) return alert('Your cart is empty');
  const mode = document.querySelector('input[name="mode"]:checked');
  const type = mode ? mode.value : 'Takeaway';
  let msg = `*New RRK Chicken Order*%0A(${type})%0A%0A`;
  cart.forEach(i => { msg += `${i.qty} x ${i.name} - \u20B9${i.price * i.qty}%0A`; });
  msg += `%0A*Total: \u20B9${cartTotal()}*`;

  // Track order for admin dashboard
  try {
    const orders = JSON.parse(localStorage.getItem('rrk_orders') || '[]');
    orders.push({ items: cart.map(i => i.qty+'x '+i.name).join(', '), total: cartTotal(), mode: type, created_at: new Date().toISOString() });
    localStorage.setItem('rrk_orders', JSON.stringify(orders));
  } catch(e) {}
  saveCart([]);

  window.open(`https://wa.me/919999999999?text=${msg}`, '_blank');
}

// ============================================
// MENU CATEGORY FILTER
// ============================================
function filterCat(cat, el) {
  document.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('[data-cat]').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
  });
}

// ============================================
// CRAFT MY PLATE CHIPS + SUMMARY
// ============================================
function pickChip(el, group) {
  document.querySelectorAll(`.chip[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// Init non-render-dependent things on ready
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  initElegantCursor();
  observeRevealElements();
});
