// ============================================
// RRK SITE RENDERER — Firestore Backend
// ============================================

function getStars(n) { return '★'.repeat(parseInt(n) || 5); }

function renderForPage(page) {
  const D = RRK_DEFAULTS;
  Promise.all([
    rrkMenu.list().catch(() => D.menu),
    rrkRaw.list().catch(() => D.raw),
    rrkCombos.list().catch(() => D.combos),
    rrkOccasions.list().catch(() => D.occasions),
    rrkSettings.get().catch(() => ({}))
  ]).then(([menu, raw, combos, occasions, settings]) => {
    const data = {
      ...D,
      menu, raw, combos, occasions,
      whatsapp: settings.whatsapp || D.whatsapp,
      brand: { name: settings.brand_name || D.brand.name, tagline: settings.brand_tagline || D.brand.tagline },
      hero: D.hero, heroBadge: D.heroBadge, heroStats: D.heroStats,
      about: D.about, whyCards: D.whyCards, whySection: D.whySection,
      testimonials: D.testimonials, instagram: D.instagram,
      craftPreview: D.craftPreview, craftConfig: D.craftConfig,
      footer: { copyright: settings.footer_copyright || D.footer.copyright },
      social: {
        instagram: settings.social_instagram || D.social.instagram,
        facebook: settings.social_facebook || D.social.facebook,
        youtube: settings.social_youtube || D.social.youtube
      },
      contact: {
        phone: settings.contact_phone || D.contact.phone,
        phoneRaw: settings.contact_phone_raw || D.contact.phoneRaw,
        whatsapp: settings.contact_whatsapp || D.contact.whatsapp,
        address: settings.contact_address || D.contact.address,
        hours: settings.contact_hours || D.contact.hours,
        mapsUrl: settings.contact_maps || D.contact.mapsUrl
      },
      loginModal: D.loginModal, pageMeta: D.pageMeta, adminCreds: { user: settings.admin_user || 'rrk', pass: settings.admin_pass || 'admin1234' }
    };

    if (page === 'index') renderIndex(data);
    else if (page === 'menu') renderMenuPage(data);
    else if (page === 'craft') renderCraftPage(data);
    else if (page === 'raw') renderRawPage(data);
  });
}

function renderIndex(D) {
  document.getElementById('render-hero').innerHTML = `<section class="hero">
    <div class="saffron-particles" aria-hidden="true">${Array(8).fill('<div class="saffron-particle"></div>').join('')}</div>
    <div class="container hero__inner">
      <div class="hero__copy reveal reveal-slide-left"><span class="eyebrow">${D.hero.eyebrow}</span><h1 class="display">${D.hero.headlineL1}<br/>Crafted to <span class="gold">${D.hero.headlineGold}</span></h1><p class="lead">${D.hero.lead}</p>
        <div class="hero__cta"><a href="menu.html" class="btn btn--primary btn--lg">Order Now</a><a href="craft-my-plate.html" class="btn btn--gold-outline btn--lg">Craft My Plate</a></div>
        <div class="hero__stats">${D.heroStats.map(s=>`<div><strong data-count="${s.count}" data-suffix="${s.suffix}" data-duration="${s.duration}">${s.count}${s.suffix}</strong><span>${s.label}</span></div>`).join('')}</div>
      </div>
      <div class="hero__media reveal reveal-slide-right"><div class="hero__imgcard"><div class="img-ph img-ph--hero"><img src="${D.hero.image}" alt="Premium chicken" /></div><div class="badge-offer">${D.heroBadge.main}<br/><small>${D.heroBadge.sub}</small></div><div class="float-card"><span class="dot"></span> Freshly prepared</div></div></div>
    </div><div class="hero__glow"></div></section>`;

  const specialItems = D.menu.filter(m => m.special == '1' || m.special === true).slice(0, 4);
  document.getElementById('render-specials').innerHTML = `<section class="section"><div class="container">
    <div class="section__head reveal"><span class="eyebrow">Chef's Picks</span><h2>Today's Special</h2></div>
    <div class="grid grid--4">${specialItems.map((m,i)=>`
      <article class="food-card ${i%2===0?'cascade-left':'cascade-right'} reveal"><div class="img-ph"><img src="${m.image}" alt="${m.name}" loading="lazy" /></div>
      <div class="steam" aria-hidden="true"><div class="steam-vapor"></div><div class="steam-vapor"></div><div class="steam-vapor"></div></div>
      ${m.special_tag?`<span class="tag tag--offer">${m.special_tag}</span>`:''}
      <div class="food-card__body"><h3>${m.name}</h3><div class="price">₹${m.price}</div><a href="menu.html" class="btn btn--primary btn--block">Order</a></div></article>`
    ).join('')}</div></div></section>`;

  document.getElementById('render-about').innerHTML = `<section class="section section--soft" id="about"><div class="container split">
    <div class="split__media reveal reveal-slide-left"><div class="img-ph img-ph--tall"><img src="${D.about.image}" alt="Our kitchen" loading="lazy" /></div></div>
    <div class="split__copy reveal reveal-slide-right"><span class="eyebrow">${D.about.eyebrow}</span><h2>${D.about.headlineL1}<br/>${D.about.headlineL2}</h2><p>${D.about.body}</p><div class="gold-divider"></div><a href="#contact" class="btn btn--gold-outline">${D.about.buttonText}</a></div></div></section>`;

  document.getElementById('render-why-cards').innerHTML = `<section class="section"><div class="container">
    <div class="section__head reveal"><span class="eyebrow">${D.whySection.eyebrow}</span><h2>${D.whySection.headline}</h2></div>
    <div class="grid grid--5">${D.whyCards.map((w,i)=>`<div class="why-card reveal delay-${i+1}"><div class="why-ic">${w.icon}</div><h4>${w.title}</h4><p>${w.desc}</p></div>`).join('')}</div></div></section>`;

  document.getElementById('render-testimonials').innerHTML = `<section class="section section--soft testimonial-section"><div class="container">
    <div class="section__head reveal"><span class="eyebrow">What They Say</span><h2>Customer Love</h2></div>
    <div class="testimonial-viewport" style="overflow:hidden;border-radius:32px"><div class="testimonial-track">${D.testimonials.map(t=>`
      <div class="testimonial-card"><div class="testimonial-avatar">${t.avatar}</div><div class="stars">${getStars(t.stars)}</div><p class="quote">"${t.quote}"</p><div class="author">${t.author}<span>${t.subtitle}</span></div></div>`
    ).join('')}</div></div>
    <div class="testimonial-dots">${D.testimonials.map((_,i)=>`<button class="${i===0?'active':''}" aria-label="Testimonial ${i+1}"></button>`).join('')}</div>
    <div class="testimonial-arrows"><button class="testimonial-prev" aria-label="Previous">←</button><button class="testimonial-next" aria-label="Next">→</button></div></div></section>`;

  document.getElementById('render-craft-preview').innerHTML = `<section class="section"><div class="container craft-preview glass reveal reveal-scale">
    <div class="craft-preview__copy"><span class="eyebrow">${D.craftPreview.eyebrow}</span><h2>${D.craftPreview.headline}</h2><p>${D.craftPreview.desc}</p><a href="craft-my-plate.html" class="btn btn--primary btn--lg">${D.craftPreview.buttonText}</a></div>
    <div class="craft-preview__ui">${(D.craftPreview.chips||[]).map(c=>`<div class="mini-chip">${c.emoji} ${c.text}</div>`).join('')}<div class="mini-combo">${D.craftPreview.comboText}</div></div></div></section>`;

  const previewRaw = D.raw.slice(0, 3);
  document.getElementById('render-raw-preview').innerHTML = `<section class="section section--soft"><div class="container">
    <div class="section__head reveal"><span class="eyebrow">Fresh Today</span><h2>Raw Chicken</h2></div>
    <div class="grid grid--3">${previewRaw.map((r,i)=>`<article class="food-card reveal delay-${i+1}"><div class="img-ph"><img src="${r.image}" alt="${r.name}" loading="lazy" /></div><span class="tag tag--fresh">${r.tag||'Fresh Today'}</span><div class="food-card__body"><h3>${r.name}</h3><div class="price">₹${r.price} <small>/kg</small></div><a href="raw-chicken.html" class="btn btn--primary btn--block">View</a></div></article>`).join('')}</div></div></section>`;

  document.getElementById('render-instagram').innerHTML = `<section class="section"><div class="container">
    <div class="section__head reveal"><span class="eyebrow">Follow Us</span><h2>From Our Kitchen</h2></div>
    <div class="ig-grid">${D.instagram.map((ig,i)=>`<div class="ig-card reveal delay-${(i%3)+1}" tabindex="0"><img src="${ig.image}" alt="${ig.caption}" loading="lazy" /><div class="ig-overlay"><span>${ig.caption}</span></div></div>`).join('')}</div></div></section>`;

  document.getElementById('render-contact').innerHTML = `<section class="section" id="contact"><div class="container split">
    <div class="reveal reveal-slide-left"><iframe class="map-embed" title="RRK Chicken Location" src="${D.contact.mapsUrl}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    <div class="contact-card reveal reveal-slide-right"><h3>Visit &amp; Order</h3><ul class="contact-list">
      <li><span>📞 Phone</span><b>${D.contact.phone}</b></li><li><span>💬 WhatsApp</span><b>${D.contact.whatsapp}</b></li>
      <li><span>📍 Address</span><b>${D.contact.address}</b></li><li><span>🕒 Hours</span><b>${D.contact.hours}</b></li></ul>
      <a href="https://wa.me/${D.contact.phoneRaw||D.whatsapp}" class="btn btn--wa btn--block" target="_blank" rel="noopener">Chat on WhatsApp</a></div></div></section>`;

  document.getElementById('render-login-modal').innerHTML = `<div class="modal__backdrop" data-close></div><div class="modal__card glass">
    <button class="modal__x" data-close aria-label="Close">&times;</button><span class="eyebrow">${D.loginModal.eyebrow}</span><h3>${D.loginModal.headline}</h3><p class="muted">${D.loginModal.desc}</p>
    <form id="loginForm" class="form"><input type="text" placeholder="Full Name" required /><input type="tel" placeholder="Phone Number" pattern="[0-9]{10}" required /><input type="date" required /><button type="submit" class="btn btn--primary btn--block btn--lg">Continue</button></form>
    <ul class="benefits">${(D.loginModal.benefits||[]).map(b=>`<li>${b}</li>`).join('')}</ul><p class="tiny muted">${D.loginModal.privacy}</p></div>`;
}

function renderMenuPage(D) {
  const cats = ['all','chicken','biryani','starters','meals','family','beverages','desserts'];
  const labels = {all:'All',chicken:'Chicken',biryani:'Biryani',starters:'Starters',meals:'Meals',family:'Family Packs',beverages:'Beverages',desserts:'Desserts'};
  document.getElementById('render-menu').innerHTML = `<section class="section"><div class="container">
    <div class="section__head reveal"><span class="eyebrow">${D.pageMeta?.menu?.eyebrow||'Explore'}</span><h2>${D.pageMeta?.menu?.headline||'Our Menu'}</h2></div>
    <div class="cats reveal">${cats.map((c,i)=>`<button class="cat ${i===0?'active':''}" onclick="filterCat('${c}',this)">${labels[c]||c}</button>`).join('')}</div>
    <div class="grid grid--4">${D.menu.map((m,i)=>`<article class="food-card ${i%2===0?'cascade-left':'cascade-right'} reveal" data-cat="${m.category||''}">
      <div class="img-ph"><img src="${m.image}" alt="${m.name}" loading="lazy" /></div>
      <div class="steam" aria-hidden="true"><div class="steam-vapor"></div><div class="steam-vapor"></div><div class="steam-vapor"></div></div>
      <div class="food-card__body"><span class="tag--${m.diet==='veg'?'veg':'nonveg'}"><span class="veg-ic ${m.diet==='nonveg'?'veg-ic--non':''}"></span>${m.diet==='veg'?'Veg':'Non-Veg'}</span><h3>${m.name}</h3><p class="muted" style="font-size:14px">${m.description||''}</p><div class="price">₹${m.price}</div><button class="btn btn--primary btn--block" onclick="addToCart('${(m.name||'').replace(/'/g,"\\'")}',${m.price||0})">Add to Cart</button></div></article>`).join('')}</div>
    <div class="section-foil-divider" aria-hidden="true"></div>
    <div class="qr-card reveal-scale" style="margin-top:60px"><span class="eyebrow">Scan &amp; Order</span><h3>QR Menu</h3><div class="qr-box"></div><p class="muted">Scan to open this menu on your phone.</p></div></div></section>`;
}

function renderCraftPage(D) {
  document.getElementById('render-craft').innerHTML = `<section class="section"><div class="container">
    <div class="section__head reveal"><span class="eyebrow">${D.pageMeta?.craft?.eyebrow||'AI-Powered'}</span><h2>${D.pageMeta?.craft?.headline||'Craft My Plate'}</h2><p class="muted">${D.pageMeta?.craft?.subhead||''}</p></div>
    <div class="steps">
      <div class="step cascade-left reveal"><div class="step__num">1</div><h4>Number of People</h4><input type="range" min="${D.craftConfig.peopleMin}" max="${D.craftConfig.peopleMax}" value="${D.craftConfig.peopleDefault}" class="range" id="people" oninput="document.getElementById('peopleVal').textContent=this.value" /><p class="muted">Serving <b id="peopleVal">${D.craftConfig.peopleDefault}</b> people</p></div>
      <div class="step cascade-right reveal"><div class="step__num">2</div><h4>Your Budget</h4><input type="range" min="${D.craftConfig.budgetMin}" max="${D.craftConfig.budgetMax}" step="${D.craftConfig.budgetStep}" value="${D.craftConfig.budgetDefault}" class="range" id="budget" oninput="document.getElementById('budgetVal').textContent=this.value" /><p class="muted">Budget ₹<b id="budgetVal">${D.craftConfig.budgetDefault}</b></p></div>
      <div class="step cascade-left reveal"><div class="step__num">3</div><h4>Occasion</h4><div class="chips">${D.occasions.map((o,i)=>`<span class="chip ${i===0?'active':''}" data-group="occ" onclick="pickChip(this,'occ')">${o.emoji} ${o.label}</span>`).join('')}</div></div></div>
    <div class="section-foil-divider" aria-hidden="true"></div>
    <div class="section__head reveal" style="margin-top:56px"><span class="eyebrow">Recommended for you</span><h2 style="font-size:30px">Suggested Combos</h2></div>
    <div class="suggest">${D.combos.map((c,i)=>`<div class="suggest-card reveal delay-${i+1}"><span class="save-badge">${c.save_badge||''}</span><h3>${c.name}</h3><p class="muted">${c.description||''}</p><div class="price">₹${c.price}</div><button class="btn btn--primary btn--block" onclick="pickCombo('${(c.name||'').replace(/'/g,"\\'")}',${c.price||0})">Select</button></div>`).join('')}</div>
    <div class="summary-card reveal-scale" id="summary" style="display:none"><span class="eyebrow" style="color:#ffe9b0">Your Plate</span><h3 id="comboName">—</h3><div class="big" id="comboPrice">₹0</div><button class="btn btn--wa btn--block btn--lg" onclick="confirmCraft()">Confirm on WhatsApp</button></div></div></section>`;
}

function renderRawPage(D) {
  document.getElementById('render-raw').innerHTML = `<section class="section"><div class="container">
    <div class="section__head reveal"><span class="eyebrow">${D.pageMeta?.raw?.eyebrow||'Farm Fresh'}</span><h2>${D.pageMeta?.raw?.headline||'Raw Chicken'}</h2><p class="muted">${D.pageMeta?.raw?.subhead||''}</p></div>
    <div class="grid grid--4">${D.raw.map((r,i)=>`<article class="food-card ${i%2===0?'cascade-left':'cascade-right'} reveal"><div class="img-ph"><img src="${r.image}" alt="${r.name}" loading="lazy" /></div><span class="tag tag--fresh">${r.tag||'Fresh Today'}</span><div class="food-card__body"><h3>${r.name}</h3><div class="price">₹${r.price} <small>/kg</small></div><button class="btn btn--wa btn--block" onclick="orderRaw('${r.name}')">WhatsApp Order</button></div></article>`).join('')}</div>
    <div class="section-foil-divider" aria-hidden="true"></div>
    <div class="reveal" style="margin-top:56px"><table class="pricing-table"><thead><tr><th>Item</th><th>Weight</th><th>Price</th><th>Availability</th></tr></thead><tbody>${D.raw.map(r=>`<tr><td>${r.name}</td><td>${r.weight}</td><td>₹${r.price}</td><td>✅ ${r.tag||'Fresh Today'}</td></tr>`).join('')}</tbody></table></div></div></section>`;
}
