// ============================================
// RRK SITE RENDERER — Hybrid (Defaults + Firebase)
// ============================================

const RRK_DEFAULTS = {
  whatsapp: '919999999999',
  brand: { name: 'RRK Chicken', tagline: 'Premium chicken restaurant in Eluru.' },
  pageMeta: {
    menu: { eyebrow: 'Explore', headline: 'Our Menu' },
    craft: { eyebrow: 'AI-Powered', headline: 'Craft My Plate', subhead: 'Tell us the vibe. We build the perfect combo & unlock savings.' },
    raw: { eyebrow: 'Farm Fresh', headline: 'Raw Chicken', subhead: 'Cut fresh every morning · hygienically packed.' }
  },
  hero: { eyebrow: 'Eluru · Andhra Pradesh', headlineL1: 'Premium Chicken,', headlineGold: 'Perfection', lead: 'Fresh, hygienic and irresistibly delicious. Order your favourites or build your own combo with Craft My Plate.', image: '1.jpeg' },
  heroBadge: { main: '20% OFF', sub: 'Today Only' },
  heroStats: [{ count: 4.9, suffix: '★', duration: 2000, label: '2,400+ reviews' },{ count: 30, suffix: ' min', duration: 1500, label: 'Fast delivery' },{ count: 100, suffix: '%', duration: 1600, label: 'Fresh daily' }],
  menu: [
    { id: '1', name: 'Signature Grilled Chicken', category: 'chicken', diet: 'nonveg', description: 'Flame-grilled with house spices.', price: '249', image: '2.jpeg', special: '1', special_tag: '15% OFF' },
    { id: '2', name: 'Hyderabadi Biryani', category: 'biryani', diet: 'nonveg', description: 'Slow-dum with basmati & saffron.', price: '199', image: '3.jpeg', special: '1', special_tag: 'Bestseller' },
    { id: '3', name: 'Crispy Chicken 65', category: 'starters', diet: 'nonveg', description: 'Spicy, crunchy, addictive.', price: '179', image: '4.jpeg', special: '1', special_tag: 'Hot' },
    { id: '4', name: 'Chicken Lollipop', category: 'starters', diet: 'nonveg', description: '6 pcs, tangy glaze.', price: '189', image: '16.jpeg', special: '0' },
    { id: '5', name: 'Chicken Combo Meal', category: 'meals', diet: 'nonveg', description: 'Rice, curry, starter & drink.', price: '279', image: '17.jpeg', special: '0' },
    { id: '6', name: 'Family Feast Pack', category: 'family', diet: 'nonveg', description: 'Serves 4 · biryani + starters.', price: '699', image: '5.jpeg', special: '1', special_tag: 'Combo' },
    { id: '7', name: 'Fresh Lime Soda', category: 'beverages', diet: 'veg', description: 'Chilled & refreshing.', price: '59', image: '18.jpeg', special: '0' },
    { id: '8', name: 'Gulab Jamun (2 pcs)', category: 'desserts', diet: 'veg', description: 'Warm, syrup-soaked.', price: '69', image: '19.jpeg', special: '0' }
  ],
  raw: [
    { id: '1', name: 'Boneless', image: '7.jpeg', price: '320', weight: '1 kg', tag: 'Fresh Today' },
    { id: '2', name: 'Curry Cut', image: '8.jpeg', price: '240', weight: '1 kg', tag: 'Fresh Today' },
    { id: '3', name: 'Whole Chicken', image: '9.jpeg', price: '210', weight: '1.2 – 1.5 kg', tag: 'Fresh Today' },
    { id: '4', name: 'Lollipop', image: '20.jpeg', price: '280', weight: '500 g', tag: 'Fresh Today' },
    { id: '5', name: 'Wings', image: '21.jpeg', price: '260', weight: '500 g', tag: 'Fresh Today' },
    { id: '6', name: 'Leg Piece', image: '22.jpeg', price: '290', weight: '1 kg', tag: 'Fresh Today' },
    { id: '7', name: 'Breast', image: '23.jpeg', price: '330', weight: '1 kg', tag: 'Fresh Today' }
  ],
  combos: [
    { id: '1', name: 'Party Starter Combo', save_badge: 'Save ₹180', description: 'Biryani x2 + Chicken 65 + Lollipop + 4 drinks.', price: '1299' },
    { id: '2', name: 'Family Feast', save_badge: 'Save ₹250', description: 'Family pack + grilled chicken + desserts + drinks.', price: '1599' },
    { id: '3', name: 'Grand Celebration', save_badge: 'Save ₹320', description: 'Serves 10 · biryani, starters, mains & sweets.', price: '2499' }
  ],
  occasions: [{ id: '1', emoji: '🎂', label: 'Birthday' },{ id: '2', emoji: '💼', label: 'Office' },{ id: '3', emoji: '💍', label: 'Wedding' },{ id: '4', emoji: '👪', label: 'Family' },{ id: '5', emoji: '🎊', label: 'Festival' }],
  craftConfig: { peopleMin: 1, peopleMax: 20, peopleDefault: 6, budgetMin: 300, budgetMax: 5000, budgetStep: 100, budgetDefault: 1500 },
  craftPreview: { eyebrow: 'Signature Feature', headline: 'Craft My Plate', desc: 'Tell us your budget, occasion and people count.', buttonText: 'Start Crafting', chips: [{ emoji: '🎂', text: 'Birthday' },{ emoji: '👥', text: '6 People' },{ emoji: '₹', text: '1500 Budget' }], comboText: 'Suggested Combo · <b>Save ₹220</b>' },
  about: { eyebrow: 'Our Story', headlineL1: 'Rooted in flavour,', headlineL2: 'refined for you', body: 'RRK Chicken started in the heart of Eluru with one belief: premium chicken should be fresh, hygienic and honestly priced.', image: '6.jpeg', buttonText: 'Visit Us' },
  whyCards: [{ icon: '🐔', title: 'Fresh Chicken', desc: 'Sourced & cut daily.' },{ icon: '👑', title: 'Premium Quality', desc: 'Only grade-A cuts.' },{ icon: '✨', title: 'Hygienic Kitchen', desc: 'Spotless & safe.' },{ icon: '⚡', title: 'Fast Delivery', desc: 'Hot in 30 mins.' },{ icon: '💰', title: 'Affordable', desc: 'Great value always.' }],
  whySection: { eyebrow: 'Why RRK', headline: 'Why RRK Chicken' },
  testimonials: [
    { id: '1', avatar: '👨', stars: 5, quote: 'Best chicken I\'ve had in Eluru. The Hyderabadi Biryani is out of this world.', author: 'Ravi Kumar', subtitle: 'Regular Customer' },
    { id: '2', avatar: '👩', stars: 5, quote: 'Ordered the Family Feast Pack for a get-together. Everyone loved it.', author: 'Priya Sharma', subtitle: 'Verified Order' },
    { id: '3', avatar: '👨‍🦱', stars: 5, quote: 'Craft My Plate is genius. Saved money and got exactly what I needed.', author: 'Sandeep Reddy', subtitle: 'First-time Customer' },
    { id: '4', avatar: '👩‍🦰', stars: 5, quote: 'Fresh raw chicken in 30 minutes. Clean cuts, proper packaging.', author: 'Lakshmi Devi', subtitle: 'Weekly Regular' }
  ],
  instagram: [
    { id: '1', image: '10.jpeg', caption: 'Grilled to perfection' },{ id: '2', image: '11.jpeg', caption: 'Weekend biryani' },
    { id: '3', image: '12.jpeg', caption: 'Fresh cuts daily' },{ id: '4', image: '13.jpeg', caption: 'Family feast' },
    { id: '5', image: '14.jpeg', caption: 'Tandoori special' },{ id: '6', image: '15.jpeg', caption: 'Curry cuts ready' }
  ],
  contact: { phone: '+91 99999 99999', phoneRaw: '919999999999', whatsapp: '+91 99999 99999', address: 'Main Road, Eluru, AP', hours: '11:00 AM – 11:00 PM', mapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.8001938655!2d81.104!3d16.711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sEluru%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v99999999999' },
  social: { instagram: '#', facebook: '#', youtube: '#' },
  footer: { copyright: '© 2026 RRK Chicken. All rights reserved.' },
  loginModal: { eyebrow: 'Welcome to RRK', headline: 'Join the RRK Family', desc: 'Unlock birthday offers, festival deals & exclusive combos.', benefits: ['🎂 Birthday Offer','🎊 Festival Offers','🔑 Exclusive Deals','💬 WhatsApp Community'], privacy: 'We respect your privacy.', communityLink: 'https://chat.whatsapp.com/YOUR_COMMUNITY_LINK' },
  adminCreds: { user: 'rrk', pass: 'admin1234' }
};

function getStars(n) { return '★'.repeat(parseInt(n) || 5); }

function getSiteData() {
  try { return JSON.parse(localStorage.getItem('rrk_site_data')); } catch(e) { return null; }
}

function setSiteData(d) { localStorage.setItem('rrk_site_data', JSON.stringify(d)); }

function renderForPage(page) {
  // 1. Render IMMEDIATELY from hardcoded defaults
  const D = JSON.parse(JSON.stringify(RRK_DEFAULTS));
  renderWithData(page, D);

  // 2. Dismiss loader
  const loader = document.querySelector('.loader');
  if (loader) loader.classList.add('hidden');

  // 3. Try Firebase in background, re-render if successful
  tryFirebase(page);
}

function tryFirebase(page) {
  if (typeof rrkMenu === 'undefined' || typeof rrkSettings === 'undefined') return;
  Promise.all([
    rrkMenu.list().catch(() => null),
    rrkRaw.list().catch(() => null),
    rrkCombos.list().catch(() => null),
    rrkOccasions.list().catch(() => null),
    rrkSettings.get().catch(() => ({}))
  ]).then(([menu, raw, combos, occasions, settings]) => {
    if (!menu && !raw && !combos) return; // Firebase returned nothing useful
    const D = JSON.parse(JSON.stringify(RRK_DEFAULTS));
    if (menu && menu.length) D.menu = menu;
    if (raw && raw.length) D.raw = raw;
    if (combos && combos.length) D.combos = combos;
    if (occasions && occasions.length) D.occasions = occasions;
    if (settings) {
      if (settings.whatsapp) D.whatsapp = settings.whatsapp;
      if (settings.contact_phone) D.contact.phone = settings.contact_phone;
      if (settings.contact_phone_raw) D.contact.phoneRaw = settings.contact_phone_raw;
      if (settings.contact_whatsapp) D.contact.whatsapp = settings.contact_whatsapp;
      if (settings.contact_address) D.contact.address = settings.contact_address;
      if (settings.contact_hours) D.contact.hours = settings.contact_hours;
      if (settings.contact_maps) D.contact.mapsUrl = settings.contact_maps;
      if (settings.social_instagram) D.social.instagram = settings.social_instagram;
      if (settings.social_facebook) D.social.facebook = settings.social_facebook;
      if (settings.social_youtube) D.social.youtube = settings.social_youtube;
      if (settings.brand_tagline) D.brand.tagline = settings.brand_tagline;
      if (settings.footer_copyright) D.footer.copyright = settings.footer_copyright;
      if (settings.admin_user) D.adminCreds.user = settings.admin_user;
      if (settings.admin_pass) D.adminCreds.pass = settings.admin_pass;
    }
    renderWithData(page, D);
  }).catch(() => {});
}

function renderWithData(page, D) {
  if (page === 'index') renderIndex(D);
  else if (page === 'menu') renderMenuPage(D);
  else if (page === 'craft') renderCraftPage(D);
  else if (page === 'raw') renderRawPage(D);
}

function renderIndex(D) {
  const hero = document.getElementById('render-hero');
  const specials = document.getElementById('render-specials');
  const about = document.getElementById('render-about');
  const whyCards = document.getElementById('render-why-cards');
  const testimonials = document.getElementById('render-testimonials');
  const craftPreview = document.getElementById('render-craft-preview');
  const rawPreview = document.getElementById('render-raw-preview');
  const instagram = document.getElementById('render-instagram');
  const contact = document.getElementById('render-contact');
  const loginModal = document.getElementById('render-login-modal');
  if (!hero) return;

  hero.innerHTML = `<section class="hero"><div class="saffron-particles" aria-hidden="true">${Array(8).fill('<div class="saffron-particle"></div>').join('')}</div><div class="container hero__inner"><div class="hero__copy reveal reveal-slide-left"><span class="eyebrow">${D.hero.eyebrow}</span><h1 class="display">${D.hero.headlineL1}<br/>Crafted to <span class="gold">${D.hero.headlineGold}</span></h1><p class="lead">${D.hero.lead}</p><div class="hero__cta"><a href="menu.html" class="btn btn--primary btn--lg">Order Now</a><a href="craft-my-plate.html" class="btn btn--gold-outline btn--lg">Craft My Plate</a></div><div class="hero__stats">${D.heroStats.map(s=>`<div><strong data-count="${s.count}" data-suffix="${s.suffix}" data-duration="${s.duration}">${s.count}${s.suffix}</strong><span>${s.label}</span></div>`).join('')}</div></div><div class="hero__media reveal reveal-slide-right"><div class="hero__imgcard"><div class="img-ph img-ph--hero"><img src="${D.hero.image}" alt="Premium chicken" /></div><div class="badge-offer">${D.heroBadge.main}<br/><small>${D.heroBadge.sub}</small></div><div class="float-card"><span class="dot"></span> Freshly prepared</div></div></div></div><div class="hero__glow"></div></section>`;

  const specialItems = D.menu.filter(m => m.special == '1' || m.special === true).slice(0, 4);
  if (specials) specials.innerHTML = `<section class="section"><div class="container"><div class="section__head reveal"><span class="eyebrow">Chef's Picks</span><h2>Today's Special</h2></div><div class="grid grid--4">${specialItems.map((m,i)=>`<article class="food-card ${i%2===0?'cascade-left':'cascade-right'} reveal"><div class="img-ph"><img src="${m.image}" alt="${m.name}" loading="lazy" /></div><div class="steam" aria-hidden="true"><div class="steam-vapor"></div><div class="steam-vapor"></div><div class="steam-vapor"></div></div>${m.special_tag?`<span class="tag tag--offer">${m.special_tag}</span>`:''}<div class="food-card__body"><h3>${m.name}</h3><div class="price">₹${m.price}</div><a href="menu.html" class="btn btn--primary btn--block">Order</a></div></article>`).join('')}</div></div></section>`;

  if (about) about.innerHTML = `<section class="section section--soft" id="about"><div class="container split"><div class="split__media reveal reveal-slide-left"><div class="img-ph img-ph--tall"><img src="${D.about.image}" alt="Our kitchen" loading="lazy" /></div></div><div class="split__copy reveal reveal-slide-right"><span class="eyebrow">${D.about.eyebrow}</span><h2>${D.about.headlineL1}<br/>${D.about.headlineL2}</h2><p>${D.about.body}</p><div class="gold-divider"></div><a href="#contact" class="btn btn--gold-outline">${D.about.buttonText}</a></div></div></section>`;

  if (whyCards) whyCards.innerHTML = `<section class="section"><div class="container"><div class="section__head reveal"><span class="eyebrow">${D.whySection.eyebrow}</span><h2>${D.whySection.headline}</h2></div><div class="grid grid--5">${D.whyCards.map((w,i)=>`<div class="why-card reveal delay-${i+1}"><div class="why-ic">${w.icon}</div><h4>${w.title}</h4><p>${w.desc}</p></div>`).join('')}</div></div></section>`;

  if (testimonials) testimonials.innerHTML = `<section class="section section--soft testimonial-section"><div class="container"><div class="section__head reveal"><span class="eyebrow">What They Say</span><h2>Customer Love</h2></div><div class="testimonial-viewport" style="overflow:hidden;border-radius:32px"><div class="testimonial-track">${D.testimonials.map(t=>`<div class="testimonial-card"><div class="testimonial-avatar">${t.avatar}</div><div class="stars">${getStars(t.stars)}</div><p class="quote">"${t.quote}"</p><div class="author">${t.author}<span>${t.subtitle}</span></div></div>`).join('')}</div></div><div class="testimonial-dots">${D.testimonials.map((_,i)=>`<button class="${i===0?'active':''}" aria-label="Testimonial ${i+1}"></button>`).join('')}</div><div class="testimonial-arrows"><button class="testimonial-prev" aria-label="Previous">←</button><button class="testimonial-next" aria-label="Next">→</button></div></div></section>`;

  if (craftPreview) craftPreview.innerHTML = `<section class="section"><div class="container craft-preview glass reveal reveal-scale"><div class="craft-preview__copy"><span class="eyebrow">${D.craftPreview.eyebrow}</span><h2>${D.craftPreview.headline}</h2><p>${D.craftPreview.desc}</p><a href="craft-my-plate.html" class="btn btn--primary btn--lg">${D.craftPreview.buttonText}</a></div><div class="craft-preview__ui">${(D.craftPreview.chips||[]).map(c=>`<div class="mini-chip">${c.emoji} ${c.text}</div>`).join('')}<div class="mini-combo">${D.craftPreview.comboText}</div></div></div></section>`;

  const previewRaw = D.raw.slice(0, 3);
  if (rawPreview) rawPreview.innerHTML = `<section class="section section--soft"><div class="container"><div class="section__head reveal"><span class="eyebrow">Fresh Today</span><h2>Raw Chicken</h2></div><div class="grid grid--3">${previewRaw.map((r,i)=>`<article class="food-card reveal delay-${i+1}"><div class="img-ph"><img src="${r.image}" alt="${r.name}" loading="lazy" /></div><span class="tag tag--fresh">${r.tag||'Fresh Today'}</span><div class="food-card__body"><h3>${r.name}</h3><div class="price">₹${r.price} <small>/kg</small></div><a href="raw-chicken.html" class="btn btn--primary btn--block">View</a></div></article>`).join('')}</div></div></section>`;

  if (instagram) instagram.innerHTML = `<section class="section"><div class="container"><div class="section__head reveal"><span class="eyebrow">Follow Us</span><h2>From Our Kitchen</h2></div><div class="ig-grid">${D.instagram.map((ig,i)=>`<div class="ig-card reveal delay-${(i%3)+1}" tabindex="0"><img src="${ig.image}" alt="${ig.caption}" loading="lazy" /><div class="ig-overlay"><span>${ig.caption}</span></div></div>`).join('')}</div></div></section>`;

  if (contact) contact.innerHTML = `<section class="section" id="contact"><div class="container split"><div class="reveal reveal-slide-left"><iframe class="map-embed" title="RRK Chicken Location" src="${D.contact.mapsUrl}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div><div class="contact-card reveal reveal-slide-right"><h3>Visit &amp; Order</h3><ul class="contact-list"><li><span>📞 Phone</span><b>${D.contact.phone}</b></li><li><span>💬 WhatsApp</span><b>${D.contact.whatsapp}</b></li><li><span>📍 Address</span><b>${D.contact.address}</b></li><li><span>🕒 Hours</span><b>${D.contact.hours}</b></li></ul><a href="https://wa.me/${D.contact.phoneRaw||D.whatsapp}" class="btn btn--wa btn--block" target="_blank" rel="noopener">Chat on WhatsApp</a></div></div></section>`;

  if (loginModal) loginModal.innerHTML = `<div class="modal__backdrop" data-close></div><div class="modal__card glass"><button class="modal__x" data-close aria-label="Close">&times;</button><span class="eyebrow">${D.loginModal.eyebrow}</span><h3>${D.loginModal.headline}</h3><p class="muted">${D.loginModal.desc}</p><form id="loginForm" class="form"><input type="text" placeholder="Full Name" required /><input type="tel" placeholder="Phone Number" pattern="[0-9]{10}" required /><input type="date" required /><button type="submit" class="btn btn--primary btn--block btn--lg">Continue</button></form><ul class="benefits">${(D.loginModal.benefits||[]).map(b=>`<li>${b}</li>`).join('')}</ul><p class="tiny muted">${D.loginModal.privacy}</p></div>`;
}

function renderMenuPage(D) {
  const el = document.getElementById('render-menu'); if (!el) return;
  const cats = ['all','chicken','biryani','starters','meals','family','beverages','desserts'];
  const labels = {all:'All',chicken:'Chicken',biryani:'Biryani',starters:'Starters',meals:'Meals',family:'Family Packs',beverages:'Beverages',desserts:'Desserts'};
  el.innerHTML = `<section class="section"><div class="container"><div class="section__head reveal"><span class="eyebrow">${D.pageMeta.menu.eyebrow}</span><h2>${D.pageMeta.menu.headline}</h2></div><div class="cats reveal">${cats.map((c,i)=>`<button class="cat ${i===0?'active':''}" onclick="filterCat('${c}',this)">${labels[c]||c}</button>`).join('')}</div><div class="grid grid--4">${D.menu.map((m,i)=>`<article class="food-card ${i%2===0?'cascade-left':'cascade-right'} reveal" data-cat="${m.category||''}"><div class="img-ph"><img src="${m.image}" alt="${m.name}" loading="lazy" /></div><div class="steam" aria-hidden="true"><div class="steam-vapor"></div><div class="steam-vapor"></div><div class="steam-vapor"></div></div><div class="food-card__body"><span class="tag--${m.diet==='veg'?'veg':'nonveg'}"><span class="veg-ic ${m.diet==='nonveg'?'veg-ic--non':''}"></span>${m.diet==='veg'?'Veg':'Non-Veg'}</span><h3>${m.name}</h3><p class="muted" style="font-size:14px">${m.description||''}</p><div class="price">₹${m.price}</div><button class="btn btn--primary btn--block" onclick="addToCart('${(m.name||'').replace(/'/g,"\\'")}',${m.price||0})">Add to Cart</button></div></article>`).join('')}</div><div class="section-foil-divider" aria-hidden="true"></div><div class="qr-card reveal-scale" style="margin-top:60px"><span class="eyebrow">Scan &amp; Order</span><h3>QR Menu</h3><div class="qr-box"></div><p class="muted">Scan to open this menu on your phone.</p></div></div></section>`;
}

function renderCraftPage(D) {
  const el = document.getElementById('render-craft'); if (!el) return;
  el.innerHTML = `<section class="section"><div class="container"><div class="section__head reveal"><span class="eyebrow">${D.pageMeta.craft.eyebrow}</span><h2>${D.pageMeta.craft.headline}</h2><p class="muted">${D.pageMeta.craft.subhead}</p></div><div class="steps"><div class="step cascade-left reveal"><div class="step__num">1</div><h4>Number of People</h4><input type="range" min="${D.craftConfig.peopleMin}" max="${D.craftConfig.peopleMax}" value="${D.craftConfig.peopleDefault}" class="range" id="people" oninput="document.getElementById('peopleVal').textContent=this.value" /><p class="muted">Serving <b id="peopleVal">${D.craftConfig.peopleDefault}</b> people</p></div><div class="step cascade-right reveal"><div class="step__num">2</div><h4>Your Budget</h4><input type="range" min="${D.craftConfig.budgetMin}" max="${D.craftConfig.budgetMax}" step="${D.craftConfig.budgetStep}" value="${D.craftConfig.budgetDefault}" class="range" id="budget" oninput="document.getElementById('budgetVal').textContent=this.value" /><p class="muted">Budget ₹<b id="budgetVal">${D.craftConfig.budgetDefault}</b></p></div><div class="step cascade-left reveal"><div class="step__num">3</div><h4>Occasion</h4><div class="chips">${D.occasions.map((o,i)=>`<span class="chip ${i===0?'active':''}" data-group="occ" onclick="pickChip(this,'occ')">${o.emoji} ${o.label}</span>`).join('')}</div></div></div><div class="section-foil-divider" aria-hidden="true"></div><div class="section__head reveal" style="margin-top:56px"><span class="eyebrow">Recommended for you</span><h2 style="font-size:30px">Suggested Combos</h2></div><div class="suggest">${D.combos.map((c,i)=>`<div class="suggest-card reveal delay-${i+1}"><span class="save-badge">${c.save_badge||''}</span><h3>${c.name}</h3><p class="muted">${c.description||''}</p><div class="price">₹${c.price}</div><button class="btn btn--primary btn--block" onclick="pickCombo('${(c.name||'').replace(/'/g,"\\'")}',${c.price||0})">Select</button></div>`).join('')}</div><div class="summary-card reveal-scale" id="summary" style="display:none"><span class="eyebrow" style="color:#ffe9b0">Your Plate</span><h3 id="comboName">—</h3><div class="big" id="comboPrice">₹0</div><button class="btn btn--wa btn--block btn--lg" onclick="confirmCraft()">Confirm on WhatsApp</button></div></div></section>`;
}

function renderRawPage(D) {
  const el = document.getElementById('render-raw'); if (!el) return;
  el.innerHTML = `<section class="section"><div class="container"><div class="section__head reveal"><span class="eyebrow">${D.pageMeta.raw.eyebrow}</span><h2>${D.pageMeta.raw.headline}</h2><p class="muted">${D.pageMeta.raw.subhead}</p></div><div class="grid grid--4">${D.raw.map((r,i)=>`<article class="food-card ${i%2===0?'cascade-left':'cascade-right'} reveal"><div class="img-ph"><img src="${r.image}" alt="${r.name}" loading="lazy" /></div><span class="tag tag--fresh">${r.tag||'Fresh Today'}</span><div class="food-card__body"><h3>${r.name}</h3><div class="price">₹${r.price} <small>/kg</small></div><button class="btn btn--wa btn--block" onclick="orderRaw('${r.name}')">WhatsApp Order</button></div></article>`).join('')}</div><div class="section-foil-divider" aria-hidden="true"></div><div class="reveal" style="margin-top:56px"><table class="pricing-table"><thead><tr><th>Item</th><th>Weight</th><th>Price</th><th>Availability</th></tr></thead><tbody>${D.raw.map(r=>`<tr><td>${r.name}</td><td>${r.weight}</td><td>₹${r.price}</td><td>✅ ${r.tag||'Fresh Today'}</td></tr>`).join('')}</tbody></table></div></div></section>`;
}
