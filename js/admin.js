// ============================================
// RRK ADMIN CMS — Firestore Backend
// ============================================
var adminAudioCtx = null;
function getAdminAudioCtx() {
  if (!adminAudioCtx) {
    try { adminAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  return adminAudioCtx;
}
(function initAdminAudioUnlock() {
  var unlocked = false;
  function unlock() {
    if (unlocked) return;
    var ctx = getAdminAudioCtx();
    if (!ctx) return;
    unlocked = true;
    if (ctx.state === 'suspended') {
      ctx.resume().then(function() {});
    }
    var buf = ctx.createBuffer(1,1,22050);
    var src = ctx.createBufferSource(); src.buffer = buf;
    src.connect(ctx.destination); src.start(0);
  }
  document.addEventListener('click', unlock, {once: true});
  document.addEventListener('touchstart', unlock, {once: true});
  document.addEventListener('keydown', unlock, {once: true});
})();
function adminTapVibe(dur) {
  try { if (navigator.vibrate) navigator.vibrate(dur || 15); } catch(e) {}
}
var adminHapticLast = 0;
function adminHaptic(type) {
  var now = Date.now();
  if (now - adminHapticLast < 50) return;
  adminHapticLast = now;
  adminTapVibe();
  try {
    var ctx = getAdminAudioCtx(); if (!ctx) return;
    if (ctx.state === 'suspended') { ctx.resume(); return; }
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    var now = ctx.currentTime;
    switch (type) {
      case 'click':
        o.type = 'sine'; o.frequency.setValueAtTime(800, now);
        o.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
        g.gain.setValueAtTime(0.25, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        o.start(now); o.stop(now + 0.07);
        break;
      case 'add':
        o.type = 'sine'; o.frequency.setValueAtTime(500, now);
        o.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
        g.gain.setValueAtTime(0.30, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
        o.start(now); o.stop(now + 0.10);
        break;
      case 'remove':
        o.type = 'triangle'; o.frequency.setValueAtTime(900, now);
        o.frequency.exponentialRampToValueAtTime(350, now + 0.10);
        g.gain.setValueAtTime(0.22, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        o.start(now); o.stop(now + 0.12);
        break;
      case 'confirm':
        o.type = 'sine';
        o.frequency.setValueAtTime(587, now); o.frequency.setValueAtTime(740, now + 0.08);
        o.frequency.setValueAtTime(880, now + 0.16);
        g.gain.setValueAtTime(0.28, now); g.gain.setValueAtTime(0.28, now + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        o.start(now); o.stop(now + 0.28);
        break;
      case 'open':
        o.type = 'sine'; o.frequency.setValueAtTime(350, now);
        o.frequency.exponentialRampToValueAtTime(900, now + 0.12);
        g.gain.setValueAtTime(0.18, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        o.start(now); o.stop(now + 0.15);
        break;
      case 'close':
        o.type = 'sine'; o.frequency.setValueAtTime(600, now);
        o.frequency.exponentialRampToValueAtTime(250, now + 0.06);
        g.gain.setValueAtTime(0.20, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        o.start(now); o.stop(now + 0.08);
        break;
      case 'error':
        o.type = 'square'; o.frequency.setValueAtTime(180, now);
        g.gain.setValueAtTime(0.14, now); g.gain.setValueAtTime(0.14, now + 0.10);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        o.start(now); o.stop(now + 0.15);
        break;
    }
  } catch(e) {}
}
const ADMIN_KEY = 'rrk_admin_session';

function adminError(elId, msg) {
  var el = elId ? document.getElementById(elId) : null;
  if (el) el.innerHTML = '<p class="muted" style="color:#C1121F">❌ '+(msg||'Failed to load. Check your connection and refresh.')+'</p>';
}

function loadAdminApp() {
  document.querySelectorAll('.cms-panel').forEach(p => p.style.display = 'none');
  document.getElementById('cms-menu').style.display = 'block';
  renderMenuEditor();
  renderCraftEditor();
  renderRawEditor();
  renderOrdersEditor();
  renderOccasionEditor();
  renderCustomersEditor();
  renderReviewsEditor();
  renderSocialEditor();
  renderSettingsEditor();
  // Sync categories to localStorage so public pages use them
  if (typeof rrkCategories !== 'undefined') rrkCategories.syncToLocal();
  // Request notification permission for order alerts
  if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function showTab(tabId) {
  adminHaptic('click');
  document.querySelectorAll('.cms-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.cms-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('cms-' + tabId);
  const tab = document.querySelector(`.cms-tab[data-tab="${tabId}"]`);
  if (panel) panel.style.display = 'block';
  if (tab) tab.classList.add('active');
}

function seedAdminData() {
  adminHaptic('click');
  if (!confirm('This will add the default menu, raw items, occasions and categories to Firestore once. Existing items will not be overwritten. Continue?')) return;
  Promise.all([
    typeof seedCategoriesToFirestore === 'function' ? seedCategoriesToFirestore() : Promise.resolve(),
    typeof seedMenuToFirestore === 'function' ? seedMenuToFirestore() : Promise.resolve(),
    typeof seedRawToFirestore === 'function' ? seedRawToFirestore() : Promise.resolve(),
    typeof seedOccasionsToFirestore === 'function' ? seedOccasionsToFirestore() : Promise.resolve()
  ]).then(function() {
    alert('Default data seeded successfully. Reloading editors.');
    renderMenuEditor();
    renderRawEditor();
    renderOccasionEditor();
    if (typeof rrkCategories !== 'undefined') rrkCategories.syncToLocal();
  }).catch(function(e) {
    console.error(e);
    alert('Seed failed. Check console.');
  });
}

// ============ MENU ============
var adminActiveMenuCat = 'all';
var adminMenuCategories = [];

function loadMenuCategories() {
  try {
    var stored = localStorage.getItem('rrk_menu_cats');
    if (stored) {
      var parsed = JSON.parse(stored);
      if (parsed.length > 0) { adminMenuCategories = parsed; return; }
    }
  } catch(e) {}
  adminMenuCategories = (typeof getMenuCategoriesBase === 'function') ? getMenuCategoriesBase() : [
    {key:'starters',label:'🍗 Starters',order:0},{key:'kaju-pakodi',label:'🥜 Kaju Pakodi',order:1},
    {key:'manchuria',label:'🥘 Manchuria',order:2},{key:'biryani',label:'🍚 Biryani',order:3},
    {key:'fried-rice',label:'🍛 Fried Rice',order:4},{key:'noodles',label:'🍜 Noodles',order:5},
    {key:'roti-curry',label:'🍲 Roti & Curry',order:6},{key:'breads',label:'🍞 Breads',order:7},
    {key:'ice-creams',label:'🍦 Ice Creams',order:8}
  ];
}

function renderMenuEditor() {
  var el = document.getElementById('cms-menu'); if (!el) return;
  loadMenuCategories();
  el.innerHTML = '<h3 style="margin-bottom:16px">Menu Items</h3><p class="muted">Loading...</p>';
  rrkMenu.list().then(function(items) {
    window.__adminMenuItems = items;
    var catBtns = '<button class="cms-cat-btn active" onclick="filterAdminMenu(\'all\',this)">All</button>'+
      adminMenuCategories.map(function(c){return'<button class="cms-cat-btn" onclick="filterAdminMenu(\''+c.key+'\',this)">'+c.label+'</button>'}).join('');
    el.innerHTML = '<div style="display:flex;gap:10px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--border)">'+
      '<button class="btn btn--primary" onclick="addMenuDoc()">+ Add Menu Item</button>'+
      '<button class="btn btn--gold-outline" onclick="addCategoryDocInline()">+ Add Category</button>'+
      '</div>'+
      '<h3 style="margin-bottom:12px">Menu Items ('+items.length+')</h3>'+
      '<div class="cms-cats">'+catBtns+'</div>'+
      '<div class="cms-list" id="cms-menu-list"></div>'+
      '<div style="margin-top:28px;padding-top:20px;border-top:1px solid var(--border)" id="cms-menu-cats-inline"></div>';
    renderAdminMenuList(items, adminActiveMenuCat);
    renderCategoriesInline();
  }).catch(function() { adminError('cms-menu', 'Failed to load menu items.'); });
}

function renderAdminMenuList(items, cat) {
  var list = document.getElementById('cms-menu-list');
  if (!list) return;
  var filtered = cat === 'all' ? items : items.filter(function(m){return m.category===cat;});
  if (filtered.length === 0) { list.innerHTML = '<p class="muted" style="padding:20px;text-align:center">No items in this category.</p>'; return; }
  list.innerHTML = filtered.map(function(m){
    var chefBadge = m.special==='1' ? '<span style="display:inline-block;background:#D4AF37;color:#5a4300;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;margin-left:6px">★ Chef\'s Pick</span>' : '';
    var todayBadge = m.today_special==='1' ? '<span style="display:inline-block;background:#C1121F;color:#fff;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;margin-left:4px">Today\'s Special</span>' : '';
    var todayBtn = m.today_special==='1'
      ? '<button class="btn" style="padding:4px 10px;font-size:11px;background:#9E0E19;color:#fff;border:none;border-radius:6px;margin-right:6px" onclick="toggleTodaySpecial(\''+m.id+'\',0)" title="Remove from Today\'s Special">Remove</button>'
      : '<button class="btn" style="padding:4px 10px;font-size:11px;background:#C1121F;color:#fff;border:none;border-radius:6px;margin-right:6px" onclick="toggleTodaySpecial(\''+m.id+'\',1)" title="Show on Today\'s Special">Today\'s Special</button>';
    return '<div class="cms-item"><div class="cms-item-info"><img src="'+(m.image||'')+'" alt="'+m.name+'" onerror="this.style.display=\'none\'" class="cms-item-img" /><div><b>'+m.name+chefBadge+todayBadge+'</b><span>'+(m.category||'')+' · ₹'+(m.price||0)+' · '+(m.diet==='veg'?'🟢 Veg':'Non-Veg')+'</span></div></div>'+
      '<div class="cms-item-actions">'+todayBtn+'<button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editMenuDoc(\''+m.id+'\')">Edit</button><button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteMenuDoc(\''+m.id+'\')">Delete</button></div></div>';
  }).join('');
}

function toggleTodaySpecial(id, val) {
  adminHaptic('click');
  rrkMenu.save({ id: id, today_special: val === 1 ? '1' : '0' }).then(function() {
    renderMenuEditor();
  });
}

function filterAdminMenu(cat, btn) {
  adminActiveMenuCat = cat;
  adminHaptic('click');
  document.querySelectorAll('.cms-cat-btn').forEach(function(b){b.classList.remove('active');});
  if (btn) btn.classList.add('active');
  renderAdminMenuList(window.__adminMenuItems||[], cat);
}

function menuFields(item) {
  loadMenuCategories();
  var catOpts = adminMenuCategories.map(function(c){var sel=c.key===item.category?' selected':'';return'<option value="'+c.key+'"'+sel+'>'+c.label+'</option>'}).join('');
  return [
    { key: 'name', label: 'Name', type: 'text', val: item.name||'' },
    { key: 'category', label: 'Category', type: 'select', val: item.category||'', optionsHtml: catOpts },
    { key: 'diet', label: 'Diet', type: 'select', val: item.diet||'nonveg', optionsHtml: '<option value="nonveg"'+(item.diet==='nonveg'?' selected':'')+'>Non-Veg</option><option value="veg"'+(item.diet==='veg'?' selected':'')+'>Veg</option>' },
    { key: 'description', label: 'Description', type: 'text', val: item.description||'' },
    { key: 'price', label: 'Price (₹)', type: 'number', val: item.price||0 },
    { key: 'craftEnabled', label: 'Show in Craft My Plate?', type: 'toggle', val: item.craftEnabled?'1':'0' },
    { key: 'image', label: 'Image URL', type: 'text', val: item.image||'', preview: true },
    { key: 'special', label: 'Chef\'s Pick? (Appears in "Chef\'s Picks" section)', type: 'select', val: item.special||'0', optionsHtml: '<option value="1"'+(item.special==='1'?' selected':'')+'>Yes</option><option value="0"'+(item.special!=='1'?' selected':'')+'>No</option>' },
    { key: 'today_special', label: 'Today\'s Special? (Appears in "Today\'s Special" section)', type: 'select', val: item.today_special||'0', optionsHtml: '<option value="1"'+(item.today_special==='1'?' selected':'')+'>Yes</option><option value="0"'+(item.today_special!=='1'?' selected':'')+'>No</option>' },
    { key: 'special_tag', label: 'Special Badge Text', type: 'text', val: item.special_tag||'' }
  ];
}

function editMenuDoc(id) {
  adminHaptic('click');
  rrkMenu.list().then(items => {
    const item = items.find(m => m.id === id); if (!item) return;
    showItemEditor('Menu Item', menuFields(item), (vals) => {
      vals.craftEnabled = vals.craftEnabled === '1' || vals.craftEnabled === 'true' || vals.craftEnabled === true;
      vals.craftCategory = vals.category;
      delete vals.craftPrice;
      rrkMenu.save({ id, ...vals }).then(() => renderMenuEditor());
    });
  });
}

function addMenuDoc() {
  adminHaptic('add');
  const item = {};
  showItemEditor('New Menu Item', menuFields(item), (vals) => {
    vals.craftEnabled = vals.craftEnabled === '1' || vals.craftEnabled === 'true' || vals.craftEnabled === true;
    vals.craftCategory = vals.category;
    delete vals.craftPrice;
    rrkMenu.save(vals).then(() => renderMenuEditor());
  });
}

function deleteMenuDoc(id) {
  adminHaptic('remove');
  if (!confirm('Delete?')) return;
  rrkMenu.remove(id).then(() => renderMenuEditor());
}

// ============ INLINE CATEGORIES (within Menu tab) ============
function renderCategoriesInline() {
  var el = document.getElementById('cms-menu-cats-inline');
  if (!el) return;
  loadMenuCategories();
  el.innerHTML = '<h4 style="margin-bottom:8px">Manage Categories</h4>'+
    '<div class="cms-list" id="cms-inline-cats">'+renderCategoryListInline(adminMenuCategories)+'</div>';
}

function renderCategoryListInline(items) {
  if (!items || items.length === 0) return '<p class="muted" style="padding:12px">No categories.</p>';
  return items.map(function(c){
    if (c.id) {
      return '<div class="cms-item"><div><b>'+c.label+'</b><span>Key: '+c.key+'</span></div>'+
        '<div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editCategoryDocInline(\''+c.id+'\')">Edit</button>'+
        '<button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteCategoryDocInline(\''+c.id+'\')">Delete</button></div></div>';
    } else {
      return '<div class="cms-item"><div><b>'+c.label+'</b><span>Key: '+c.key+' (sync to Firestore first)</span></div></div>';
    }
  }).join('');
}

function addCategoryDocInline() {
  adminHaptic('add');
  showItemEditor('New Menu Category', [
    { key: 'label', label: 'Display Name (e.g. "🐔 Chicken")', type: 'text', val: '' }
  ], function(vals){
    var autoKey = vals.label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'new-cat';
    var maxOrder = adminMenuCategories.reduce(function(max, c) { return Math.max(max, c.order || 0); }, 0);
    rrkCategories.save({ type: 'menu', key: autoKey, label: vals.label, order: maxOrder + 1 }).then(function(){
      rrkCategories.syncToLocal().then(function(){
        loadMenuCategories();
        renderMenuEditor();
        renderCategoriesInline();
      });
    });
  });
}

function editCategoryDocInline(id) {
  adminHaptic('click');
  rrkCategories.list().then(function(items){
    var item = items.find(function(c){return c.id===id;}); if(!item) return;
    showItemEditor('Edit Category', [
      { key: 'label', label: 'Display Name', type: 'text', val: item.label||'' }
    ], function(vals){
      var autoKey = vals.label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || item.key;
      rrkCategories.save({id:id, type:'menu', key:autoKey, label:vals.label, order: item.order}).then(function(){
        rrkCategories.syncToLocal().then(function(){
          loadMenuCategories();
          renderMenuEditor();
          renderCategoriesInline();
        });
      });
    });
  });
}

function deleteCategoryDocInline(id) {
  adminHaptic('remove');
  if(!confirm('Delete this category? Items will still exist but the filter tab will be removed.')) return;
  rrkCategories.remove(id).then(function(){
    rrkCategories.syncToLocal().then(function(){
      loadMenuCategories();
      renderMenuEditor();
      renderCategoriesInline();
    });
  });
}

// ============ CRAFT MY PLATE EDITOR ============
var adminActiveCraftCat = 'all';
var adminCraftCategories = [];

function loadCraftCategories() {
  loadMenuCategories();
  adminCraftCategories = adminMenuCategories;
}

function renderCraftEditor() {
  var el = document.getElementById('cms-craft'); if (!el) return;
  loadCraftCategories();
  el.innerHTML = '<h3 style="margin-bottom:16px">Craft My Plate — Enable/Disable Items</h3><p class="muted">Loading...</p>';
  rrkMenu.list().then(function(items) {
    window.__adminCraftItems = items;
    var catBtns = '<button class="cms-cat-btn active" onclick="filterAdminCraft(\'all\',this)">All</button>'+
      adminCraftCategories.map(function(c){return'<button class="cms-cat-btn" onclick="filterAdminCraft(\''+c.key+'\',this)">'+c.label+'</button>'}).join('');
    el.innerHTML = '<h3 style="margin-bottom:8px">Craft My Plate — Enable/Disable Items</h3>'+
      '<p class="muted" style="margin-bottom:16px">Toggle which menu items appear in Craft My Plate. Menu prices are used.</p>'+
      '<div class="cms-cats">'+catBtns+'</div>'+
      '<div class="cms-list" id="cms-craft-list"></div>';
    renderAdminCraftList(items, adminActiveCraftCat);
  });
}

function renderAdminCraftList(items, cat) {
  var listEl = document.getElementById('cms-craft-list');
  if (!listEl) return;
  var filtered = cat === 'all' ? items : items.filter(function(m){return m.category===cat;});
  if (filtered.length === 0) { listEl.innerHTML = '<p class="muted" style="padding:20px;text-align:center">No items in this category.</p>'; return; }
  listEl.innerHTML = filtered.map(function(m){
    var catLabel = (adminCraftCategories.find(function(c){return c.key===m.category;}) || {}).label || (m.category||'—');
    var statusBadge = m.craftEnabled
      ? '<span style="display:inline-block;background:#2E7D32;color:#fff;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;margin-left:6px">Enabled</span>'
      : '<span style="display:inline-block;background:#888;color:#fff;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;margin-left:6px">Disabled</span>';
    return '<div class="cms-item" style="flex-wrap:nowrap">'+
      '<div class="cms-item-info"><img src="'+(m.image||'')+'" alt="'+m.name+'" class="cms-item-img"><div><b>'+m.name+statusBadge+'</b><span>Menu Price: ₹'+(m.price||0)+' · '+catLabel+'</span></div></div>'+
      '<button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;white-space:nowrap" onclick="editCraftItem(\''+m.id+'\')">Toggle</button>'+
    '</div>';
  }).join('');
}

function filterAdminCraft(cat, btn) {
  adminActiveCraftCat = cat;
  adminHaptic('click');
  document.querySelectorAll('#cms-craft .cms-cat-btn').forEach(function(b){b.classList.remove('active');});
  if (btn) btn.classList.add('active');
  renderAdminCraftList(window.__adminCraftItems||[], cat);
}

function craftFields(item) {
  return [
    { key: 'craftEnabled', label: 'Show in Craft My Plate?', type: 'toggle', val: item.craftEnabled?'1':'0' }
  ];
}

function editCraftItem(id) {
  adminHaptic('click');
  rrkMenu.list().then(function(items) {
    var item = items.find(function(m) { return m.id === id; }); if (!item) return;
    showItemEditor('Craft Settings: '+item.name, craftFields(item), function(vals) {
      vals.craftEnabled = vals.craftEnabled === '1' || vals.craftEnabled === 'true';
      rrkMenu.save({ id: id, craftEnabled: vals.craftEnabled, craftCategory: item.category }).then(function() { refreshCraftEditor(); });
    });
  });
}

function refreshCraftEditor() {
  loadCraftCategories();
  rrkMenu.list().then(function(items) {
    window.__adminCraftItems = items;
    var catsBar = document.querySelector('#cms-craft .cms-cats');
    if (catsBar) {
      var catBtns = '<button class="cms-cat-btn active" onclick="filterAdminCraft(\'all\',this)">All</button>'+
        adminCraftCategories.map(function(c){return'<button class="cms-cat-btn" onclick="filterAdminCraft(\''+c.key+'\',this)">'+c.label+'</button>'}).join('');
      catsBar.innerHTML = catBtns;
    }
    adminActiveCraftCat = 'all';
    renderAdminCraftList(items, adminActiveCraftCat);
  });
}

// ============ RAW ============
function renderRawEditor() {
  const el = document.getElementById('cms-raw'); if (!el) return;
  el.innerHTML = '<h3 style="margin-bottom:20px">Raw Chicken Items</h3><p class="muted">Loading...</p>';
  rrkRaw.list().then(items => {
    el.innerHTML = `<h3 style="margin-bottom:20px">Raw Chicken Items (${items.length})</h3>
      <div class="cms-list">${items.map(r =>`
        <div class="cms-item"><div class="cms-item-info"><img src="${r.image||''}" alt="${r.name}" class="cms-item-img" /><div><b>${r.name}</b><span>₹${r.price||0}/kg · ${r.weight||''} · ${r.tag||''}</span></div></div>
        <div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editRawDoc('${r.id}')">Edit</button><button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteRawDoc('${r.id}')">Delete</button></div></div>`
      ).join('')}</div><button class="btn btn--primary" style="margin-top:16px" onclick="addRawDoc()">+ Add Item</button>`;
  });
}

function rawFields(item) {
  return [
    { key: 'name', label: 'Name', type: 'text', val: item.name||'' },
    { key: 'price', label: 'Price (₹/kg)', type: 'number', val: item.price||0 },
    { key: 'weight', label: 'Weight', type: 'text', val: item.weight||'1 kg' },
    { key: 'image', label: 'Image URL', type: 'text', val: item.image||'', preview: true },
    { key: 'tag', label: 'Tag', type: 'text', val: item.tag||'Fresh Today' },
    { key: 'show_home', label: 'Show on Home Page?', type: 'toggle', val: item.show_home||'1' }
  ];
}

function editRawDoc(id) {
  adminHaptic('click');
  rrkRaw.list().then(items => {
    const item = items.find(r => r.id === id); if (!item) return;
    showItemEditor('Raw Item', rawFields(item), (vals) => rrkRaw.save({ id, ...vals }).then(() => renderRawEditor()));
  });
}

function addRawDoc() {
  adminHaptic('add');
  showItemEditor('New Raw Item', rawFields({}), (vals) => rrkRaw.save(vals).then(() => renderRawEditor()));
}

function deleteRawDoc(id) {
  adminHaptic('remove');
  if (!confirm('Delete?')) return;
  rrkRaw.remove(id).then(() => renderRawEditor());
}

// ============ ORDERS ============
var adminActiveOrderType = 'all';
var ordersLastDoc = null;
var ordersPageLimit = 50;
var ordersPollingInterval = null;
var lastOrderCount = 0;

function renderOrdersEditor() {
  var el = document.getElementById('cms-orders'); if (!el) return;
  ordersLastDoc = null;
  el.innerHTML = '<h3 style="margin-bottom:12px">Orders <span id="orders-status" style="font-size:11px;color:var(--muted);margin-left:8px">🔄 Live</span></h3>'+
    '<button class="btn btn--gold-outline" style="margin-bottom:12px;font-size:12px" onclick="downloadOrdersPDF()">📥 Download PDF</button>'+
    '<div class="cms-cats" id="orders-cats">'+
      '<button class="cms-cat-btn active" onclick="filterAdminOrders(\'all\',this)">All</button>'+
      '<button class="cms-cat-btn" onclick="filterAdminOrders(\'online\',this)">Online Order</button>'+
      '<button class="cms-cat-btn" onclick="filterAdminOrders(\'craft\',this)">Craft My Plate</button>'+
      '<button class="cms-cat-btn" onclick="filterAdminOrders(\'raw\',this)">Raw Chicken</button>'+
      '<button class="cms-cat-btn" onclick="filterAdminOrders(\'reservations\',this)">📅 Reservations</button>'+
    '</div>'+
    '<div id="orders-list"><p class="muted">Loading...</p></div>';

  if (typeof rrkOrders === 'undefined') { el.innerHTML += '<p class="muted">Firestore not connected</p>'; return; }
  if (rrkOrders.listPaginated) {
    loadOrdersPage();
  } else {
    rrkOrders.list().then(function(data) {
      window.__adminOrders = data || [];
      lastOrderCount = (data || []).length;
      renderAdminOrdersList(window.__adminOrders, adminActiveOrderType);
    }).catch(function() {
      document.getElementById('orders-list').innerHTML = '<p class="muted">Failed to load orders.</p>';
    });
  }
  // Start polling for new orders every 10 seconds
  startOrdersPolling();
}

function startOrdersPolling() {
  if (ordersPollingInterval) clearInterval(ordersPollingInterval);
  ordersPollingInterval = setInterval(pollForNewOrders, 60000);
}

function stopOrdersPolling() {
  if (ordersPollingInterval) { clearInterval(ordersPollingInterval); ordersPollingInterval = null; }
}

var lastPollTime = new Date().toISOString();

function pollForNewOrders() {
  if (typeof rrkOrders === 'undefined') return;
  var statusEl = document.getElementById('orders-status');
  if (statusEl) statusEl.textContent = '🔄 Checking...';
  var since = lastPollTime;
  lastPollTime = new Date().toISOString();
  rrkOrders.listRecent(since).then(function(orders) {
    if (statusEl) statusEl.textContent = '🔄 Live';
    if (orders.length > 0) {
      window.__adminOrders = orders.concat(window.__adminOrders || []);
      lastOrderCount = (window.__adminOrders || []).length;
      var wasCraft = orders[0] && orders[0].type === 'craft';
      playNewOrderAlert(orders.length, wasCraft);
      renderAdminOrdersList(window.__adminOrders, adminActiveOrderType);
    }
  }).catch(function() {
    if (statusEl) statusEl.textContent = '⚠️ Offline';
  });
}

function playNewOrderAlert(count, isCraft) {
  // Vibrate pattern for attention
  try { if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]); } catch(e) {}
  // Loud alarm sound — high volume, long duration
  try {
    var ctx = getAdminAudioCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    var now = ctx.currentTime;
    var duration = 3.0; // 3 seconds

    // Layer 1: Deep alarm tone
    var o1 = ctx.createOscillator();
    var g1 = ctx.createGain();
    o1.type = 'sawtooth';
    o1.frequency.setValueAtTime(440, now);
    o1.frequency.setValueAtTime(660, now + 0.15);
    o1.frequency.setValueAtTime(440, now + 0.30);
    o1.frequency.setValueAtTime(660, now + 0.45);
    o1.frequency.setValueAtTime(550, now + 1.5);
    g1.gain.setValueAtTime(0.6, now);
    g1.gain.exponentialRampToValueAtTime(0.3, now + 2.5);
    g1.gain.exponentialRampToValueAtTime(0.001, now + duration);
    o1.connect(g1); g1.connect(ctx.destination);
    o1.start(now); o1.stop(now + duration);

    // Layer 2: High-pitched alert beeps
    var o2 = ctx.createOscillator();
    var g2 = ctx.createGain();
    o2.type = 'square';
    for (var i = 0; i < 6; i++) {
      var t = now + i * 0.5;
      o2.frequency.setValueAtTime(880, t);
      g2.gain.setValueAtTime(0.4, t);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    }
    o2.connect(g2); g2.connect(ctx.destination);
    o2.start(now); o2.stop(now + duration);
  } catch(e) {}

  // Browser notification
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification('🔔 New Order!', {
      body: count + ' new ' + (isCraft ? 'craft' : 'food') + ' order' + (count > 1 ? 's' : '') + ' received!',
      tag: 'new-order',
      requireInteraction: true
    });
  }
}

function loadOrdersPage() {
  rrkOrders.listPaginated(ordersLastDoc, ordersPageLimit).then(function(result) {
    if (!ordersLastDoc) window.__adminOrders = [];
    window.__adminOrders = (window.__adminOrders || []).concat(result.items);
    ordersLastDoc = result.lastDoc;
    lastOrderCount = (window.__adminOrders || []).length;
    renderAdminOrdersList(window.__adminOrders, adminActiveOrderType, result.hasMore);
  }).catch(function() {
    document.getElementById('orders-list').innerHTML = '<p class="muted">Failed to load orders.</p>';
  });
}

function renderAdminOrdersList(orders, type, hasMore) {
  var list = document.getElementById('orders-list'); if (!list) return;
  var filtered = type === 'all' ? orders : orders.filter(function(o) { return o.type === type; });
  if (filtered.length === 0) {
    list.innerHTML = '<p class="muted" style="padding:20px;text-align:center">No orders found.</p>';
    return;
  }
  var statusBadge = function(s) {
    var cls = {pending:'status-pending',accepted:'status-accepted',completed:'status-completed',cancelled:'status-cancelled'}[s||'pending']||'status-pending';
    return '<span class="status-badge '+cls+'">' + ((s||'pending').charAt(0).toUpperCase() + (s||'pending').slice(1)) + '</span>';
  };
  list.innerHTML = '<div style="overflow-x:auto"><table class="admin-table"><thead><tr><th>Date</th><th>Type</th><th>Phone</th><th>Items</th><th>Total</th><th>Mode</th><th>Status</th><th>Actions</th></tr></thead><tbody>'+
    filtered.map(function(o) {
      var date = (o.created_at||'').substring(0,10);
      var time = (o.created_at||'').substring(11,16);
      var typeLabel = {online:'🍗 Online',craft:'🍽️ Craft',raw:'🥩 Raw'}[o.type||'online']||'Online';
      var extra = o.type==='craft' ? ' · '+o.guests+' guests' : (o.phone ? ' · '+o.phone : '');
      var actions = '';
      if (o.status !== 'completed' && o.status !== 'cancelled') {
        if (o.status !== 'accepted') actions += '<button class="btn btn--gold-outline" style="padding:3px 8px;font-size:11px;margin-right:4px" onclick="updateOrderStatus(\''+o.id+'\',\'accepted\')">Accept</button>';
        actions += '<button class="btn" style="padding:3px 8px;font-size:11px;margin-right:4px;background:#C1121F;color:#fff;border:none" onclick="updateOrderStatus(\''+o.id+'\',\'cancelled\')">Cancel</button>';
      }
      if (o.status === 'accepted') {
        actions += '<button class="btn btn--primary" style="padding:3px 8px;font-size:11px;margin-right:4px" onclick="updateOrderStatus(\''+o.id+'\',\'completed\')">Complete</button>';
      }
      if (o.phone) {
        actions += ' <button class="btn" style="padding:3px 8px;font-size:11px;background:#25D366;color:#fff;border:none" onclick="notifyCustomerWhatsApp(\''+o.id+'\')" title="Notify customer via WhatsApp">💬</button>';
      }
      actions += '<button class="btn" style="padding:3px 8px;font-size:11px;background:#555;color:#fff;border:none" onclick="deleteOrderDoc(\''+o.id+'\')">🗑</button>';
      var itemsDisplay = '';
      if (o.items) {
        var itemArr = o.items.split(',').filter(Boolean);
        itemsDisplay = itemArr.slice(0, 3).map(function(it) { return it.trim(); }).join(', ');
        if (itemArr.length > 3) itemsDisplay += ' +' + (itemArr.length - 3) + ' more';
        if (o.type === 'craft' && o.guests) itemsDisplay += '<br><small>👥 ' + o.guests + ' guests</small>';
      }
      return '<tr><td>'+date+'<br><small>'+time+'</small></td><td>'+typeLabel+'<br><small>'+extra+'</small></td><td>'+(o.phone||'—')+'</td><td style="max-width:220px;word-wrap:break-word">'+itemsDisplay+'</td><td>₹'+(o.total||0)+'</td><td>'+(o.mode||'')+'</td><td>'+statusBadge(o.status)+'</td><td style="white-space:nowrap">'+actions+'</td></tr>';
    }).join('')+
  '</tbody></table></div>'+
  (hasMore ? '<div style="text-align:center;margin-top:16px"><button class="btn btn--gold-outline" onclick="loadOrdersPage()">Load More Orders</button></div>' : '');
}

function filterAdminOrders(type, btn) {
  adminActiveOrderType = type;
  adminHaptic('click');
  document.querySelectorAll('#cms-orders .cms-cat-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  if (type === 'reservations') {
    loadReservations();
  } else {
    renderAdminOrdersList(window.__adminOrders || [], type);
  }
}

function loadReservations() {
  var list = document.getElementById('orders-list');
  if (!list) return;
  list.innerHTML = '<p class="muted">Loading reservations...</p>';
  if (typeof rrkReservations === 'undefined') {
    list.innerHTML = '<p class="muted">Reservations not available.</p>';
    return;
  }
  rrkReservations.list().then(function(data) {
    var reservations = data || [];
    if (reservations.length === 0) {
      list.innerHTML = '<p class="muted" style="padding:20px;text-align:center">No reservations yet.</p>';
      return;
    }
    list.innerHTML = '<div style="overflow-x:auto"><table class="admin-table"><thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>Booking Date</th><th>Time</th><th>Actions</th></tr></thead><tbody>'+
      reservations.map(function(r) {
        var created = (r.created_at||'').substring(0,10);
        return '<tr><td>'+created+'</td><td><b>'+(r.name||'')+'</b></td><td>'+(r.phone||'')+'</td><td>'+(r.date||'')+'</td><td>'+(r.time||'')+'</td>'+
        '<td><button class="btn" style="padding:3px 8px;font-size:11px;background:#25D366;color:#fff;border:none;margin-right:4px" onclick="notifyReservationCustomer(\''+r.id+'\')">💬</button>'+
        '<button class="btn" style="padding:3px 8px;font-size:11px;background:#555;color:#fff;border:none" onclick="deleteReservationDoc(\''+r.id+'\')">🗑</button></td></tr>';
      }).join('')+
    '</tbody></table></div>';
  }).catch(function() {
    list.innerHTML = '<p class="muted">Failed to load reservations.</p>';
  });
}

function notifyReservationCustomer(id) {
  if (typeof rrkReservations === 'undefined') return;
  rrkReservations.list().then(function(data) {
    var r = (data || []).find(function(item) { return item.id === id; });
    if (!r || !r.phone) { alert('No phone number found.'); return; }
    var phone = r.phone.replace(/[\s+\-]/g, '');
    if (/^[6-9]\d{9}$/.test(phone)) phone = '91' + phone;
    var msg = 'Hi '+(r.name||'')+'! Your table reservation at *RRK Food Court* is confirmed.\n\n';
    msg += '📅 Date: '+(r.date||'')+'\n🕒 Time: '+(r.time||'')+'\n\nThank you for choosing RRK! 🙏';
    window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg), '_blank');
  });
}

function deleteReservationDoc(id) {
  adminHaptic('remove');
  if (!confirm('Delete this reservation?')) return;
  if (typeof rrkReservations === 'undefined') return;
  rrkReservations.remove(id).then(function() { loadReservations(); });
}

function updateOrderStatus(id, status) {
  if (!confirm('Set order #'+id.substring(0,6)+' to "'+status+'"?')) return;
  adminHaptic(status === 'completed' ? 'confirm' : (status === 'cancelled' ? 'remove' : 'click'));
  if (typeof rrkOrders === 'undefined' || !rrkOrders.updateStatus) return;
  rrkOrders.updateStatus(id, status).then(function() {
    if (window.__adminOrders && window.__adminOrders.length) {
      var order = window.__adminOrders.find(function(o) { return o.id === id; });
      if (order) order.status = status;
    }
    renderAdminOrdersList(window.__adminOrders || [], adminActiveOrderType);
    // Prompt to notify customer via WhatsApp
    var order = (window.__adminOrders || []).find(function(o) { return o.id === id; });
    if (order && order.phone) {
      var statusLabel = {accepted:'Accepted ✅', completed:'Completed 🎉', cancelled:'Cancelled ❌'}[status] || status;
      if (confirm('Notify customer at '+order.phone+' that their order is now '+statusLabel+'?')) {
        notifyCustomerWhatsApp(id);
      }
    }
  }).catch(function(e) { alert('Failed: '+e.message); });
}

function notifyCustomerWhatsApp(id) {
  var order = (window.__adminOrders || []).find(function(o) { return o.id === id; });
  if (!order || !order.phone) { alert('No phone number found for this order.'); return; }
  // Normalize phone number — prepend India country code if it's a 10-digit number without one
  var phone = order.phone.replace(/[\s+\-]/g, '');
  if (/^[6-9]\d{9}$/.test(phone)) phone = '91' + phone;
  var statusLabel = {pending:'Pending', accepted:'Accepted ✅', completed:'Completed 🎉', cancelled:'Cancelled ❌'}[order.status] || order.status;
  var msg = 'Hi! Your order at *RRK Food Court* has been updated.\n\n';
  msg += '📋 Order: '+order.id.substring(0,6)+'\n';
  msg += '📦 Status: '+statusLabel+'\n';
  msg += '🍽️ Items: '+order.items+'\n';
  msg += '💰 Total: ₹'+(order.total||0)+'\n';
  if (order.mode) msg += '🚚 Mode: '+order.mode+'\n';
  msg += '\nThank you for choosing RRK Food Court! 🙏';
  var wa = '919866631761';
  if (typeof rrkSettings !== 'undefined') {
    rrkSettings.get().then(function(s) {
      wa = s.whatsapp || '919866631761';
      window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg), '_blank');
    }).catch(function() {
      window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg), '_blank');
    });
  } else {
    window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg), '_blank');
  }
}

function deleteOrderDoc(id) {
  adminHaptic('remove');
  if (!confirm('Delete this order permanently?')) return;
  if (typeof rrkOrders === 'undefined' || !rrkOrders.remove) return;
  rrkOrders.remove(id).then(function() {
    window.__adminOrders = (window.__adminOrders || []).filter(function(o) { return o.id !== id; });
    renderAdminOrdersList(window.__adminOrders, adminActiveOrderType);
  }).catch(function(e) { alert('Failed: '+e.message); });
}

// ============ OCCASIONS ============
function renderOccasionEditor() {
  const el = document.getElementById('cms-occasions'); if (!el) return;
  el.innerHTML = '<h3 style="margin-bottom:20px">Occasion Options</h3><p class="muted">Loading...</p>';
  rrkOccasions.list().then(items => {
    el.innerHTML = `<h3 style="margin-bottom:20px">Occasion Options (${items.length})</h3>
      <div class="cms-list">${items.map(o =>`
        <div class="cms-item"><div><b>${o.emoji} ${o.label}</b><span>${o.type||'home'} · ${o.offerPercent||0}% off · ${o.couponType||'—'}</span></div>
        <div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editOccasionDoc('${o.id}')">Edit</button><button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteOccasionDoc('${o.id}')">Delete</button></div></div>`
      ).join('')}</div><button class="btn btn--primary" style="margin-top:16px" onclick="addOccasionDoc()">+ Add</button>`;
  });
}

function occasionFields(item) {
  return [
    { key: 'emoji', label: 'Emoji', type: 'text', val: item.emoji||'' },
    { key: 'label', label: 'Label', type: 'text', val: item.label||'' },
    { key: 'type', label: 'Page', type: 'select', val: item.type||'home', optionsHtml: '<option value="home"'+(item.type==='home'?' selected':'')+'>Home Page</option><option value="craft"'+(item.type==='craft'?' selected':'')+'>Craft My Plate</option>' },
    { key: 'couponType', label: 'Coupon Key', type: 'text', val: item.couponType||'' },
    { key: 'offerPercent', label: 'Offer Discount (%)', type: 'number', val: item.offerPercent||0 },
    { key: 'message', label: 'Discount Message', type: 'text', val: item.message||'' }
  ];
}

function editOccasionDoc(id) {
  adminHaptic('click');
  rrkOccasions.list().then(items => {
    const item = items.find(o => o.id === id); if (!item) return;
    showItemEditor('Occasion', occasionFields(item), (vals) => rrkOccasions.save({ id, ...vals }).then(() => renderOccasionEditor()));
  });
}

function addOccasionDoc() {
  adminHaptic('add');
  showItemEditor('New Occasion', occasionFields({}), (vals) => rrkOccasions.save(vals).then(() => renderOccasionEditor()));
}

function deleteOccasionDoc(id) {
  adminHaptic('remove');
  if (!confirm('Delete?')) return;
  rrkOccasions.remove(id).then(() => renderOccasionEditor());
}

// ============ CUSTOMERS ============
var adminCustomerSearchQuery = '';

function renderCustomersEditor() {
  const el = document.getElementById('cms-customers'); if (!el) return;
  el.innerHTML = `<h3 style="margin-bottom:16px">Registered Customers</h3>
    <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap">
      <input type="text" id="customerSearchInput" placeholder="Search by name or phone..." style="flex:1;min-width:200px;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:'Inter',sans-serif;font-size:14px;background:#fff" oninput="onCustomerSearch(this.value)" onfocus="adminHaptic('click')" />
      <button class="btn btn--gold-outline" style="font-size:12px" onclick="adminHaptic('click');renderCustomersEditor()">🔄 Refresh</button>
      <button class="btn btn--primary" style="font-size:12px" onclick="adminHaptic('click');downloadCustomersPDF()">📥 Download PDF</button>
    </div>
    <div id="customers-list"><p class="muted">Loading...</p></div>`;
  rrkCustomers.list().then(data => {
    window.__adminCustomers = data || [];
    renderAdminCustomersList(window.__adminCustomers, adminCustomerSearchQuery);
  }).catch(function() { adminError('customers-list', 'Could not load customers.'); });
}

function onCustomerSearch(query) {
  adminCustomerSearchQuery = (query || '').toLowerCase().trim();
  renderAdminCustomersList(window.__adminCustomers || [], adminCustomerSearchQuery);
}

function isBirthdayWindow(dobStr) {
  if (!dobStr) return false;
  var parts = dobStr.split('-');
  if (parts.length < 2) return false;
  var dobMonth = parseInt(parts[1]);
  var dobDay = parseInt(parts[2]);
  if (isNaN(dobMonth) || isNaN(dobDay)) return false;
  var now = new Date();
  var nowMonth = now.getMonth() + 1;
  var nowDay = now.getDate();
  // Convert both to day-of-year and handle year wrap
  var dobDoy = dobMonth * 100 + dobDay;
  var nowDoy = nowMonth * 100 + nowDay;
  // Check within 5 days before or after
  for (var d = -5; d <= 5; d++) {
    var checkDoy = dobDoy + d;
    // Handle year wrap
    if (checkDoy < 101) checkDoy += 1200;
    if (checkDoy > 1231) checkDoy -= 1200;
    var checkAdj = checkDoy > 1200 ? checkDoy - 1200 : checkDoy;
    var nowAdj = nowDoy > 1200 ? nowDoy - 1200 : nowDoy;
    // Simple overlap check
    if (checkDoy >= 100) {
      if (nowDoy >= 100 && checkDoy === nowDoy) return true;
      if (nowDoy <= 31 && checkDoy >= 1200) {
        if (checkDoy - 1200 === nowDoy) return true;
      }
    }
  }
  // More robust: compare month+day
  if (dobMonth === nowMonth && Math.abs(nowDay - dobDay) <= 5) return true;
  // Handle month boundary
  if (nowMonth === 12 && dobMonth === 1) {
    var daysInDec = 31;
    if ((daysInDec - nowDay) + dobDay <= 5) return true;
  }
  if (nowMonth === 1 && dobMonth === 12) {
    var daysInDec2 = 31;
    if ((daysInDec2 - dobDay) + nowDay <= 5) return true;
  }
  return false;
}

function hasClaimedThisYear(claims) {
  if (!claims || !Array.isArray(claims) || claims.length === 0) return false;
  var thisYear = new Date().getFullYear();
  return claims.some(function(c) { return c.year === thisYear; });
}

function getClaimHistoryHtml(claims) {
  if (!claims || !Array.isArray(claims) || claims.length === 0) return '<p class="muted" style="font-size:12px;margin-top:4px">No previous claims.</p>';
  return '<div style="margin-top:6px"><p class="muted" style="font-size:11px;margin-bottom:4px">Claim History:</p>'+
    claims.map(function(c) {
      return '<span style="display:inline-block;background:#D4AF37;color:#5a4300;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;margin-right:4px;margin-bottom:4px">🎂 ' + c.year + ' — ' + (c.date||'') + '</span>';
    }).join('') + '</div>';
}

function renderAdminCustomersList(customers, query) {
  var list = document.getElementById('customers-list');
  if (!list) return;
  if (!customers || customers.length === 0) { list.innerHTML='<p class="muted">No customers yet. Customer sign-ups from the login popup will appear here.</p>'; return; }
  var filtered = customers;
  if (query) {
    filtered = customers.filter(function(c) {
      return (c.name||'').toLowerCase().indexOf(query) !== -1 || (c.phone||'').toLowerCase().indexOf(query) !== -1;
    });
  }
  if (filtered.length === 0) { list.innerHTML='<p class="muted" style="padding:12px">No customers match "' + esc(query) + '".</p>'; return; }
  list.innerHTML = '<div style="overflow-x:auto"><table class="admin-table"><thead><tr><th>Name</th><th>Phone</th><th>DOB</th><th>Registered</th><th>Birthday Offer</th><th>Action</th></tr></thead><tbody>'+
    filtered.map(function(c) {
      var inWindow = isBirthdayWindow(c.dob);
      var alreadyClaimed = hasClaimedThisYear(c.birthday_claims);
      var claimHistory = getClaimHistoryHtml(c.birthday_claims);
      var bdayCell = '';
      if (!c.dob) {
        bdayCell = '<span class="muted" style="font-size:11px">No DOB</span>';
      } else if (inWindow && !alreadyClaimed) {
        bdayCell = '<button class="btn" style="padding:4px 10px;font-size:11px;background:#D4AF37;color:#5a4300;border:none;border-radius:6px;font-weight:700" onclick="claimBirthdayOffer(\''+c.id+'\')">🎂 Claim Offer</button>';
      } else if (alreadyClaimed) {
        bdayCell = '<span style="display:inline-block;background:#2E7D32;color:#fff;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700">✅ Claimed</span>';
      } else {
        bdayCell = '<span class="muted" style="font-size:11px">Outside window</span>';
      }
      bdayCell += claimHistory;
      return '<tr><td><b>'+(c.name||'')+'</b></td><td>'+(c.phone||'')+'</td><td>'+(c.dob||'—')+'</td><td>'+(c.created_at||'').substring(0,10)+'</td><td style="min-width:160px">'+bdayCell+'</td>'+
      '<td><button class="btn" style="padding:4px 10px;font-size:11px;background:#C1121F;color:#fff;border:none" onclick="deleteCustomerDoc(\''+c.id+'\')">Delete</button></td></tr>';
    }).join('') + '</tbody></table></div>';
}

function claimBirthdayOffer(customerId) {
  adminHaptic('confirm');
  if (!confirm('Mark this birthday offer as claimed? Customer can only claim once per year.')) return;
  if (typeof rrkCustomers === 'undefined' || !rrkCustomers.claimBirthday) return;
  rrkCustomers.claimBirthday(customerId).then(function() {
    renderCustomersEditor();
  });
}

function deleteCustomerDoc(id) {
  adminHaptic('remove');
  if (!confirm('Delete?')) return;
  rrkCustomers.remove(id).then(() => renderCustomersEditor());
}

// ============ REVIEWS ============
function renderReviewsEditor() {
  var el = document.getElementById('cms-reviews'); if (!el) return;
  el.innerHTML = '<h3 style="margin-bottom:20px">Customer Reviews</h3><p class="muted">Loading...</p>';
  if (typeof rrkReviews === 'undefined') { el.innerHTML = '<p class="muted">Reviews not available</p>'; return; }
  rrkReviews.list().then(function(items) {
    items = items || [];
    el.innerHTML = '<h3 style="margin-bottom:20px">Customer Reviews ('+items.length+')</h3>' +
      '<div class="cms-list">' +
      items.map(function(r) {
        return '<div class="cms-item"><div><b>'+r.name+'</b> <span style="color:#D4AF37">'+('★'.repeat(parseInt(r.stars)||5))+'</span><br><span>'+r.text+'</span><br><small style="color:#6B6B6B">'+((r.created_at||'').substring(0,10))+'</small></div>'+
          '<button class="btn" style="padding:4px 10px;font-size:11px;background:#C1121F;color:#fff;border:none" onclick="deleteReviewDoc(\''+r.id+'\')">Hide</button></div>';
      }).join('') +
      (items.length === 0 ? '<p class="muted">No reviews yet. Customer reviews from the website will appear here.</p>' : '') +
      '</div>';
  });
}

function deleteReviewDoc(id) {
  adminHaptic('remove');
  if (!confirm('Hide this review?')) return;
  rrkReviews.remove(id).then(function() { renderReviewsEditor(); });
}

// ============ SOCIAL / FOOTER ============
function renderSocialEditor() {
  const el = document.getElementById('cms-social'); if (!el) return;
  el.innerHTML = '<h3 style="margin-bottom:16px">Social Links & Footer</h3><p class="muted">Loading...</p>';
  rrkSettings.get().then(s => {
    el.innerHTML = `<h3 style="margin-bottom:16px">Social Links</h3>
      ${field('social_instagram','Instagram URL','text',s.social_instagram||'')}${field('social_facebook','Facebook URL','text',s.social_facebook||'')}
      ${field('social_youtube','YouTube URL','text',s.social_youtube||'')}
      <button class="btn btn--primary" onclick="saveSocialDoc()">Save Social</button>
      <hr style="margin:20px 0;border-color:var(--border)" />
      <h3 style="margin-bottom:16px">Footer</h3>
      ${field('brand_tagline','Tagline','text',s.brand_tagline||'')}${field('footer_copyright','Copyright','text',s.footer_copyright||'')}
      <button class="btn btn--primary" onclick="saveFooterDoc()">Save Footer</button>`;
  });
}

function saveSocialDoc() {
  adminHaptic('confirm');
  var data = {};
  ['social_instagram','social_facebook','social_youtube'].forEach(function(k){ var v=g(k); if(v!=='') data[k]=v; });
  rrkSettings.save(data).then(() => alert('Saved!'));
}

function saveFooterDoc() {
  adminHaptic('confirm');
  var data = {};
  ['brand_tagline','footer_copyright'].forEach(function(k){ var v=g(k); if(v!=='') data[k]=v; });
  rrkSettings.save(data).then(() => alert('Saved!'));
}

// ============ SETTINGS ============
function renderSettingsEditor() {
  const el = document.getElementById('cms-settings'); if (!el) return;
  el.innerHTML = '<h3 style="margin-bottom:16px">Global Settings</h3><p class="muted">Loading...</p>';
  rrkSettings.get().then(s => {
    el.innerHTML = `<h3 style="margin-bottom:16px">Global Settings</h3>
      ${field('brand_name','Brand Name','text',s.brand_name||'RRK Food Court')}${field('whatsapp','WhatsApp Number','text',s.whatsapp||'919866631761')}
      <div class="admin-field"><label>Admin Password</label><input type="password" id="field-admin_pass" placeholder="Leave blank to keep current" style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:Inter,sans-serif;font-size:14px;background:#fff" /></div>
      <button class="btn btn--primary" onclick="saveSettingsDoc()">Save Settings</button>
      <hr style="margin:28px 0;border-color:var(--border)" />
      <h3 style="margin-bottom:12px">Images</h3>
      <div class="admin-field"><label>Hero Image (main page first photo)</label><input type="text" id="field-hero_image" value="${esc(s.hero_image||'')}" oninput="previewInlineImage('field-hero_image','preview-hero_image')" /><div id="preview-hero_image" style="margin-top:8px;max-width:300px;border-radius:10px;overflow:hidden;border:1px solid var(--border);display:${s.hero_image?'block':'none'}"><img src="${esc(s.hero_image||'')}" alt="Hero Preview" style="width:100%;display:block" onerror="this.parentElement.style.display='none'" /></div></div>
      <div class="admin-field"><label>QR Code Image (ordering page)</label><input type="text" id="field-qr_image" value="${esc(s.qr_image||'')}" oninput="previewInlineImage('field-qr_image','preview-qr_image')" /><div id="preview-qr_image" style="margin-top:8px;max-width:200px;border-radius:10px;overflow:hidden;border:1px solid var(--border);display:${s.qr_image?'block':'none'}"><img src="${esc(s.qr_image||'')}" alt="QR Preview" style="width:100%;display:block" onerror="this.parentElement.style.display='none'" /></div></div>
      <button class="btn btn--primary" onclick="saveImagesDoc()">Save Images</button>
      <hr style="margin:28px 0;border-color:var(--border)" />
      <h3 style="margin-bottom:12px">Food Service Hours</h3>
      ${field('service_open_now','Open Now','toggle',s.service_open_now!=='0' && s.service_open_now!=='false' ? '1' : '0')}
      ${field('service_open_time','Open Time (HH:MM, 24-hour)','text',s.service_open_time||'11:00')}
      ${field('service_close_time','Close Time (HH:MM, 24-hour)','text',s.service_close_time||'23:00')}
      ${field('service_closed_msg','Closed Message','text',s.service_closed_msg||'Restaurant Closed · We are currently not accepting orders.')}
      <button class="btn btn--gold-outline" onclick="saveServiceHoursDoc()">Save Food Hours</button>
      <hr style="margin:28px 0;border-color:var(--border)" />
      <h3 style="margin-bottom:12px">Raw Chicken Hours (opens earlier)</h3>
      ${field('raw_open_now','Open Now','toggle',s.raw_open_now!=='0' && s.raw_open_now!=='false' ? '1' : '0')}
      ${field('raw_open_time','Open Time (HH:MM, 24-hour)','text',s.raw_open_time||'07:00')}
      ${field('raw_close_time','Close Time (HH:MM, 24-hour)','text',s.raw_close_time||'23:00')}
      ${field('raw_closed_msg','Closed Message','text',s.raw_closed_msg||'Raw Chicken orders are currently closed. We open at 7:00 AM daily.')}
      <button class="btn btn--gold-outline" onclick="saveRawHoursDoc()">Save Raw Hours</button>
      <hr style="margin:28px 0;border-color:var(--border)" />
      <h3 style="margin-bottom:12px">Community</h3>
      ${field('wa_community','WhatsApp Community Link','text',s.wa_community||'')}
      <button class="btn btn--primary" onclick="saveCommunityDoc()">Save Community Link</button>
      <hr style="margin:28px 0;border-color:var(--border)" />
      <p class="muted" style="font-size:12px">Data is stored in Firebase Firestore. To reset, delete collections in Firebase Console.</p>`;
  });
}

function saveImagesDoc() {
  adminHaptic('confirm');
  var data = {};
  ['hero_image','qr_image'].forEach(function(k){ var v=g(k); if(v!=='') data[k]=v; });
  rrkSettings.save(data).then(function() { alert('Images saved!'); });
}

function saveSettingsDoc() {
  adminHaptic('confirm');
  var data = {};
  ['brand_name','whatsapp'].forEach(function(k){ var v=g(k); if(v!=='') data[k]=v; });
  var pw = g('admin_pass');
  if (pw) {
    // Hash password before saving
    if (typeof hashPassword === 'function') {
      hashPassword(pw).then(function(hashed) {
        data.admin_pass = hashed;
        rrkSettings.save(data).then(function() { alert('Saved!'); });
      });
    } else {
      data.admin_pass = pw;
      rrkSettings.save(data).then(function() { alert('Saved!'); });
    }
  } else {
    rrkSettings.save(data).then(function() { alert('Saved!'); });
  }
}

function saveServiceHoursDoc() {
  adminHaptic('confirm');
  var data = {};
  var openNow = g('service_open_now');
  if (openNow !== '0' && openNow !== '1') openNow = '1';
  ['service_open_now','service_open_time','service_close_time','service_closed_msg'].forEach(function(k){ var v=g(k); if(v!=='') data[k]=v; });
  data.service_open_now = openNow;
  rrkSettings.save(data).then(() => alert('Food hours saved!'));
}

function saveRawHoursDoc() {
  adminHaptic('confirm');
  var data = {};
  var rawOpenNow = g('raw_open_now');
  if (rawOpenNow !== '0' && rawOpenNow !== '1') rawOpenNow = '1';
  ['raw_open_now','raw_open_time','raw_close_time','raw_closed_msg'].forEach(function(k){ var v=g(k); if(v!=='') data[k]=v; });
  data.raw_open_now = rawOpenNow;
  rrkSettings.save(data).then(() => alert('Raw chicken hours saved!'));
}

function saveCommunityDoc() {
  adminHaptic('confirm');
  var v = g('wa_community');
  if (v !== '') rrkSettings.save({ wa_community: v }).then(() => alert('Community link saved!'));
}

// ============ HELPERS ============
function g(id) { const el = document.getElementById('field-'+id); return el ? el.value : ''; }
function field(key, label, type, val, opts) {
  if (type === 'select') {
    return '<div class="admin-field"><label>'+label+'</label><select id="field-'+key+'" style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:Inter,sans-serif;font-size:14px;background:#fff">'+(opts||'')+'</select></div>';
  }
  if (type === 'toggle') {
    var on = val === '1' || val === true || val === 'true';
    var toggleLabels = ['No', 'Yes'];
    // Use context-appropriate labels for known fields
    if (key === 'craftEnabled') toggleLabels = ['Disabled', 'Enabled'];
    if (key === 'show_home') toggleLabels = ['Hidden', 'Shown'];
    if (key === 'service_open_now') toggleLabels = ['Closed', 'Open'];
    return '<div class="admin-field"><label>'+label+'</label><p class="muted" style="font-size:11px;margin-bottom:4px">Currently: <b>'+(on?toggleLabels[1]:toggleLabels[0])+'</b></p><div class="admin-toggle" id="field-'+key+'-wrap"><button type="button" class="admin-toggle-btn '+(on?'active':'')+'" data-val="1" onclick="setToggle(\''+key+'\',1)">'+toggleLabels[1]+'</button><button type="button" class="admin-toggle-btn '+(!on?'active':'')+'" data-val="0" onclick="setToggle(\''+key+'\',0)">'+toggleLabels[0]+'</button><input type="hidden" id="field-'+key+'" value="'+(on?'1':'0')+'" /></div></div>';
  }
  return '<div class="admin-field"><label>'+label+'</label><input type="'+type+'" id="field-'+key+'" value="'+esc(val)+'" /></div>';
}

function setToggle(key, val) {
  adminHaptic('click');
  var wrap = document.getElementById('field-'+key+'-wrap'); if (!wrap) return;
  var input = document.getElementById('field-'+key); if (input) input.value = val;
  wrap.querySelectorAll('.admin-toggle-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-val') === String(val));
  });
}
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function downloadOrdersPDF() {
  adminHaptic('click');
  var orders = window.__adminOrders || [];
  if (orders.length === 0) { alert('No orders to download.'); return; }
  var html = '<html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;padding:20px}h2{color:#C1121F}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #ddd;padding:8px;font-size:12px;text-align:left}th{background:#C1121F;color:#fff}.status-pending{color:#E65100}.status-accepted{color:#1565C0}.status-completed{color:#2E7D32}.status-cancelled{color:#C62828}</style></head><body>'+
    '<h2>RRK Food Court - Orders Report</h2>'+
    '<p>Generated: '+new Date().toLocaleString()+' | Total Orders: '+orders.length+'</p>'+
    '<table><thead><tr><th>Date</th><th>Type</th><th>Phone</th><th>Items</th><th>Total</th><th>Mode</th><th>Status</th></tr></thead><tbody>'+
    orders.map(function(o){
      var typeLabel = {online:'Online',craft:'Craft',raw:'Raw'}[o.type||'online']||'Online';
      return '<tr><td>'+((o.created_at||'').substring(0,10))+'</td><td>'+typeLabel+'</td><td>'+((o.phone||'').replace(/</g,''))+'</td><td>'+(o.items||'')+'</td><td>₹'+(o.total||0)+'</td><td>'+(o.mode||'')+'</td><td><span class="status-'+(o.status||'pending')+'">'+(o.status||'pending')+'</span></td></tr>';
    }).join('')+
    '</tbody></table></body></html>';
  var blob = new Blob([html], {type:'text/html'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rrk-orders-' + new Date().toISOString().substring(0,10) + '.html';
  a.click(); URL.revokeObjectURL(a.href);
}

function downloadCustomersPDF() {
  adminHaptic('click');
  if (typeof rrkCustomers === 'undefined') { alert('Customers not loaded. Try refreshing.'); return; }
  rrkCustomers.list().then(function(data){
    var customers = data || [];
    if (customers.length === 0) { alert('No customers to download.'); return; }
    var html = '<html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;padding:20px}h2{color:#C1121F}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #ddd;padding:8px;font-size:12px;text-align:left}th{background:#C1121F;color:#fff}</style></head><body>'+
      '<h2>RRK Food Court - Customers Report</h2>'+
      '<p>Generated: '+new Date().toLocaleString()+' | Total Customers: '+customers.length+'</p>'+
      '<table><thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Date of Birth</th><th>Birthday Claims</th><th>Registered</th></tr></thead><tbody>'+
      customers.map(function(c,i){
        var claimsText = '';
        if (c.birthday_claims && c.birthday_claims.length > 0) {
          claimsText = c.birthday_claims.map(function(cl) { return cl.year + ' (' + cl.date + ')'; }).join(', ');
        } else {
          claimsText = 'None';
        }
        return '<tr><td>'+(i+1)+'</td><td>'+(c.name||'').replace(/</g,'')+'</td><td>'+(c.phone||'')+'</td><td>'+(c.dob||'')+'</td><td>'+claimsText+'</td><td>'+((c.created_at||'').substring(0,10))+'</td></tr>';
      }).join('')+
      '</tbody></table></body></html>';
    var blob = new Blob([html], {type:'text/html'});
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rrk-customers-' + new Date().toISOString().substring(0,10) + '.html';
    a.click(); URL.revokeObjectURL(a.href);
  }).catch(function(){ alert('Failed to load customers.'); });
}

function showItemEditor(title, fields, onSave) {
  const existing = document.querySelector('.admin-modal'); if (existing) existing.remove();
  const modal = document.createElement('div'); modal.className = 'admin-modal';
  var fieldsHtml = fields.map(function(f) {
    if (f.preview) {
      return '<div class="admin-field"><label>'+f.label+'</label>'+
        '<input type="text" id="field-'+f.key+'" value="'+esc(f.val)+'" oninput="previewImage(\'field-'+f.key+'\',\'preview-'+f.key+'\')" />'+
        '<div id="preview-'+f.key+'" style="margin-top:8px;width:100%;max-width:200px;border-radius:10px;overflow:hidden;border:1px solid var(--border);display:'+(f.val?'block':'none')+'"><img id="preview-img-'+f.key+'" src="'+esc(f.val)+'" alt="Preview" style="width:100%;display:block" onerror="this.parentElement.style.display=\'none\'" /></div></div>';
    }
    return field(f.key, f.label, f.type, f.val, f.optionsHtml||'');
  }).join('');
  modal.innerHTML = '<div class="admin-modal__card"><h3>'+title+'</h3>'+fieldsHtml+
    '<div style="display:flex;gap:10px;margin-top:16px"><button class="btn btn--primary btn--block" id="am-save">Save</button><button class="btn btn--gold-outline btn--block" id="am-cancel">Cancel</button></div></div>';
  document.body.appendChild(modal);
  modal.addEventListener('click', function(ev) { if (ev.target === modal) { adminHaptic('close'); modal.remove(); } });
  modal.querySelector('#am-save').onclick = () => {
    adminHaptic('confirm');
    var vals = {}; var errors = [];
    fields.forEach(function(f) {
      var el = document.getElementById('field-'+f.key);
      vals[f.key] = el ? el.value : '';
      // Basic validation
      if (f.type === 'number' && vals[f.key] !== '') {
        if (isNaN(parseFloat(vals[f.key]))) errors.push(f.label + ' must be a number.');
      }
      if (f.label.indexOf('Price') !== -1 || f.key === 'price') {
        if (vals[f.key] !== '' && (isNaN(parseFloat(vals[f.key])) || parseFloat(vals[f.key]) < 0)) {
          errors.push(f.label + ' must be a positive number.');
        }
      }
    });
    if (errors.length > 0) {
      alert('Please fix the following:\n- ' + errors.join('\n- '));
      return;
    }
    modal.remove(); onSave(vals);
  };
  modal.querySelector('#am-cancel').onclick = () => { adminHaptic('close'); modal.remove(); };
}

function previewImage(inputId, previewId) {
  var input = document.getElementById(inputId);
  var preview = document.getElementById(previewId);
  var img = document.getElementById('preview-img-'+inputId.replace('field-',''));
  if (!input || !preview || !img) return;
  var url = input.value.trim();
  if (url) {
    preview.style.display = 'block';
    img.src = url;
  } else {
    preview.style.display = 'none';
    img.src = '';
  }
}

function previewInlineImage(inputId, previewId) {
  var input = document.getElementById(inputId);
  var preview = document.getElementById(previewId);
  if (!input || !preview) return;
  var img = preview.querySelector('img');
  var url = input.value.trim();
  if (url) {
    preview.style.display = 'block';
    if (img) img.src = url;
  } else {
    preview.style.display = 'none';
  }
}

function previewImage(inputId, previewId) {
  var input = document.getElementById(inputId);
  var preview = document.getElementById(previewId);
  var img = document.getElementById('preview-img-'+inputId.replace('field-',''));
  if (!input || !preview || !img) return;
  var url = input.value.trim();
  if (url) {
    preview.style.display = 'block';
    img.src = url;
  } else {
    preview.style.display = 'none';
    img.src = '';
  }
}

function previewInlineImage(inputId, previewId) {
  var input = document.getElementById(inputId);
  var preview = document.getElementById(previewId);
  if (!input || !preview) return;
  var img = preview.querySelector('img');
  var url = input.value.trim();
  if (url) {
    preview.style.display = 'block';
    if (img) img.src = url;
  } else {
    preview.style.display = 'none';
  }
}
