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
  var p = rrkSettings.get().then(function(settings) {
    if (settings.whatsapp) RRK_CONFIG.whatsapp = settings.whatsapp;
    if (settings.contact_phone) { RRK_CONFIG.phone = settings.contact_phone.replace(/^\+/, '').replace(/\s/g, ''); RRK_CONFIG.phoneRaw = settings.contact_phone.replace(/[\s+]/g, ''); }
    if (settings.brand_name) RRK_CONFIG.brandName = settings.brand_name;
    if (settings.brand_tagline) RRK_CONFIG.tagline = settings.brand_tagline;
    RRK_CONFIG.loaded = true;
    RRK_CONFIG._loading = null;
    // Update all WA links on page
    setTimeout(function() {
      document.querySelectorAll('.wa-link').forEach(function(el) {
        el.href = 'https://wa.me/' + RRK_CONFIG.whatsapp;
      });
      var ft = document.getElementById('footerTagline');
      if (ft && RRK_CONFIG.tagline) ft.textContent = RRK_CONFIG.tagline;
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

// Auto-load on script init
loadRRKConfig();

function refreshFooterFromSettings(s) {
  if (!s) return;
  var ig = document.getElementById('socialIg'); if (ig && s.social_instagram) ig.href = s.social_instagram;
  var fb = document.getElementById('socialFb'); if (fb && s.social_facebook) fb.href = s.social_facebook;
  var yt = document.getElementById('socialYt'); if (yt && s.social_youtube) yt.href = s.social_youtube;
  var bar = document.getElementById('footerBar'); if (bar && s.footer_copyright) bar.textContent = s.footer_copyright;
}
