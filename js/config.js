// ============================================
// RRK CONFIG — Single source of truth
// Reads from Firestore, falls back to defaults
// Admin can update via CMS → Settings tab
// ============================================

var RRK_CONFIG = {
  whatsapp: '919866631761',
  phone: '+91 98666 31761',
  phoneRaw: '919866631761',
  brandName: 'RRK Food Court',
  tagline: 'Eluru\'s premier food court destination.',
  loaded: false
};

function getWhatsappLink() {
  return 'https://wa.me/' + RRK_CONFIG.whatsapp;
}

function loadRRKConfig() {
  if (RRK_CONFIG._loading) return RRK_CONFIG._loading;
  if (typeof rrkSettings === 'undefined') { RRK_CONFIG.loaded = true; return Promise.resolve(RRK_CONFIG); }
  var defaultBrand = RRK_CONFIG.brandName;
  var p = rrkSettings.get().then(function(settings) {
    if (settings.whatsapp) RRK_CONFIG.whatsapp = settings.whatsapp;
    if (settings.contact_phone) { RRK_CONFIG.phone = settings.contact_phone.replace(/^\+/, '').replace(/\s/g, ''); RRK_CONFIG.phoneRaw = settings.contact_phone.replace(/[\s+]/g, ''); }
    if (settings.brand_name) RRK_CONFIG.brandName = settings.brand_name;
    if (settings.brand_tagline) RRK_CONFIG.tagline = settings.brand_tagline;
    RRK_CONFIG.loaded = true;
    RRK_CONFIG._loading = null;
    // Update all WA links on page + brand name if changed
    setTimeout(function() {
      document.querySelectorAll('.wa-link').forEach(function(el) {
        el.href = 'https://wa.me/' + RRK_CONFIG.whatsapp;
      });
      var ft = document.getElementById('footerTagline');
      if (ft && RRK_CONFIG.tagline) ft.textContent = RRK_CONFIG.tagline;
      if (defaultBrand !== RRK_CONFIG.brandName) updateBrandNameAcrossPage(defaultBrand);
    }, 200);
    refreshFooterFromSettings(settings);
    return RRK_CONFIG;
  }).catch(function() {
    RRK_CONFIG.loaded = true;
    RRK_CONFIG._loading = null;
    return RRK_CONFIG;
  });
  RRK_CONFIG._loading = p;
  return p;
}

function updateBrandNameAcrossPage(oldName) {
  var newName = RRK_CONFIG.brandName;
  // Page title
  if (document.title.indexOf(oldName) !== -1) document.title = document.title.replace(oldName, newName);
  // Meta tags
  var m = document.querySelector('meta[name="description"]');
  if (m && m.content.indexOf(oldName) !== -1) m.content = m.content.replace(oldName, newName);
  m = document.querySelector('meta[property="og:title"]');
  if (m && m.content.indexOf(oldName) !== -1) m.content = m.content.replace(oldName, newName);
  m = document.querySelector('meta[name="author"]');
  if (m && m.content.indexOf(oldName) !== -1) m.content = m.content.replace(oldName, newName);
  // JSON-LD schema
  var ld = document.querySelector('script[type="application/ld+json"]');
  if (ld) {
    try { var d = JSON.parse(ld.textContent); if (d.name && d.name.indexOf(oldName) !== -1) { d.name = d.name.replace(oldName, newName); ld.textContent = JSON.stringify(d); } } catch(e) {}
  }
  // Logo — split into mark (first part) and word (rest)
  var parts = newName.split(' ');
  var mark = parts[0];
  var word = parts.length > 1 ? parts.slice(1).join(' ') : '';
  document.querySelectorAll('.logo__mark').forEach(function(el) { el.textContent = mark; });
  document.querySelectorAll('.logo__word').forEach(function(el) { el.textContent = word; });
  document.querySelectorAll('.logo[aria-label]').forEach(function(el) {
    el.setAttribute('aria-label', newName + ' Home');
  });
  // Footer bar if copyright contains old brand name
  var bar = document.getElementById('footerBar');
  if (bar && bar.textContent.indexOf(oldName) !== -1) {
    bar.textContent = bar.textContent.replace(oldName, newName);
  }
}

// Auto-load on script init
loadRRKConfig();

function refreshFooterFromSettings(s) {
  if (!s) return;
  var ig = document.getElementById('socialIg'); if (ig && s.social_instagram) ig.href = s.social_instagram;
  var fb = document.getElementById('socialFb'); if (fb && s.social_facebook) fb.href = s.social_facebook;
  var yt = document.getElementById('socialYt'); if (yt && s.social_youtube) yt.href = s.social_youtube;
  var bar = document.getElementById('footerBar'); if (bar && s.footer_copyright) bar.textContent = s.footer_copyright;
}
