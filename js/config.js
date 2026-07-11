// ============================================
// RRK CONFIG — Single source of truth
// Reads from Firestore, falls back to defaults
// Admin can update via CMS → Settings tab
// ============================================

var RRK_CONFIG = {
  whatsapp: '919999999999',
  phone: '+91 99999 99999',
  phoneRaw: '919999999999',
  brandName: 'RRK Food Court',
  tagline: 'Eluru\'s premier food court destination.',
  loaded: false
};

function getWhatsappLink() {
  return 'https://wa.me/' + RRK_CONFIG.whatsapp;
}

function loadRRKConfig() {
  if (typeof rrkSettings === 'undefined') { RRK_CONFIG.loaded = true; return Promise.resolve(RRK_CONFIG); }
  return rrkSettings.get().then(function(settings) {
    if (settings.whatsapp) RRK_CONFIG.whatsapp = settings.whatsapp;
    if (settings.contact_phone) { RRK_CONFIG.phone = settings.contact_phone.replace(/^\+/, '').replace(/\s/g, ''); RRK_CONFIG.phoneRaw = settings.contact_phone.replace(/[\s+]/g, ''); }
    if (settings.brand_name) RRK_CONFIG.brandName = settings.brand_name;
    if (settings.brand_tagline) RRK_CONFIG.tagline = settings.brand_tagline;
    RRK_CONFIG.loaded = true;
    // Update all WA links on page
    setTimeout(function() {
      document.querySelectorAll('.wa-link').forEach(function(el) {
        el.href = 'https://wa.me/' + RRK_CONFIG.whatsapp;
      });
      var ft = document.getElementById('footerTagline');
      if (ft && RRK_CONFIG.tagline) ft.textContent = RRK_CONFIG.tagline;
    }, 200);
    return RRK_CONFIG;
  }).catch(function() {
    RRK_CONFIG.loaded = true;
    return RRK_CONFIG;
  });
}

// Auto-load on script init
loadRRKConfig();
