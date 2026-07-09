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
  if (!localStorage.getItem('rrk_member') && !localStorage.getItem('rrk_modal_shown')) {
    setTimeout(function() {
      if (localStorage.getItem('rrk_member')) return;
      openModal();
      localStorage.setItem('rrk_modal_shown', '1');
    }, 5000);
  }
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
  var cart = getCart();
  var item = cart.find(function(i) { return i.name === name; });
  if (item) item.qty++;
  else cart.push({ name: name, price: price, qty: 1 });
  saveCart(cart);
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
function removeItem(name) { saveCart(getCart().filter(i => i.name !== name)); }
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
  var upsell = document.getElementById('upsell');
  if (upsell && cartTotal() > 1000 && !sessionStorage.getItem('upsell_seen')) {
    upsell.classList.add('open');
    sessionStorage.setItem('upsell_seen', '1');
  }
}
function openCart() { var d = document.getElementById('cartDrawer'); if (d) d.classList.add('open'); }
function closeCart() { var d = document.getElementById('cartDrawer'); if (d) d.classList.remove('open'); }
function closeUpsell() { var u = document.getElementById('upsell'); if (u) u.classList.remove('open'); }

// ============================================
// ORDER MODE & CHECKOUT
// ============================================
var currentOrderMode = 'Takeaway';

function setOrderMode(mode, el) {
  currentOrderMode = mode;
  document.querySelectorAll('.cart-mode-btn').forEach(function(b) { b.classList.remove('active'); });
  if (el) el.classList.add('active');
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

  // Track for admin
  try {
    var orders = JSON.parse(localStorage.getItem('rrk_orders') || '[]');
    orders.push({ items: cart.map(function(i) { return i.qty + 'x ' + i.name; }).join(', '), total: cartTotal(), mode: mode, phone: phone, address: address, created_at: new Date().toISOString() });
    localStorage.setItem('rrk_orders', JSON.stringify(orders));
  } catch(ex) {}

  saveCart([]);
  incrementOrderCount();
  sendPush('Order Confirmed! \uD83C\uDF89', 'Your order of ₹' + cartTotal() + ' has been placed. We\'ll prepare it shortly.');
  if (typeof initSocialProof === 'function') initSocialProof();

  closeOrderModal();
  window.open('https://wa.me/919999999999?text=' + encodeURIComponent(msg), '_blank');
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
  if (localStorage.getItem('rrk_dark') === '1') {
    document.body.classList.add('dark-mode');
  }
  var navRight = document.querySelector('.nav__right');
  if (!navRight) return;
  var toggle = document.createElement('button');
  toggle.className = 'dark-toggle';
  toggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  toggle.title = 'Toggle dark mode';
  toggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    var isDark = document.body.classList.contains('dark-mode');
    toggle.innerHTML = isDark ? '☀️' : '🌙';
    localStorage.setItem('rrk_dark', isDark ? '1' : '0');
  });
  navRight.insertBefore(toggle, navRight.firstChild);
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
const DELIVERY_RADIUS_KM = 10.5;

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
  Notification.requestPermission().then(function(p) {
    if (p === 'granted') {
      PUSH_ENABLED = true;
      showToast('🔔 Notifications enabled!');
    }
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
  window.open('https://wa.me/919999999999?text=' + encodeURIComponent('*Raw Chicken Order*\n\n' + item + '\n\nHi, I want to order this. Please share details.'), '_blank');
}

// Init non-render-dependent things on ready
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  initElegantCursor();
  initDarkMode();
  initShareButton();
  initPushNotifications();
  observeRevealElements();
});
