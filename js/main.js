// ============================================
// VIBRATION & SOUND FX (browser audio API, zero files)
// ============================================
var audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  return audioCtx;
}
// Browser blocks audio until first user gesture — warm it up eagerly
(function initAudioUnlock() {
  var unlocked = false;
  function unlock() {
    if (unlocked) return;
    var ctx = getAudioCtx();
    if (!ctx) return;
    unlocked = true;
    if (ctx.state === 'suspended') {
      ctx.resume().then(function() { console.log('Audio unlocked'); });
    }
    // Play a silent buffer to fully prime the pipeline
    var buf = ctx.createBuffer(1,1,22050);
    var src = ctx.createBufferSource(); src.buffer = buf;
    src.connect(ctx.destination); src.start(0);
  }
  document.addEventListener('click', unlock, {once: true});
  document.addEventListener('touchstart', unlock, {once: true});
  document.addEventListener('keydown', unlock, {once: true});
})();
function tapVibe(dur) {
  try { if (navigator.vibrate) navigator.vibrate(dur || 15); } catch(e) {}
}
function softClick() {
  try { if (navigator.vibrate) navigator.vibrate(10); } catch(e) {}
}
function heavyVibe() {
  try { if (navigator.vibrate) navigator.vibrate([20,40,20]); } catch(e) {}
}
/** Play a short synthesized tone using the Web Audio API.
 *  type: 'click' | 'add' | 'remove' | 'confirm' | 'open' | 'close' | 'error'
 *  All tones are very short (< 150ms) and low CPU. No audio files needed. */
function playHaptic(type) {
  tapVibe();
  try {
    var ctx = getAudioCtx(); if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    var now = ctx.currentTime;
    switch (type) {
      case 'click':   // quick tick
        o.type = 'sine'; o.frequency.setValueAtTime(800, now);
        o.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
        g.gain.setValueAtTime(0.25, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        o.start(now); o.stop(now + 0.07);
        break;
      case 'add':     // rising pop (add to cart)
        o.type = 'sine'; o.frequency.setValueAtTime(500, now);
        o.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
        g.gain.setValueAtTime(0.30, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
        o.start(now); o.stop(now + 0.10);
        break;
      case 'remove':  // falling tone
        o.type = 'triangle'; o.frequency.setValueAtTime(900, now);
        o.frequency.exponentialRampToValueAtTime(350, now + 0.10);
        g.gain.setValueAtTime(0.22, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        o.start(now); o.stop(now + 0.12);
        break;
      case 'confirm': // pleasant two-tone success
        o.type = 'sine';
        o.frequency.setValueAtTime(587, now); o.frequency.setValueAtTime(740, now + 0.08);
        o.frequency.setValueAtTime(880, now + 0.16);
        g.gain.setValueAtTime(0.28, now); g.gain.setValueAtTime(0.28, now + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        o.start(now); o.stop(now + 0.28);
        break;
      case 'open':    // warm swoosh
        o.type = 'sine'; o.frequency.setValueAtTime(350, now);
        o.frequency.exponentialRampToValueAtTime(900, now + 0.12);
        g.gain.setValueAtTime(0.18, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        o.start(now); o.stop(now + 0.15);
        break;
      case 'close':   // quick mute
        o.type = 'sine'; o.frequency.setValueAtTime(600, now);
        o.frequency.exponentialRampToValueAtTime(250, now + 0.06);
        g.gain.setValueAtTime(0.20, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        o.start(now); o.stop(now + 0.08);
        break;
      case 'error':   // low buzz
        o.type = 'square'; o.frequency.setValueAtTime(180, now);
        g.gain.setValueAtTime(0.14, now); g.gain.setValueAtTime(0.14, now + 0.10);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        o.start(now); o.stop(now + 0.15);
        break;
    }
  } catch(e) { /* no audio available */ }
}
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
  document.querySelectorAll('.reveal, .reveal-slide-left, .reveal-slide-right, .reveal-scale, .cascade-left, .cascade-right, .special-zoom').forEach(el => {
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
  if (!localStorage.getItem('rrk_member')) {
    setTimeout(function() {
      if (localStorage.getItem('rrk_member')) return;
      openModal();
    }, 5000);
  }
  // Use event delegation so close buttons work even after dynamic render
  modal.addEventListener('click', function(e) {
    if (e.target.closest('[data-close]')) closeModal();
  });
  modal.addEventListener('submit', function(e) {
    if (e.target.id === 'loginForm' || e.target.closest('#loginForm')) {
      e.preventDefault();
      var fm = e.target.id === 'loginForm' ? e.target : e.target.closest('#loginForm');
      if (!fm) return;
      var name = fm.querySelector('input[type="text"]').value;
      var phone = fm.querySelector('input[type="tel"]').value;
      var dob = fm.querySelector('input[type="date"]').value;
      try {
        var customers = JSON.parse(localStorage.getItem('rrk_customers') || '[]');
        customers.push({ name: name, phone: phone, dob: dob, created_at: new Date().toISOString() });
        localStorage.setItem('rrk_customers', JSON.stringify(customers));
      } catch(ex) {}
      // Also save to Firestore so admin can see registered customers
      if (typeof rrkCustomers !== 'undefined' && rrkCustomers.register) {
        rrkCustomers.register({ name: name, phone: phone, dob: dob }).then(function() {
          console.log('Customer saved to Firestore:', name, phone);
        }).catch(function(err) {
          console.warn('Customer Firestore save failed:', err);
        });
      }
      localStorage.setItem('rrk_member', '1');
      closeModal();
      window.open('https://chat.whatsapp.com/YOUR_COMMUNITY_LINK', '_blank');
    }
  });
}

// ============================================
// CART LOGIC
// ============================================
var CART_PAGE = (function() {
  if (typeof pageType !== 'undefined') return pageType;
  // Detect from URL path
  var path = window.location.pathname;
  if (path.indexOf('raw-chicken') !== -1) return 'raw';
  return 'food';
})();
const CART_KEY = 'rrk_cart_' + CART_PAGE;
function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); renderCart(); }
function addToCart(name, price) {
  var cart = getCart();
  var item = cart.find(function(i) { return i.name === name; });
  if (item) item.qty++;
  else cart.push({ name: name, price: price, qty: 1 });
  saveCart(cart);
  playHaptic('add');
  showToast('Added to cart · ' + cart.reduce(function(s, i) { return s + i.qty; }, 0) + ' items');
}
function changeQty(name, delta) {
  let cart = getCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  saveCart(cart);
}
function removeItem(name) { saveCart(getCart().filter(i => i.name !== name)); playHaptic('remove'); }
function cartTotal() { return getCart().reduce((s, i) => s + i.price * i.qty, 0); }
function renderCart() {
  var wrap = document.getElementById('cartItems');
  var totalEl = document.getElementById('cartTotal');
  var countEl = document.getElementById('cartCount');
  var cart = getCart();
  var count = cart.reduce(function(s, i) { return s + i.qty; }, 0);
  if (countEl) countEl.textContent = count;

  // Show/hide cart FAB
  var fab = document.querySelector('.cart-fab');
  if (fab) fab.style.display = count > 0 ? 'flex' : 'none';

  // Update sticky cart bar
  var bar = document.getElementById('cartBar');
  if (bar) {
    if (count > 0) {
      bar.classList.add('open');
      var barCount = bar.querySelector('.cart-bar__count');
      var barTotal = bar.querySelector('.cart-bar__total');
      if (barCount) barCount.textContent = count;
      if (barTotal) barTotal.textContent = '\u20B9' + cartTotal();
    } else {
      bar.classList.remove('open');
    }
  }

  if (!wrap) return;
  if (cart.length === 0) {
    wrap.innerHTML = '<div class="cart-empty"><div class="cart-empty__ic">&#x1f6cd;&#xfe0f;</div><p>Your plate is empty</p><span>Add something delicious!</span></div>';
  } else {
    wrap.innerHTML = cart.map(function(i) { return '<div class="cart-row"><div><b>' + i.name + '</b><span>&#8377;' + i.price + '</span></div><div class="qty"><button onclick="changeQty(\'' + i.name + '\',-1)" aria-label="Decrease quantity">&#8722;</button><span>' + i.qty + '</span><button onclick="changeQty(\'' + i.name + '\',1)" aria-label="Increase quantity">+</button><button class="del" onclick="removeItem(\'' + i.name + '\')" aria-label="Remove item">&#x1f5d1;&#xfe0f;</button></div></div>'; }).join('');
  }
  if (totalEl) totalEl.textContent = '\u20B9' + cartTotal();
  document.querySelectorAll('.cart-mode-btn').forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-mode') === currentOrderMode); });
  var upsell = document.getElementById('upsell');
  if (upsell && cartTotal() > 1000 && !sessionStorage.getItem('upsell_seen')) {
    upsell.classList.add('open');
    sessionStorage.setItem('upsell_seen', '1');
  }
}
function openCart() { var d = document.getElementById('cartDrawer'); if (d) { d.classList.add('open'); playHaptic('open'); } }
function closeCart() { var d = document.getElementById('cartDrawer'); if (d) { d.classList.remove('open'); playHaptic('close'); } }
function closeUpsell() { var u = document.getElementById('upsell'); if (u) { u.classList.remove('open'); playHaptic('close'); } }

// ============================================
// ORDER MODE & CHECKOUT
// ============================================
var currentOrderMode = localStorage.getItem('rrk_order_mode') || 'Takeaway';

function setOrderMode(mode, el) {
  currentOrderMode = mode;
  try { localStorage.setItem('rrk_order_mode', mode); } catch(e){}
  document.querySelectorAll('.cart-mode-btn').forEach(function(b) { b.classList.remove('active'); });
  if (el) el.classList.add('active');
  document.querySelectorAll('.cart-mode-btn[data-mode="' + mode + '"]').forEach(function(b) { b.classList.add('active'); });
  playHaptic('click');
}

function openCheckout() {
  var cart = getCart();
  if (cart.length === 0) return;
  var modal = document.getElementById('orderModal');
  if (!modal) return;
  document.getElementById('orderModalTitle').textContent = currentOrderMode === 'Delivery' ? 'Delivery Order' : 'Takeaway Order';
  var sub = document.getElementById('orderModalSub');
  sub.textContent = cart.reduce(function(s, i) { return s + i.qty; }, 0) + ' items · \u20B9' + cartTotal();
  var addrGroup = document.getElementById('orderAddressGroup');
  var addrInput = document.getElementById('orderAddress');
  if (currentOrderMode === 'Delivery') {
    addrGroup.style.display = 'block';
    addrInput.setAttribute('required', '');
  } else {
    addrGroup.style.display = 'none';
    addrInput.removeAttribute('required');
    addrInput.value = '';
  }
  modal.classList.add('open');
}

function closeOrderModal() {
  var modal = document.getElementById('orderModal');
  if (modal) modal.classList.remove('open');
}

var currentLocation = null;

function useCurrentLocation() {
  playHaptic('click');
  if (!navigator.geolocation) {
    document.getElementById('orderAddress').value = 'Location not supported';
    return;
  }
  var addrInput = document.getElementById('orderAddress');
  addrInput.value = 'Getting location...';
  addrInput.style.color = 'var(--muted)';
  navigator.geolocation.getCurrentPosition(function(pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    currentLocation = { lat: lat, lng: lng };
    addrInput.value = 'https://maps.google.com/?q=' + lat + ',' + lng;
    addrInput.style.color = '';
  }, function() {
    addrInput.value = 'Could not get location. Type manually.';
    addrInput.style.color = '';
    currentLocation = null;
  });
}

function placeOrder(e) {
  e.preventDefault();
  var cart = getCart();
  if (cart.length === 0) return;

  var phone = document.getElementById('orderPhone').value.trim();
  var address = document.getElementById('orderAddress').value.trim();
  var mode = currentOrderMode;

  var msg = '*New RRK Food Court Order*\n(' + mode + ')\n\n';
  cart.forEach(function(i) { msg += i.qty + ' x ' + i.name + ' - \u20B9' + (i.price * i.qty) + '\n'; });
  msg += '\n*Total: \u20B9' + cartTotal() + '*';
  msg += '\n\n*Phone:* ' + phone;
  if (mode === 'Delivery') {
    if (currentLocation) {
      msg += '\n*Maps:* https://maps.google.com/?q=' + currentLocation.lat + ',' + currentLocation.lng;
    }
    if (address) {
      msg += '\n*Address:* ' + address;
    }
  }

  // Track for admin (localStorage + Firestore)
  var orderData = {
    type: CART_PAGE === 'raw' ? 'raw' : 'online',
    status: 'pending',
    items: cart.map(function(i) { return i.qty + 'x ' + i.name; }).join(', '),
    total: cartTotal(),
    mode: mode,
    phone: phone,
    address: address,
    created_at: new Date().toISOString()
  };
  try {
    var orders = JSON.parse(localStorage.getItem('rrk_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('rrk_orders', JSON.stringify(orders));
  } catch(ex) {}

  if (typeof rrkOrders !== 'undefined' && rrkOrders.save) {
    rrkOrders.save(orderData).then(function() {
      console.log('Order saved to Firestore:', orderData.type, '₹' + orderData.total);
    }).catch(function(e) { console.warn('Order save failed', e); });
  }

  saveCart([]);
  incrementOrderCount();
  sendPush('Order Confirmed! \uD83C\uDF89', 'Your order of ₹' + cartTotal() + ' has been placed. We\'ll prepare it shortly.');
  if (typeof initSocialProof === 'function') initSocialProof();

  closeOrderModal();
  tapVibe();
  window.open('https://wa.me/' + (window.RRK_CONFIG ? window.RRK_CONFIG.whatsapp : '919999999999') + '?text=' + encodeURIComponent(msg), '_blank');
}

function checkout() {
  closeCart(); openCheckout();
}

// ============================================
// MENU SEARCH
// ============================================
function searchMenu(query) {
  var q = query.toLowerCase().trim();
  document.querySelectorAll('.menu-row').forEach(function(row) {
    if (!q) { row.style.display = ''; return; }
    var search = row.dataset.search || '';
    row.style.display = search.indexOf(q) !== -1 ? '' : 'none';
  });
  if (q) {
    document.querySelectorAll('.cat').forEach(function(c) { c.classList.remove('active'); });
  } else {
    var allCat = document.querySelector('.cat');
    if (allCat) allCat.classList.add('active');
  }
}

// ============================================
// MENU CATEGORY FILTER
// ============================================
function filterCat(cat, el) {
  playHaptic('click');
  document.querySelectorAll('.cat').forEach(function(c) { c.classList.remove('active'); });
  if (el) el.classList.add('active');
  var searchInput = document.querySelector('.menu-search__input');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.menu-row').forEach(function(row) {
    row.style.display = (cat === 'all' || row.dataset.cat === cat) ? '' : 'none';
  });
}

// ============================================
// LOYALTY POINTS SYSTEM
// ============================================
const LOYALTY_KEY = 'rrk_loyalty';
function getLoyaltyPoints() { return parseInt(localStorage.getItem(LOYALTY_KEY) || '0'); }
function addLoyaltyPoints(pts) {
  const current = getLoyaltyPoints();
  const newTotal = current + pts;
  localStorage.setItem(LOYALTY_KEY, newTotal);
  updateLoyaltyBadge();
  showToast('+' + pts + ' loyalty points earned! 🎉');
}
function redeemLoyaltyPoints(pts) {
  const current = getLoyaltyPoints();
  if (current >= pts) {
    localStorage.setItem(LOYALTY_KEY, current - pts);
    updateLoyaltyBadge();
    return pts;
  }
  return 0;
}
function updateLoyaltyBadge() {
  const badge = document.getElementById('loyaltyBadge');
  const pts = getLoyaltyPoints();
  if (!badge) {
    const b = document.createElement('div');
    b.id = 'loyaltyBadge';
    b.className = 'loyalty-badge';
    document.body.appendChild(b);
  }
  const b = document.getElementById('loyaltyBadge');
  if (b) b.innerHTML = '🏆 <span class="pts">' + pts + ' pts</span>';
}
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'loyalty-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 3000);
}

// ============================================
// DARK MODE TOGGLE
// ============================================
function initDarkMode() {
  var saved = localStorage.getItem('rrk_dark');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // User explicitly chose: respect that. Otherwise, follow system preference.
  if (saved === '1' || (saved === null && prefersDark)) {
    document.body.classList.add('dark-mode');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.style.colorScheme = 'light';
  }

  var navRight = document.querySelector('.nav__right');
  if (!navRight) return;
  var toggle = document.createElement('button');
  toggle.className = 'dark-toggle';
  toggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  toggle.title = 'Toggle dark mode';
  toggle.addEventListener('click', function() {
    var isDark = document.body.classList.toggle('dark-mode');
    toggle.innerHTML = isDark ? '☀️' : '🌙';
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem('rrk_dark', isDark ? '1' : '0');
    playHaptic('click');
  });
  navRight.insertBefore(toggle, navRight.firstChild);

  // Listen for system preference changes (e.g. auto dark mode at sunset on iOS)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (localStorage.getItem('rrk_dark') === null) {
      if (e.matches) {
        document.body.classList.add('dark-mode');
        document.documentElement.style.colorScheme = 'dark';
        toggle.innerHTML = '☀️';
      } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.style.colorScheme = 'light';
        toggle.innerHTML = '🌙';
      }
    }
  });
}

// ============================================
// SHARE BUTTON
// ============================================
function initShareButton() {
  if (!navigator.share) return;
  const btn = document.createElement('button');
  btn.className = 'share-btn';
  btn.innerHTML = '🔗';
  btn.title = 'Share';
  btn.addEventListener('click', function() {
    navigator.share({
      title: 'RRK Food Court - Premium Restaurant in Eluru',
      text: 'Check out RRK Food Court! Fresh, hygienic, and delicious.',
      url: window.location.origin
    }).catch(function() {});
  });
  document.body.appendChild(btn);
}

// ============================================
// DELIVERY RADIUS CHECK (10km from Eluru)
// ============================================
const RESTAURANT_LAT = 16.7106762;
const RESTAURANT_LNG = 81.1007719;
const DELIVERY_RADIUS_KM = 10;

function initDeliveryCheck() {
  const container = document.getElementById('deliveryCheck');
  if (!container) return;
  container.innerHTML = '<p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 8px;">📍 Delivery within 10 km of Eluru</p><button class="btn btn--primary btn--block" onclick="checkDelivery()">📍 Check My Location</button><div id="deliveryResult" style="margin-top: 12px;"></div>';
}

function checkDelivery() {
  const resultDiv = document.getElementById('deliveryResult');
  if (!navigator.geolocation) {
    resultDiv.innerHTML = '<div class="delivery-result out-zone">⚠️ Geolocation not supported by your browser.</div>';
    return;
  }
  resultDiv.innerHTML = '<div class="delivery-result">📍 Detecting your location...</div>';
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;
      const dist = getDistanceKm(RESTAURANT_LAT, RESTAURANT_LNG, userLat, userLng);
      if (dist <= DELIVERY_RADIUS_KM) {
        resultDiv.innerHTML = '<div class="delivery-result in-zone">✅ We deliver to your area! (~' + dist.toFixed(1) + ' km)</div>';
        showToast('🎉 Great news! We deliver to your location.');
      } else {
        resultDiv.innerHTML = '<div class="delivery-result out-zone">❌ Sorry, you\'re ' + dist.toFixed(1) + ' km away. Our delivery radius is ' + DELIVERY_RADIUS_KM + ' km.</div>';
      }
    },
    function(err) {
      resultDiv.innerHTML = '<div class="delivery-result out-zone">⚠️ Could not access your location. Please enable location services.</div>';
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ============================================
// SOCIAL PROOF COUNTER
// ============================================
function initSocialProof() {
  var stored = parseInt(localStorage.getItem('rrk_order_count') || '0');
  var now = new Date();
  var today = now.toDateString();
  var lastDay = localStorage.getItem('rrk_last_order_day');
  if (lastDay !== today) {
    localStorage.setItem('rrk_order_count', '0');
    stored = 0;
  }
  var displayCount = 15 + stored + Math.floor(Math.random() * 5);
  var el = document.getElementById('socialProof');
  if (!el) return;
  el.innerHTML = '<span class="sp-dot"></span> <span class="sp-count">' + displayCount + '</span> customers ordered today!';
}

// Update order count
function incrementOrderCount() {
  var count = parseInt(localStorage.getItem('rrk_order_count') || '0') + 1;
  localStorage.setItem('rrk_order_count', count);
  localStorage.setItem('rrk_last_order_day', new Date().toDateString());
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================
var PUSH_ENABLED = false;
function initPushNotifications() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') PUSH_ENABLED = true;
}

function requestPushPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') { PUSH_ENABLED = true; return; }
  if (Notification.permission === 'denied') return;
  Notification.requestPermission().then(function(p) {
    if (p === 'granted') { PUSH_ENABLED = true; }
  });
}

function sendPush(title, body) {
  if (!PUSH_ENABLED || Notification.permission !== 'granted') return;
  new Notification(title, {
    body: body,
    icon: 'https://via.placeholder.com/192x192.png?text=RRK'
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
// RAW CHICKEN ITEMS
// ============================================
function searchRawItems(query) {
  var q = query.toLowerCase().trim();
  document.querySelectorAll('.menu-row[data-raw-search]').forEach(function(row) {
    if (!q) { row.style.display = ''; return; }
    var search = row.dataset.rawSearch || '';
    row.style.display = search.indexOf(q) !== -1 ? '' : 'none';
  });
}
function orderRawItem(item) {
  var wa = (window.RRK_CONFIG && window.RRK_CONFIG.whatsapp) ? window.RRK_CONFIG.whatsapp : '919999999999';
  window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent('*Raw Chicken Order*\n\n' + item + '\n\nHi, I want to order this. Please share details.'), '_blank');
}

// Init non-render-dependent things on ready
document.addEventListener('DOMContentLoaded', function() {
  renderCart();
  initElegantCursor();
  initDarkMode();
  initShareButton();
  initPushNotifications();
  initLoader();
  observeRevealElements();
  if (typeof initFirebase === 'function') {
    initFirebase().catch(function() {});
  }
  if (typeof loadRRKConfig === 'function') {
    loadRRKConfig();
  }
});

// Update all WA links after config loads
setTimeout(function() {
  if (RRK_CONFIG && RRK_CONFIG.whatsapp) {
    document.querySelectorAll('.wa-link').forEach(function(el) {
      el.href = 'https://wa.me/' + RRK_CONFIG.whatsapp;
    });
  }
}, 1500);
