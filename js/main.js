// ============================================
// GOLDEN THREAD (Curved SVG that reveals on scroll)
// ============================================
function initGoldenThread() {
  const svg = document.getElementById('threadSvg');
  const basePath = svg?.querySelector('.thread-base');
  const glowPath = svg?.querySelector('.thread-glow');
  const sparklesGroup = svg?.getElementById('threadSparkles');
  if (!svg || !basePath || !glowPath || !sparklesGroup) return;

  let pathLength = 0;
  let sparkles = [];

  function generatePath() {
    const w = window.innerWidth;
    const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const points = [];
    const segments = 12;
    const stepY = h / segments;

    for (let i = 0; i <= segments; i++) {
      const y = i * stepY;
      const phase = (i * 0.8 + 0.3);
      const x = w * 0.5 + Math.sin(phase) * w * 0.35 + Math.sin(phase * 2.1) * w * 0.08;
      points.push({ x, y });
    }

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpY1 = prev.y + (curr.y - prev.y) * 0.33;
      const cpY2 = prev.y + (curr.y - prev.y) * 0.66;
      d += ` C ${prev.x} ${cpY1}, ${curr.x} ${cpY2}, ${curr.x} ${curr.y}`;
    }

    basePath.setAttribute('d', d);
    glowPath.setAttribute('d', d);
    pathLength = basePath.getTotalLength();

    basePath.style.strokeDasharray = pathLength;
    basePath.style.strokeDashoffset = pathLength;
    glowPath.style.strokeDasharray = pathLength;
    glowPath.style.strokeDashoffset = pathLength;

    // Generate sparkle dots
    sparkles = [];
    const sparkCount = 40;
    for (let i = 0; i < sparkCount; i++) {
      const distance = (i / sparkCount) * pathLength;
      const pt = basePath.getPointAtLength(distance);
      sparkles.push({
        x: pt.x + (Math.random() - 0.5) * 60,
        y: pt.y + (Math.random() - 0.5) * 40,
        size: 1.5 + Math.random() * 2.5,
        delay: Math.random() * 2,
        distance: distance
      });
    }
  }

  function updateThread() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = Math.max(0, window.scrollY);
    const percent = docHeight > 0 ? Math.min(scrolled / docHeight, 1) : 0;
    const revealLen = percent * pathLength;

    basePath.style.strokeDashoffset = pathLength - revealLen;
    glowPath.style.strokeDashoffset = pathLength - revealLen;

    // Sparkles only near the revealed tip
    sparklesGroup.innerHTML = '';
    const sparkRange = 120;
    sparkles.forEach(s => {
      if (s.distance <= revealLen && s.distance >= revealLen - sparkRange) {
        const alive = (revealLen - s.distance) / sparkRange;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', s.x);
        circle.setAttribute('cy', s.y);
        circle.setAttribute('r', s.size * alive);
        circle.setAttribute('fill', '#D4AF37');
        circle.setAttribute('opacity', alive * 0.9);
        circle.style.animation = `sparkle-fade ${1 + s.delay}s ease-in-out infinite`;
        circle.style.animationDelay = `${s.delay}s`;
        sparklesGroup.appendChild(circle);
      }
    });
  }

  generatePath();
  updateThread();

  window.addEventListener('scroll', updateThread, { passive: true });
  window.addEventListener('resize', () => { generatePath(); updateThread(); });
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

document.querySelectorAll('.reveal, .reveal-slide-left, .reveal-slide-right, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

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

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

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
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  const form = document.getElementById('loginForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    localStorage.setItem('rrk_member', '1');
    closeModal();
    window.open('https://chat.whatsapp.com/YOUR_COMMUNITY_LINK', '_blank');
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

// ============================================
// INIT EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  initTestimonials();
  initElegantCursor();
  initLoader();
  initGoldenThread();
});
