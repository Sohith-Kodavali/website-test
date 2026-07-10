// ============================================
// RRK SITE RENDERER — localStorage + Defaults
// No Firebase dependency on public pages
// ============================================

// Bump this when SITE_DATA defaults change.
// Old localStorage caches with a lower version are discarded.
var DATA_VERSION = 3;

const SITE_DATA = {
  whatsapp: '919999999999',
  brand: { name: 'RRK Food Court', tagline: 'Premium chicken restaurant in Eluru.' },
  pageMeta: {
    menu: { eyebrow: 'Explore', headline: 'Our Menu' },
    craft: { eyebrow: 'Catering', headline: 'Craft My Plate', subhead: 'Bespoke catering experiences designed for gatherings of 20+ guests. Sculpt your ideal menu entirely from scratch with immediate, live pricing updates.' },
    raw: { eyebrow: 'Farm Fresh', headline: 'Raw Chicken', subhead: 'Cut fresh every morning · hygienically packed.' }
  },
  hero: { eyebrow: 'Eluru · Andhra Pradesh', headlineL1: 'Premium Food,', headlineGold: 'Perfection', lead: 'Fresh, hygienic and irresistibly delicious. Order your favourites or build your own combo with Craft My Plate.', image: '2.jpeg' },
  heroBadge: { main: '20% OFF', sub: 'Today Only' },
  heroStats: [{count:4.9,suffix:'★',duration:2000,label:'2,400+ reviews'},{count:30,suffix:' min',duration:1500,label:'Fast delivery'},{count:100,suffix:'%',duration:1600,label:'Fresh daily'}],
  menu: [
    {name:'Signature Grilled Chicken',category:'chicken',diet:'nonveg',description:'Flame-grilled with house spices.',price:'249',craftPrice:'60',craftCategory:'starters',craftEnabled:true,image:'2.jpeg',special:'1',special_tag:'15% OFF'},
    {name:'Hyderabadi Biryani',category:'biryani',diet:'nonveg',description:'Slow-dum with basmati & saffron.',price:'199',craftPrice:'50',craftCategory:'mains',craftEnabled:true,image:'3.jpeg',special:'1',special_tag:'Bestseller'},
    {name:'Crispy Chicken 65',category:'starters',diet:'nonveg',description:'Spicy, crunchy, addictive.',price:'179',craftPrice:'65',craftCategory:'starters',craftEnabled:true,image:'4.jpeg',special:'1',special_tag:'Hot'},
    {name:'Chicken Lollipop',category:'starters',diet:'nonveg',description:'6 pcs, tangy glaze.',price:'189',craftPrice:'55',craftCategory:'starters',craftEnabled:true,image:'16.jpeg',special:'0'},
    {name:'Chicken Combo Meal',category:'meals',diet:'nonveg',description:'Rice, curry, starter & drink.',price:'279',craftPrice:'80',craftCategory:'mains',craftEnabled:true,image:'17.jpeg',special:'0'},
    {name:'Family Feast Pack',category:'family',diet:'nonveg',description:'Serves 4 · biryani + starters.',price:'699',craftPrice:'0',craftCategory:'',craftEnabled:false,image:'5.jpeg',special:'1',special_tag:'Combo'},
    {name:'Fresh Lime Soda',category:'beverages',diet:'veg',description:'Chilled & refreshing.',price:'59',craftPrice:'20',craftCategory:'beverages',craftEnabled:true,image:'18.jpeg',special:'0'},
    {name:'Gulab Jamun (2 pcs)',category:'desserts',diet:'veg',description:'Warm, syrup-soaked.',price:'69',craftPrice:'40',craftCategory:'desserts',craftEnabled:true,image:'19.jpeg',special:'0'}
  ],
  raw: [
    {name:'Boneless',image:'7.jpeg',price:'320',weight:'1 kg',tag:'Fresh Today'},
    {name:'Curry Cut',image:'8.jpeg',price:'240',weight:'1 kg',tag:'Fresh Today'},
    {name:'Whole Chicken',image:'9.jpeg',price:'210',weight:'1.2 – 1.5 kg',tag:'Fresh Today'},
    {name:'Lollipop',image:'20.jpeg',price:'280',weight:'500 g',tag:'Fresh Today'},
    {name:'Wings',image:'21.jpeg',price:'260',weight:'500 g',tag:'Fresh Today'},
    {name:'Leg Piece',image:'22.jpeg',price:'290',weight:'1 kg',tag:'Fresh Today'},
    {name:'Breast',image:'23.jpeg',price:'330',weight:'1 kg',tag:'Fresh Today'}
  ],
  combos: [
    {name:'Party Starter Combo',save_badge:'Save ₹180',description:'Biryani x2 + Chicken 65 + Lollipop + 4 drinks.',price:'1299'},
    {name:'Family Feast',save_badge:'Save ₹250',description:'Family pack + grilled chicken + desserts + drinks.',price:'1599'},
    {name:'Grand Celebration',save_badge:'Save ₹320',description:'Serves 10 · biryani, starters, mains & sweets.',price:'2499'}
  ],
  occasions: [{emoji:'🎂',label:'Birthday'},{emoji:'💼',label:'Office'},{emoji:'💍',label:'Wedding'},{emoji:'👪',label:'Family'},{emoji:'🎊',label:'Festival'}],
  craftOccasions: ['Birthday Party','Corporate Event','Wedding/Engagement','Casual House Party'],
  comboDefs: {
    value: {label:'VALUE COMBO',tag:'Budget-Friendly',pricePer:250,badge:'',items:[
      {cat:'starters',idx:0},{cat:'mains',idx:0},{cat:'mains',idx:1},{cat:'breads',idx:0},{cat:'desserts',idx:0}
    ]},
    premium: {label:'PREMIUM COMBO',tag:'Most Popular',pricePer:500,badge:'Best Value',items:[
      {cat:'starters',idx:0},{cat:'starters',idx:1},{cat:'mains',idx:0},{cat:'mains',idx:1},{cat:'mains',idx:2},{cat:'breads',idx:0},{cat:'desserts',idx:0}
    ]}
  },
  craftConfig: {peopleMin:10,peopleMax:500,peopleDefault:50,guestMin:10,budgetMin:100,budgetMax:2000,budgetStep:50,budgetDefault:300},
  craftPreview: {eyebrow:'Signature Feature',headline:'Craft My Plate',desc:'Plan your catering · 20+ guests · custom combos & live pricing.',buttonText:'Start Crafting',chips:[{emoji:'👥',text:'20+ Guests'},{emoji:'📦',text:'2 Combos'},{emoji:'💰',text:'Best Value'}],comboText:'Catering from <b>₹250/person</b>'},
  about: {eyebrow:'Our Story',headlineL1:'Rooted in flavour,',headlineL2:'refined for you',body:'RRK Food Court started in the heart of Eluru with one belief: premium chicken should be fresh, hygienic and honestly priced.',image:'6.jpeg',buttonText:'Visit Us'},
  whyCards: [{icon:'🐔',title:'Fresh Chicken',desc:'Sourced & cut daily.'},{icon:'👑',title:'Premium Quality',desc:'Only grade-A cuts.'},{icon:'✨',title:'Hygienic Kitchen',desc:'Spotless & safe.'},{icon:'⚡',title:'Fast Delivery',desc:'Hot in 30 mins.'},{icon:'💰',title:'Affordable',desc:'Great value always.'}],
  whySection: {eyebrow:'Why RRK',headline:'Why RRK Food Court'},
  testimonials: [
    {avatar:'👨',stars:5,quote:'Best chicken I\'ve had in Eluru.',author:'Ravi Kumar',subtitle:'Regular Customer'},
    {avatar:'👩',stars:5,quote:'Ordered the Family Feast Pack for a get-together. Everyone loved it.',author:'Priya Sharma',subtitle:'Verified Order'},
    {avatar:'👨‍🦱',stars:5,quote:'Craft My Plate is genius. Saved money and got exactly what I needed.',author:'Sandeep Reddy',subtitle:'First-time Customer'},
    {avatar:'👩‍🦰',stars:5,quote:'Fresh raw chicken in 30 minutes. Clean cuts, proper packaging.',author:'Lakshmi Devi',subtitle:'Weekly Regular'}
  ],
  instagram: [
    {image:'10.jpeg',caption:'Grilled to perfection'},{image:'11.jpeg',caption:'Weekend biryani'},
    {image:'12.jpeg',caption:'Fresh cuts daily'},{image:'13.jpeg',caption:'Family feast'},
    {image:'14.jpeg',caption:'Tandoori special'},{image:'15.jpeg',caption:'Curry cuts ready'}
  ],
  contact: {phone:'+91 99999 99999',phoneRaw:'919999999999',whatsapp:'+91 99999 99999',address:'Railway Track Rd, Ramachandra Rao Pet, Eluru, AP 534002',hours:'11:00 AM – 11:00 PM',mapsUrl:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.8001938655!2d81.1007719!3d16.7106762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3615e01ad28f5d%3A0xf1c2f543e5e71e0a!2sRRK%20FOOD%20COURT!5e0!3m2!1sen!2sin!4v99999999999'},
  social: {instagram:'#',facebook:'#',youtube:'#'},
  footer: {copyright:'© 2026 RRK Food Court. All rights reserved.'},
  loginModal: {eyebrow:'Welcome to RRK',headline:'Join the RRK Food Court Family',desc:'Unlock birthday offers, festival deals & exclusive combos.',benefits:['🎂 Birthday Offer','🎊 Festival Offers','🔑 Exclusive Deals','💬 WhatsApp Community'],privacy:'We respect your privacy.'}
};

function loadSiteData() {
  try {
    var saved = localStorage.getItem('rrk_site_data');
    if (saved) {
      var parsed = JSON.parse(saved);
      if (parsed._v >= DATA_VERSION) return parsed;
    }
  } catch(e) {}
  return null;
}

function getStars(n) { return '★'.repeat(parseInt(n)||5); }

// Derive craft menu items from main menu (only items with craftEnabled=true)
function deriveCraftMenu(D) {
  var cats = {starters:[], mains:[], breads:[], desserts:[], beverages:[]};
  D.menu.forEach(function(m) {
    if (m.craftEnabled && m.craftCategory && cats[m.craftCategory]) {
      cats[m.craftCategory].push({
        name: m.name,
        price: parseInt(m.craftPrice) || 0,
        diet: m.diet || 'nonveg',
        image: m.image || ''
      });
    }
  });
  return cats;
}

function renderForPage(page) {
  // Try Firestore first, fall back to localStorage, then defaults
  loadFromFirestore(page);
}

var FIREBASE_SEEDED = false;

function loadFromFirestore(page) {
  if (typeof rrkMenu === 'undefined') {
    renderWithData(page, null);
    return;
  }
  Promise.all([
    rrkMenu.list().catch(function() { return null; }),
    rrkRaw.list().catch(function() { return null; }),
    rrkCombos.list().catch(function() { return null; }),
    rrkOccasions.list().catch(function() { return null; })
  ]).then(function(results) {
    var menu = results[0], raw = results[1], combos = results[2], occasions = results[3];
    var data = JSON.parse(JSON.stringify(SITE_DATA));
    if (menu && menu.length > 0) data.menu = mergeFirestoreMenu(menu);
    if (raw && raw.length > 0) data.raw = mergeFirestoreRaw(raw);
    if (combos && combos.length > 0) data.combos = combos;
    if (occasions && occasions.length > 0) data.occasions = occasions.map(function(o) { return {emoji: o.emoji||'🎉', label: o.label||'Event'}; });
    try { data._v = DATA_VERSION; localStorage.setItem('rrk_site_data', JSON.stringify(data)); } catch(e) {}
    renderWithData(page, data);
  }).catch(function() {
    renderWithData(page, null);
  });
}

function mergeFirestoreMenu(menu) {
  return menu.map(function(m) {
    return {
      name: m.name || '', category: m.category || 'chicken', diet: m.diet || 'nonveg',
      description: m.description || '', price: (m.price || 0).toString(),
      craftPrice: (m.craftPrice || 0).toString(), craftCategory: m.craftCategory || '', craftEnabled: m.craftEnabled || false,
      image: m.image || '', special: m.special || '0', special_tag: m.special_tag || ''
    };
  });
}

function mergeFirestoreRaw(raw) {
  return raw.map(function(r) {
    return {
      name: r.name || '', image: r.image || '', price: (r.price || 0).toString(),
      weight: r.weight || '1 kg', tag: r.tag || 'Fresh Today', show_home: r.show_home || '1'
    };
  });
}

function renderWithData(page, data) {
  var saved = loadSiteData();
  var D = data || saved || SITE_DATA;

  if (page === 'index') renderIndex(D);
  else if (page === 'menu') renderMenuPage(D);
  else if (page === 'craft') renderCraftPage(D);
  else if (page === 'raw') renderRawPage(D);

  // After injecting HTML, mark everything as revealed and dismiss loader
  setTimeout(function() {
    document.querySelectorAll('.reveal, .reveal-slide-left, .reveal-slide-right, .reveal-scale, .cascade-left, .cascade-right').forEach(function(el) {
      el.classList.add('revealed');
    });
    if (typeof observeRevealElements === 'function') observeRevealElements();
    if (typeof initTestimonials === 'function') initTestimonials();
    if (typeof initMagneticTilt === 'function') initMagneticTilt();
    if (typeof initCounterObserver === 'function') initCounterObserver();
    var loader = document.querySelector('.loader');
    if (loader) loader.classList.add('hidden');
  }, 50);
}

function renderIndex(D) {
  var h = document.getElementById('render-hero');
  if (!h) return;
  h.innerHTML = '<section class="hero"><div class="container hero__inner"><div class="hero__copy reveal reveal-slide-left"><span class="eyebrow">'+D.hero.eyebrow+'</span><h1 class="display mob-full">'+D.hero.headlineL1+'<br/>Crafted to <span class="gold">'+D.hero.headlineGold+'</span></h1><p class="lead">'+D.hero.lead+'</p><div class="hero__cta"><a href="menu.html" class="btn btn--primary btn--lg">🍗 Order Now</a><a href="craft-my-plate.html" class="btn btn--gold-outline btn--lg mob-nowrap">🍽️ Craft My Plate</a></div><div class="hero__stats">'+D.heroStats.map(function(s){return'<div><strong data-count="'+s.count+'" data-suffix="'+s.suffix+'" data-duration="'+s.duration+'">'+s.count+s.suffix+'</strong><span>'+s.label+'</span></div>'}).join('')+'</div></div><div class="hero__media reveal reveal-slide-right"><div class="hero__imgcard"><div class="img-ph img-ph--hero"><img src="'+D.hero.image+'" alt="Signature Grilled Chicken" /></div><div class="badge-offer">'+D.heroBadge.main+'<br/><small>'+D.heroBadge.sub+'</small></div><div class="float-card"><span class="dot"></span> Freshly prepared</div></div></div></div><div class="hero__glow"></div></section>';

  var specialItems = D.menu.filter(function(m){return m.special=='1' || m.special===true}).slice(0,2);
  document.getElementById('render-specials').innerHTML = '<section class="section"><div class="container"><div class="section__head reveal"><span class="eyebrow">Chef\'s Picks</span><h2>Today\'s Special</h2></div><div class="grid grid--2">'+specialItems.map(function(m,i){return'<article class="food-card special-zoom"><div class="img-ph"><img src="'+m.image+'" alt="'+m.name+'" loading="lazy" /></div><div class="steam" aria-hidden="true"><div class="steam-vapor"></div><div class="steam-vapor"></div><div class="steam-vapor"></div></div>'+(m.special_tag?'<span class="tag tag--offer">'+m.special_tag+'</span>':'')+'<div class="food-card__body"><h3>'+m.name+'</h3><div class="price">₹'+m.price+'</div><a href="menu.html" class="btn btn--primary btn--block">Order</a></div></article>'}).join('')+'</div></div></section>';

  document.getElementById('render-about').innerHTML = '<section class="section section--soft" id="about"><div class="container split"><div class="split__media reveal reveal-slide-left"><div class="img-ph img-ph--tall"><img src="'+D.about.image+'" alt="Our kitchen" loading="lazy" /></div></div><div class="split__copy reveal reveal-slide-right"><span class="eyebrow">'+D.about.eyebrow+'</span><h2>'+D.about.headlineL1+'<br/>'+D.about.headlineL2+'</h2><p>'+D.about.body+'</p><div class="gold-divider"></div><a href="#contact" class="btn btn--gold-outline">'+D.about.buttonText+'</a></div></div></section>';

  document.getElementById('render-why-cards').innerHTML = '<section class="section"><div class="container"><div class="section__head reveal"><span class="eyebrow">'+D.whySection.eyebrow+'</span><h2>'+D.whySection.headline+'</h2></div><div class="grid grid--5">'+D.whyCards.map(function(w,i){return'<div class="why-card reveal delay-'+(i+1)+'"><div class="why-ic">'+w.icon+'</div><h4>'+w.title+'</h4><p>'+w.desc+'</p></div>'}).join('')+'</div></div></section>';

  document.getElementById('render-testimonials').innerHTML = '<section class="section section--soft testimonial-section"><div class="container"><div class="section__head reveal"><span class="eyebrow">What They Say</span><h2>Customer Love</h2></div><div class="testimonial-viewport" style="overflow:hidden;border-radius:32px"><div class="testimonial-track">'+D.testimonials.map(function(t){return'<div class="testimonial-card"><div class="testimonial-avatar">'+t.avatar+'</div><div class="stars">'+getStars(t.stars)+'</div><p class="quote">"'+t.quote+'"</p><div class="author">'+t.author+'<span>'+t.subtitle+'</span></div></div>'}).join('')+'</div></div><div class="testimonial-dots">'+D.testimonials.map(function(_,i){return'<button class="'+(i===0?'active':'')+'" aria-label="Testimonial '+(i+1)+'"></button>'}).join('')+'</div><div class="testimonial-arrows"><button class="testimonial-prev" aria-label="Previous">←</button><button class="testimonial-next" aria-label="Next">→</button></div></div></section>';

  document.getElementById('render-craft-preview').innerHTML = '<section class="section"><div class="container craft-preview glass reveal reveal-scale"><div class="craft-preview__copy"><span class="eyebrow">'+D.craftPreview.eyebrow+'</span><h2>'+D.craftPreview.headline+'</h2><p>'+D.craftPreview.desc+'</p><a href="craft-my-plate.html" class="btn btn--primary btn--lg">'+D.craftPreview.buttonText+'</a></div><div class="craft-preview__ui">'+D.craftPreview.chips.map(function(c){return'<div class="mini-chip">'+c.emoji+' '+c.text+'</div>'}).join('')+'<div class="mini-combo">'+D.craftPreview.comboText+'</div></div></div></section>';

  document.getElementById('render-raw-preview').innerHTML = '<section class="section section--soft"><div class="container"><div class="section__head reveal"><span class="eyebrow">Fresh Today</span><h2>Raw Chicken</h2></div><div class="raw-cta reveal" style="text-align:center; padding: 48px 24px; background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border);"><p style="font-size: 1.1rem; margin-bottom: 24px; color: var(--text-secondary);">Order fresh, hygienically packed raw chicken delivered to your doorstep.</p><a href="raw-chicken.html" class="btn btn--primary btn--lg">🥩 Book Raw Chicken Online</a></div></div></section>';

  document.getElementById('render-instagram').innerHTML = '<section class="section"><div class="container"><div class="section__head reveal"><span class="eyebrow">Follow Us</span><h2>From Our Kitchen</h2></div><div class="ig-grid">'+D.instagram.map(function(ig,i){return'<div class="ig-card reveal delay-'+((i%3)+1)+'" tabindex="0"><img src="'+ig.image+'" alt="'+ig.caption+'" loading="lazy" /><div class="ig-overlay"><span>'+ig.caption+'</span></div></div>'}).join('')+'</div></div></section>';

  document.getElementById('render-contact').innerHTML = '<section class="section" id="contact"><div class="container split"><div class="reveal reveal-slide-left"><iframe class="map-embed" title="RRK Food Court Location" src="'+D.contact.mapsUrl+'" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div><div class="contact-card reveal reveal-slide-right"><h3>Visit &amp; Order</h3><ul class="contact-list"><li><span>📞 Phone</span><b>'+D.contact.phone+'</b></li><li><span>💬 WhatsApp</span><b>'+D.contact.whatsapp+'</b></li><li><span>📍 Address</span><b>'+D.contact.address+'</b></li><li><span>🕒 Hours</span><b>'+D.contact.hours+'</b></li></ul><a href="https://wa.me/'+(D.contact.phoneRaw||D.whatsapp)+'" class="btn btn--wa btn--block" target="_blank" rel="noopener">Chat on WhatsApp</a></div></div></section>';

  document.getElementById('render-login-modal').innerHTML = '<div class="modal__backdrop" data-close></div><div class="modal__card glass"><button class="modal__x" data-close aria-label="Close">&times;</button><span class="eyebrow">'+D.loginModal.eyebrow+'</span><h3>'+D.loginModal.headline+'</h3><p class="muted">'+D.loginModal.desc+'</p><form id="loginForm" class="form"><input type="text" placeholder="Full Name" required /><input type="tel" placeholder="Phone Number" pattern="[0-9]{10}" required /><input type="date" required /><button type="submit" class="btn btn--primary btn--block btn--lg">Continue</button></form><ul class="benefits">'+D.loginModal.benefits.map(function(b){return'<li>'+b+'</li>'}).join('')+'</ul><p class="tiny muted">'+D.loginModal.privacy+'</p></div>';
}

function renderSpecialsRow(D) {
  var specialItems = D.menu.filter(function(m){return m.special=='1' || m.special===true}).slice(0,2);
  if (specialItems.length === 0) return '';
  return '<div class="menu-specials-label">🔥 Chef\'s Picks</div><div class="specials-row">'+specialItems.map(function(m){return'<div class="special-card" onclick="addToCart(\''+(m.name||'').replace(/'/g,"\\'")+'\','+m.price+')"><div class="special-card__img"><img src="'+m.image+'" alt="'+m.name+'" loading="lazy" />'+(m.special_tag?'<span class="menu-badge menu-badge--offer">'+m.special_tag+'</span>':'')+'</div><div class="special-card__info"><span class="special-card__name">'+m.name+'</span><span class="special-card__price">₹'+m.price+'</span></div></div>'}).join('')+'</div>';
}

function renderMenuPage(D) {
  var el = document.getElementById('render-menu'); if(!el)return;
  var cats=['all','chicken','biryani','starters','more'];
  var labels={all:'All',chicken:'🐔 Chicken',biryani:'🍚 Biryani',starters:'🍗 Starters',more:'More'};
  var moreCats=['meals','family','beverages','desserts'];
  el.innerHTML = '<section class="section"><div class="container"><div class="section__head reveal"><span class="eyebrow">'+D.pageMeta.menu.eyebrow+'</span><h2>'+D.pageMeta.menu.headline+'</h2></div><div class="menu-search reveal"><input type="text" class="menu-search__input" placeholder="Search menu..." oninput="searchMenu(this.value)" /></div>'+renderSpecialsRow(D)+'<div class="cats cats--compact reveal">'+cats.map(function(c,i){return'<button class="cat '+(i===0?'active':'')+'" onclick="filterCat(\''+c+'\',this)">'+labels[c]+'</button>'}).join('')+'</div><div class="menu-list">'+D.menu.map(function(m){var cat=m.category;if(moreCats.indexOf(cat)!==-1)cat='more';return'<article class="menu-row reveal" data-cat="'+cat+'" data-search="'+m.name.toLowerCase()+' '+m.category.toLowerCase()+'"><div class="menu-row__img"><img src="'+m.image+'" alt="'+m.name+'" loading="lazy" />'+(m.special_tag?'<span class="menu-badge menu-badge--offer">'+m.special_tag+'</span>':'')+(m.category==='biryani'&&!m.special_tag?'<span class="menu-badge menu-badge--best">Best</span>':'')+'<span class="menu-badge menu-badge--diet '+(m.diet==='nonveg'?'':'diet-veg')+'">'+(m.diet==='veg'?'🟢Veg':'Non-Veg')+'</span></div><div class="menu-row__info"><div class="menu-row__top"><h3>'+m.name+'</h3></div><p class="menu-row__desc">'+(m.description||'')+'</p><div class="menu-row__bottom"><div class="price">₹'+m.price+'</div><button class="btn btn--primary btn--sm" onclick="addToCart(\''+(m.name||'').replace(/'/g,"\\'")+'\','+m.price+')">+ Add</button></div></div></article>'}).join('')+'</div><div class="section-foil-divider" aria-hidden="true"></div><div class="qr-card reveal-scale" style="margin-top:60px"><span class="eyebrow">Scan &amp; Order</span><h3>QR Menu</h3><div class="qr-box"></div><p class="muted">Scan to open this menu on your phone.</p></div></div></section>';
}

function renderCraftPage(D) {
  var el = document.getElementById('render-craft'); if(!el)return;
  var craftMenu = deriveCraftMenu(D);
  var catKeys = ['starters','mains','breads','desserts','beverages'];
  var catLabels = {starters:'Starters',mains:'Main Course',breads:'Breads & Rice',desserts:'Desserts',beverages:'Beverages'};
  var catEmojis = {starters:'🍗',mains:'🍛',breads:'🍞',desserts:'🍰',beverages:'🥤'};

  function sandboxItemHTML(item, cat, idx, checked) {
    return '<label class="cp-item'+(checked?' checked':'')+'">'+
      '<input type="checkbox" data-cat="'+cat+'" data-idx="'+idx+'" data-price="'+item.price+'"'+(checked?' checked':'')+' onclick="CpApp.sandboxToggle(event)">'+
      '<span class="cp-item-name">'+item.name+'</span>'+
      '<span class="cp-item-price">+₹'+item.price+'/person</span>'+
    '</label>';
  }

  var html = '';

  // ===== STEP 1: Gatekeeper Banner =====
  html += '<section class="cp-hero reveal">'+
    '<div class="cp-hero__inner glass">'+
      '<span class="eyebrow">'+D.pageMeta.craft.eyebrow+'</span>'+
      '<h2>'+D.pageMeta.craft.headline+'</h2>'+
      '<p class="cp-subhead">'+D.pageMeta.craft.subhead+'</p>'+
      '<div class="cp-badges">'+
        '<div class="cp-badge"><span class="cp-badge__ic">👥</span><strong>Minimum Guests:</strong> 10 Persons</div>'+
        '<div class="cp-badge"><span class="cp-badge__ic">🍽️</span><strong>Minimum Items:</strong> 3 Menu Items</div>'+
      '</div>'+
      '<p class="cp-note muted">Fewer than 10 guests? Please order directly from our standard <a href="menu.html">delivery menu</a>.</p>'+
    '</div>'+
  '</section>';

  // ===== STEP 2: Guest Count + Budget =====
  html += '<section class="cp-step-section reveal" id="step2">'+
    '<div class="cp-step-head"><div class="cp-step-num">2</div><h3>Guests &amp; Estimated Budget</h3></div>'+
    '<div class="cp2-grid">'+
      '<div class="cp2-field">'+
        '<label class="cp2-label">Number of Guests</label>'+
        '<input type="number" id="cpGuestCount" min="'+D.craftConfig.guestMin+'" max="'+D.craftConfig.peopleMax+'" value="'+D.craftConfig.peopleDefault+'" placeholder="Enter Number of Guests" class="cp-guest-input" oninput="CpApp.onGuestChange()">'+
        '<div class="cp-guest-btns">'+
          '<button class="btn cp-guest-preset" onclick="CpApp.setGuests(10)">10</button>'+
          '<button class="btn cp-guest-preset" onclick="CpApp.setGuests(25)">25</button>'+
          '<button class="btn cp-guest-preset" onclick="CpApp.setGuests(50)">50</button>'+
          '<button class="btn cp-guest-preset" onclick="CpApp.setGuests(100)">100</button>'+
        '</div>'+
      '</div>'+
      '<div class="cp2-field">'+
        '<label class="cp2-label">Estimated Budget Per Person (₹)</label>'+
        '<input type="range" id="cpBudget" min="'+D.craftConfig.budgetMin+'" max="'+D.craftConfig.budgetMax+'" step="'+D.craftConfig.budgetStep+'" value="'+D.craftConfig.budgetDefault+'" class="range" oninput="CpApp.onBudgetChange()">'+
        '<div class="cp-budget-display">₹<strong id="cpBudgetVal">'+D.craftConfig.budgetDefault+'</strong>/person</div>'+
        '<div class="cp-budget-note">We\'ll highlight items that fit your budget</div>'+
      '</div>'+
    '</div>'+
    '<div class="cp2-delivery">'+
      '<label class="cp2-label">Order Type</label>'+
      '<div class="cp-delivery-toggle">'+
        '<label class="cp-toggle-opt active"><input type="radio" name="cpDeliveryMode" value="delivery" checked onchange="CpApp.setDeliveryMode(\'delivery\')">🚚 Delivery</label>'+
        '<label class="cp-toggle-opt"><input type="radio" name="cpDeliveryMode" value="takeaway" onchange="CpApp.setDeliveryMode(\'takeaway\')">🥡 Takeaway</label>'+
      '</div>'+
    '</div>'+
    '<div class="cp-validation-msg" id="cpValidMsg" style="display:none"><span>⚠️</span> Minimum 10 guests required for catering services.</div>'+
    '<div class="cp-guest-ok" id="cpGuestOk" style="display:none">✅ Great! Serving <strong id="cpGuestOkCount"></strong> guests · Est. Budget ₹<strong id="cpGuestOkBudget"></strong>/person</div>'+
  '</section>';

  // ===== STEP 3: Menu Builder (unlocked after valid guests) =====
  html += '<section class="cp-step-section reveal cp-step-locked" id="step3">'+
    '<div class="cp-step-head"><div class="cp-step-num">3</div><h3>Build Your Menu</h3></div>'+
    '<p class="muted cp-step-desc">Select items for your catering. Each item is priced per person. Pick at least 3 items.</p>'+
    '<div class="cp-tabs" id="cpTabs">'+
      catKeys.map(function(cat, i) {
        return '<button class="cp-tab-btn'+(i===0?' active':'')+'" onclick="CpApp.switchTab(\''+cat+'\',event)">'+catEmojis[cat]+' '+catLabels[cat]+'</button>';
      }).join('')+
    '</div>'+
    '<div class="cp-panels">'+
      catKeys.map(function(cat, i) {
        var items = craftMenu[cat] || [];
        return '<div class="cp-panel'+(i===0?' active':'')+'" data-cat="'+cat+'">'+
          (items.length === 0 ? '<p class="muted" style="padding:16px">No items in this category yet.</p>' :
          items.map(function(item, idx) {
            return sandboxItemHTML(item, cat, idx, false);
          }).join(''))+
        '</div>';
      }).join('')+
    '</div>'+
    '<div class="cp-summary">'+
      '<div class="cp-stats"><span>Per Plate: <strong>₹<span id="cpPerPlate">0</span></strong></span><span>Total Selected: <strong id="cpItemCount">0</strong></span></div>'+
      '<div class="cp-budget-bar" id="cpBudgetBar"><div class="cp-budget-bar__track"><div class="cp-budget-bar__fill" id="cpBudgetFill"></div></div><span class="cp-budget-bar__label" id="cpBudgetLabel"></span></div>'+
      '<div class="cp-warning" id="cpWarning" style="display:none">⚠️ Please select at least 3 items to build your custom menu.</div>'+
    '</div>'+
  '</section>';

  // ===== STEP 4: Occasion & Coupon =====
  html += '<section class="cp-step-section reveal" id="step4" style="display:none">'+
    '<div class="cp-step-head"><div class="cp-step-num">4</div><h3>Occasion &amp; Coupons</h3></div>'+
    '<div class="cp-occasion">'+
      '<label for="cpOccasion" class="cp-label">Choose Your Occasion</label>'+
      '<select id="cpOccasion" class="cp-select" onchange="CpApp.onOccasionChange()">'+
        '<option value="">— Select —</option>'+
        D.craftOccasions.map(function(o){return'<option value="'+o+'">'+o+'</option>';}).join('')+
      '</select>'+
    '</div>'+
    '<div class="cp-coupon" id="cpCoupon" style="display:none"></div>'+
    '<div class="cp-coupon free-del" id="cpFreeDelivery" style="display:none">🚚 <strong>FREE DELIVERY</strong> automatically applied — orders above ₹40,000!</div>'+
  '</section>';

  // ===== STICKY CHECKOUT BAR =====
  html += '<div class="cp-checkout-bar" id="cpCheckoutBar">'+
    '<div class="cp-checkout-grid">'+
      '<div class="cp-checkout-stat"><span class="cp-co-label">Guests</span><strong id="cpCoGuests">—</strong></div>'+
      '<div class="cp-checkout-stat"><span class="cp-co-label">Items</span><strong id="cpCoItems">—</strong></div>'+
      '<div class="cp-checkout-stat cp-checkout-total"><span class="cp-co-label">Grand Total</span><strong id="cpCoTotal">₹0</strong></div>'+
      '<button class="btn btn--primary btn--lg cp-checkout-btn" id="cpCheckoutBtn" disabled onclick="CpApp.showConfirm()">Confirm &amp; Review</button>'+
    '</div>'+
  '</div>';

  // ===== STEP 5: Confirm / Cancel =====
  html += '<section class="cp-step-section reveal" id="step5" style="display:none">'+
    '<div class="cp-step-head"><div class="cp-step-num">5</div><h3>Review Your Order</h3></div>'+
    '<div class="cp-confirm-box" id="cpConfirmBox"></div>'+
    '<div class="cp-confirm-actions">'+
      '<button class="btn btn--gold-outline btn--lg" onclick="CpApp.cancelOrder()">Cancel</button>'+
      '<button class="btn btn--primary btn--lg" onclick="CpApp.confirmOrder()">✅ Confirm Order</button>'+
    '</div>'+
  '</section>';

  // ===== STEP 6: WhatsApp Order =====
  html += '<section class="cp-step-section reveal" id="step6" style="display:none">'+
    '<div class="cp-step-head"><div class="cp-step-num">6</div><h3>Order on WhatsApp</h3></div>'+
    '<div class="cp-wa-box" id="cpWaBox"></div>'+
    '<button class="btn btn--wa btn--block btn--lg" onclick="CpApp.orderWhatsApp()">💬 Order on WhatsApp</button>'+
  '</section>';

  el.innerHTML = html;
}

function renderRawPage(D) {
  var el = document.getElementById('render-raw'); if(!el)return;
  el.innerHTML = '<section class="section"><div class="container"><div class="section__head reveal"><span class="eyebrow">'+D.pageMeta.raw.eyebrow+'</span><h2>'+D.pageMeta.raw.headline+'</h2><p class="muted">'+D.pageMeta.raw.subhead+'</p></div><div class="menu-search reveal"><input type="text" class="menu-search__input" placeholder="Search raw chicken..." oninput="searchRawItems(this.value)" /></div><div class="menu-list">'+D.raw.map(function(r,i){return'<article class="menu-row reveal" data-raw-search="'+r.name.toLowerCase()+'"><div class="menu-row__img"><img src="'+r.image+'" alt="'+r.name+'" loading="lazy" /><span class="menu-badge menu-badge--best" style="background:var(--success);font-size:8px">'+(r.tag||'Fresh')+'</span></div><div class="menu-row__info"><div class="menu-row__top"><h3>'+r.name+'</h3></div><p class="menu-row__desc">'+r.weight+'</p><div class="menu-row__bottom"><div class="price">₹'+r.price+' <small>/kg</small></div><button class="btn btn--primary btn--sm" onclick="addToCart(\''+(r.name||'').replace(/'/g,"\\'")+'\','+r.price+')">+ Add</button></div></div></article>'}).join('')+'</div><div class="section-foil-divider" aria-hidden="true"></div><div class="reveal" style="margin-top:56px"><table class="pricing-table"><thead><tr><th>Item</th><th>Weight</th><th>Price</th><th>Availability</th></tr></thead><tbody>'+D.raw.map(function(r){return'<tr><td>'+r.name+'</td><td>'+r.weight+'</td><td>₹'+r.price+'</td><td>✅ '+(r.tag||'Fresh Today')+'</td></tr>'}).join('')+'</tbody></table></div></div></section>';
}
