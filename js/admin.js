// ============================================
// RRK ADMIN CMS — Firestore Backend
// ============================================
const ADMIN_KEY = 'rrk_admin_session';

function loadAdminApp() {
  document.querySelectorAll('.cms-panel').forEach(p => p.style.display = 'none');
  document.getElementById('cms-menu').style.display = 'block';
  renderMenuEditor();
  renderCraftEditor();
  renderRawEditor();
  renderComboEditor();
  renderOccasionEditor();
  renderCustomersEditor();
  renderContactEditor();
  renderSocialEditor();
  renderSettingsEditor();
  // Sync categories to localStorage so public pages use them
  if (typeof rrkCategories !== 'undefined') rrkCategories.syncToLocal();
}

function showTab(tabId) {
  document.querySelectorAll('.cms-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.cms-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('cms-' + tabId);
  const tab = document.querySelector(`.cms-tab[data-tab="${tabId}"]`);
  if (panel) panel.style.display = 'block';
  if (tab) tab.classList.add('active');
}

// ============ MENU ============
var adminActiveMenuCat = 'all';
var adminMenuCategories = [];

function loadMenuCategories() {
  try {
    var stored = localStorage.getItem('rrk_menu_cats');
    if (stored) adminMenuCategories = JSON.parse(stored);
  } catch(e) {}
  if (!adminMenuCategories || adminMenuCategories.length === 0) {
    adminMenuCategories = [
      {key:'chicken',label:'🐔 Chicken',order:0},{key:'biryani',label:'🍚 Biryani',order:1},
      {key:'starters',label:'🍗 Starters',order:2},{key:'meals',label:'🍛 Meals',order:3},
      {key:'family',label:'👨‍👩‍👧 Family',order:4},{key:'beverages',label:'🥤 Beverages',order:5},
      {key:'desserts',label:'🍰 Desserts',order:6}
    ];
  }
}

function renderMenuEditor() {
  var el = document.getElementById('cms-menu'); if (!el) return;
  loadMenuCategories();
  el.innerHTML = '<h3 style="margin-bottom:16px">Menu Items</h3><p class="muted">Loading...</p>';
  rrkMenu.list().then(function(items) {
    window.__adminMenuItems = items;
    var catBtns = '<button class="cms-cat-btn active" onclick="filterAdminMenu(\'all\',this)">All</button>'+
      adminMenuCategories.map(function(c){return'<button class="cms-cat-btn" onclick="filterAdminMenu(\''+c.key+'\',this)">'+c.label+'</button>'}).join('');
    el.innerHTML = '<h3 style="margin-bottom:12px">Menu Items ('+items.length+')</h3>'+
      '<div class="cms-cats">'+catBtns+'</div>'+
      '<div class="cms-list" id="cms-menu-list"></div>'+
      '<button class="btn btn--primary" style="margin-top:16px;margin-right:10px" onclick="addMenuDoc()">+ Add Menu Item</button>'+
      '<button class="btn btn--gold-outline" style="margin-top:16px" onclick="addCategoryDocInline()">+ Add Category</button>'+
      '<div style="margin-top:28px;padding-top:20px;border-top:1px solid var(--border)" id="cms-menu-cats-inline"></div>';
    renderAdminMenuList(items, adminActiveMenuCat);
    renderCategoriesInline();
  });
}

function refreshMenuEditor() {
  loadMenuCategories();
  rrkMenu.list().then(function(items) {
    window.__adminMenuItems = items;
    var el = document.getElementById('cms-menu');
    if (!el) return;
    var catBtns = '<button class="cms-cat-btn active" onclick="filterAdminMenu(\'all\',this)">All</button>'+
      adminMenuCategories.map(function(c){return'<button class="cms-cat-btn" onclick="filterAdminMenu(\''+c.key+'\',this)">'+c.label+'</button>'}).join('');
    // Rebuild category buttons bar while keeping items and add button
    var catsBar = el.querySelector('.cms-cats');
    if (catsBar) catsBar.innerHTML = catBtns;
    // Reset active state on "All" button
    catsBar.querySelector('.cms-cat-btn').classList.add('active');
    adminActiveMenuCat = 'all';
    renderAdminMenuList(items, adminActiveMenuCat);
    renderCategoriesInline();
  });
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
  rrkMenu.save({ id: id, today_special: val === 1 ? '1' : '0' }).then(function() {
    refreshMenuEditor();
  });
}

function filterAdminMenu(cat, btn) {
  adminActiveMenuCat = cat;
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
    { key: 'image', label: 'Image URL', type: 'text', val: item.image||'', preview: true },
    { key: 'special', label: 'Chef\'s Pick? (Appears in "Chef\'s Picks" section)', type: 'select', val: item.special||'0', optionsHtml: '<option value="1"'+(item.special==='1'?' selected':'')+'>Yes</option><option value="0"'+(item.special!=='1'?' selected':'')+'>No</option>' },
    { key: 'special_tag', label: 'Special Badge Text', type: 'text', val: item.special_tag||'' }
  ];
}

function editMenuDoc(id) {
  rrkMenu.list().then(items => {
    const item = items.find(m => m.id === id); if (!item) return;
    showItemEditor('Menu Item', menuFields(item), (vals) => {
      vals.craftCategory = vals.category;
      rrkMenu.save({ id, ...vals }).then(() => refreshMenuEditor());
    });
  });
}

function addMenuDoc() {
  const item = {};
  showItemEditor('New Menu Item', menuFields(item), (vals) => {
    vals.craftCategory = vals.category;
    rrkMenu.save(vals).then(() => refreshMenuEditor());
  });
}

function deleteMenuDoc(id) {
  if (!confirm('Delete?')) return;
  rrkMenu.remove(id).then(() => refreshMenuEditor());
}

// ============ INLINE CATEGORIES (within Menu tab) ============
function renderCategoriesInline() {
  var el = document.getElementById('cms-menu-cats-inline');
  if (!el || typeof rrkCategories === 'undefined') return;
  rrkCategories.list().then(function(items) {
    var cats = items.filter(function(c){return c.type==='menu';});
    el.innerHTML = '<h4 style="margin-bottom:8px">Manage Categories</h4>'+
      '<div class="cms-list" id="cms-inline-cats">'+renderCategoryListInline(cats)+'</div>';
  });
}

function renderCategoryListInline(items) {
  if (!items || items.length === 0) return '<p class="muted" style="padding:12px">No custom categories. Add one below.</p>';
  return items.map(function(c){
    return '<div class="cms-item"><div><b>'+c.label+'</b><span>Key: '+c.key+' · Order: '+(c.order||0)+'</span></div>'+
      '<div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editCategoryDocInline(\''+c.id+'\')">Edit</button>'+
      '<button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteCategoryDocInline(\''+c.id+'\')">Delete</button></div></div>';
  }).join('');
}

function addCategoryDocInline() {
  showItemEditor('New Menu Category', [
    { key: 'key', label: 'Key (short id, e.g. "chicken")', type: 'text', val: '' },
    { key: 'label', label: 'Display Name (e.g. "🐔 Chicken")', type: 'text', val: '' },
    { key: 'order', label: 'Sort Order', type: 'number', val: '0' }
  ], function(vals){
    rrkCategories.save({ type: 'menu', key: vals.key, label: vals.label, order: parseInt(vals.order)||0 }).then(function(){
      rrkCategories.syncToLocal().then(function(){
        loadMenuCategories();
        refreshMenuEditor();
        renderCategoriesInline();
      });
    });
  });
}

function editCategoryDocInline(id) {
  rrkCategories.list().then(function(items){
    var item = items.find(function(c){return c.id===id;}); if(!item) return;
    showItemEditor('Edit Category', [
      { key: 'key', label: 'Key', type: 'text', val: item.key||'' },
      { key: 'label', label: 'Display Name', type: 'text', val: item.label||'' },
      { key: 'order', label: 'Sort Order', type: 'number', val: item.order||0 }
    ], function(vals){
      rrkCategories.save({id:id, type:'menu', key:vals.key, label:vals.label, order:parseInt(vals.order)||0}).then(function(){
        rrkCategories.syncToLocal().then(function(){
          loadMenuCategories();
          refreshMenuEditor();
          renderCategoriesInline();
        });
      });
    });
  });
}

function deleteCategoryDocInline(id) {
  if(!confirm('Delete this category? Items will still exist but the filter tab will be removed.')) return;
  rrkCategories.remove(id).then(function(){
    rrkCategories.syncToLocal().then(function(){
      loadMenuCategories();
      refreshMenuEditor();
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
  el.innerHTML = '<h3 style="margin-bottom:16px">Craft My Plate — Item Settings</h3><p class="muted">Loading...</p>';
  rrkMenu.list().then(function(items) {
    window.__adminCraftItems = items;
    var catBtns = '<button class="cms-cat-btn active" onclick="filterAdminCraft(\'all\',this)">All</button>'+
      adminCraftCategories.map(function(c){return'<button class="cms-cat-btn" onclick="filterAdminCraft(\''+c.key+'\',this)">'+c.label+'</button>'}).join('');
    el.innerHTML = '<h3 style="margin-bottom:8px">Craft My Plate — Item Settings</h3>'+
      '<p class="muted" style="margin-bottom:8px">Each menu item can have two prices: online order (per item) and craft catering (per person).</p>'+
      '<p class="muted" style="margin-bottom:16px">Enable items for Craft My Plate and set their per-person price and category.</p>'+
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
    return '<div class="cms-item" style="flex-wrap:nowrap">'+
      '<div class="cms-item-info"><img src="'+(m.image||'')+'" alt="'+m.name+'" class="cms-item-img"><div><b>'+m.name+'</b><span>Online: ₹'+(m.price||0)+' · Craft: '+(m.craftEnabled?'₹'+(m.craftPrice||0)+'/person · '+catLabel:'Disabled')+'</span></div></div>'+
      '<button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;white-space:nowrap" onclick="editCraftItem(\''+m.id+'\')">Craft Settings</button>'+
    '</div>';
  }).join('');
}

function filterAdminCraft(cat, btn) {
  adminActiveCraftCat = cat;
  document.querySelectorAll('#cms-craft .cms-cat-btn').forEach(function(b){b.classList.remove('active');});
  if (btn) btn.classList.add('active');
  renderAdminCraftList(window.__adminCraftItems||[], cat);
}

function craftFields(item) {
  return [
    { key: 'craftEnabled', label: 'Enable for Craft My Plate?', type: 'text', val: item.craftEnabled?'1':'0' },
    { key: 'craftPrice', label: 'Craft Price (per person, ₹)', type: 'number', val: item.craftPrice||0 }
  ];
}

function editCraftItem(id) {
  rrkMenu.list().then(function(items) {
    var item = items.find(function(m) { return m.id === id; }); if (!item) return;
    showItemEditor('Craft Settings: '+item.name, craftFields(item), function(vals) {
      vals.craftEnabled = vals.craftEnabled === '1' || vals.craftEnabled === 'true';
      rrkMenu.save({ id: id, craftEnabled: vals.craftEnabled, craftPrice: vals.craftPrice, craftCategory: item.category }).then(function() { refreshCraftEditor(); });
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
    { key: 'tag', label: 'Tag', type: 'text', val: item.tag||'Fresh Today' }
  ];
}

function editRawDoc(id) {
  rrkRaw.list().then(items => {
    const item = items.find(r => r.id === id); if (!item) return;
    showItemEditor('Raw Item', rawFields(item), (vals) => rrkRaw.save({ id, ...vals }).then(() => renderRawEditor()));
  });
}

function addRawDoc() {
  showItemEditor('New Raw Item', rawFields({}), (vals) => rrkRaw.save(vals).then(() => renderRawEditor()));
}

function deleteRawDoc(id) {
  if (!confirm('Delete?')) return;
  rrkRaw.remove(id).then(() => renderRawEditor());
}

// ============ COMBOS ============
function renderComboEditor() {
  const el = document.getElementById('cms-combos'); if (!el) return;
  el.innerHTML = '<h3 style="margin-bottom:20px">Craft Combos</h3><p class="muted">Loading...</p>';
  rrkCombos.list().then(items => {
    el.innerHTML = `<h3 style="margin-bottom:20px">Craft Combos (${items.length})</h3>
      <div class="cms-list">${items.map(c =>`
        <div class="cms-item"><div><b>${c.name}</b><span>${c.save_badge||''} · ₹${c.price||0} · ${c.description||''}</span></div>
        <div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editComboDoc('${c.id}')">Edit</button><button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteComboDoc('${c.id}')">Delete</button></div></div>`
      ).join('')}</div><button class="btn btn--primary" style="margin-top:16px" onclick="addComboDoc()">+ Add Combo</button>`;
  });
}

function comboFields(item) {
  return [
    { key: 'name', label: 'Name', type: 'text', val: item.name||'' },
    { key: 'save_badge', label: 'Save Badge', type: 'text', val: item.save_badge||'' },
    { key: 'description', label: 'Description', type: 'text', val: item.description||'' },
    { key: 'price', label: 'Price', type: 'number', val: item.price||0 }
  ];
}

function editComboDoc(id) {
  rrkCombos.list().then(items => {
    const item = items.find(c => c.id === id); if (!item) return;
    showItemEditor('Combo', comboFields(item), (vals) => rrkCombos.save({ id, ...vals }).then(() => renderComboEditor()));
  });
}

function addComboDoc() {
  showItemEditor('New Combo', comboFields({}), (vals) => rrkCombos.save(vals).then(() => renderComboEditor()));
}

function deleteComboDoc(id) {
  if (!confirm('Delete?')) return;
  rrkCombos.remove(id).then(() => renderComboEditor());
}

// ============ OCCASIONS ============
function renderOccasionEditor() {
  const el = document.getElementById('cms-occasions'); if (!el) return;
  el.innerHTML = '<h3 style="margin-bottom:20px">Occasion Options</h3><p class="muted">Loading...</p>';
  rrkOccasions.list().then(items => {
    el.innerHTML = `<h3 style="margin-bottom:20px">Occasion Options (${items.length})</h3>
      <div class="cms-list">${items.map(o =>`
        <div class="cms-item"><div><b>${o.emoji} ${o.label}</b></div>
        <div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editOccasionDoc('${o.id}')">Edit</button><button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteOccasionDoc('${o.id}')">Delete</button></div></div>`
      ).join('')}</div><button class="btn btn--primary" style="margin-top:16px" onclick="addOccasionDoc()">+ Add</button>`;
  });
}

function occasionFields(item) {
  return [
    { key: 'emoji', label: 'Emoji', type: 'text', val: item.emoji||'' },
    { key: 'label', label: 'Label', type: 'text', val: item.label||'' }
  ];
}

function editOccasionDoc(id) {
  rrkOccasions.list().then(items => {
    const item = items.find(o => o.id === id); if (!item) return;
    showItemEditor('Occasion', occasionFields(item), (vals) => rrkOccasions.save({ id, ...vals }).then(() => renderOccasionEditor()));
  });
}

function addOccasionDoc() {
  showItemEditor('New Occasion', occasionFields({}), (vals) => rrkOccasions.save(vals).then(() => renderOccasionEditor()));
}

function deleteOccasionDoc(id) {
  if (!confirm('Delete?')) return;
  rrkOccasions.remove(id).then(() => renderOccasionEditor());
}

// ============ CUSTOMERS ============
function renderCustomersEditor() {
  const el = document.getElementById('cms-customers'); if (!el) return;
  el.innerHTML = `<h3 style="margin-bottom:16px">Registered Customers</h3>
    <div style="display:flex;gap:10px;margin-bottom:16px">
      <a href="backend/api/customers.php?action=export-csv" class="btn btn--primary">⬇ Export CSV</a>
      <a href="backend/api/customers.php?action=export-pdf" class="btn btn--gold-outline">⬇ Export PDF</a>
    </div>
    <div id="customers-list"><p class="muted">Loading...</p></div>`;
  rrkCustomers.list().then(data => {
    const list = document.getElementById('customers-list');
    if (!data || data.length === 0) { list.innerHTML='<p class="muted">No customers yet.</p>'; return; }
    list.innerHTML = `<div style="overflow-x:auto"><table class="admin-table"><thead><tr><th>Name</th><th>Phone</th><th>DOB</th><th>Registered</th><th>Action</th></tr></thead><tbody>
      ${data.map(c=>`<tr><td>${c.name}</td><td>${c.phone}</td><td>${c.dob||'—'}</td><td>${c.created_at?.substr(0,10)||''}</td>
      <td><button class="btn" style="padding:4px 10px;font-size:11px;background:#C1121F;color:#fff;border:none" onclick="deleteCustomerDoc('${c.id}')">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
  });
}

function deleteCustomerDoc(id) {
  if (!confirm('Delete?')) return;
  rrkCustomers.remove(id).then(() => renderCustomersEditor());
}

// ============ CONTACT ============
function renderContactEditor() {
  const el = document.getElementById('cms-contact'); if (!el) return;
  el.innerHTML = '<h3 style="margin-bottom:16px">Contact Info</h3><p class="muted">Loading...</p>';
  rrkSettings.get().then(s => {
    el.innerHTML = `<h3 style="margin-bottom:16px">Contact Info</h3>
      ${field('contact_phone','Phone','text',s.contact_phone||'')}${field('contact_whatsapp','WhatsApp','text',s.contact_whatsapp||'')}
      ${field('contact_address','Address','text',s.contact_address||'')}${field('contact_hours','Hours','text',s.contact_hours||'')}
      ${field('contact_maps','Google Maps URL','text',s.contact_maps||'')}
      <button class="btn btn--primary" onclick="saveContactDoc()">Save</button>`;
  });
}

function saveContactDoc() {
  rrkSettings.save({
    contact_phone: g('contact_phone'), contact_whatsapp: g('contact_whatsapp'),
    contact_address: g('contact_address'), contact_hours: g('contact_hours'), contact_maps: g('contact_maps')
  }).then(() => alert('Saved!'));
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
  rrkSettings.save({ social_instagram: g('social_instagram'), social_facebook: g('social_facebook'), social_youtube: g('social_youtube') }).then(() => alert('Saved!'));
}

function saveFooterDoc() {
  rrkSettings.save({ brand_tagline: g('brand_tagline'), footer_copyright: g('footer_copyright') }).then(() => alert('Saved!'));
}

// ============ SETTINGS ============
function renderSettingsEditor() {
  const el = document.getElementById('cms-settings'); if (!el) return;
  el.innerHTML = '<h3 style="margin-bottom:16px">Global Settings</h3><p class="muted">Loading...</p>';
  rrkSettings.get().then(s => {
    el.innerHTML = `<h3 style="margin-bottom:16px">Global Settings</h3>
      ${field('brand_name','Brand Name','text',s.brand_name||'RRK Food Court')}${field('whatsapp','WhatsApp Number','text',s.whatsapp||'919999999999')}
      ${field('admin_pass','Admin Password','text',s.admin_pass||'admin1234')}
      <button class="btn btn--primary" onclick="saveSettingsDoc()">Save Settings</button>
      <hr style="margin:28px 0;border-color:var(--border)" />
      <p class="muted" style="font-size:12px">Data is stored in Firebase Firestore. To reset, delete collections in Firebase Console.</p>`;
  });
}

function saveSettingsDoc() {
  rrkSettings.save({ brand_name: g('brand_name'), whatsapp: g('whatsapp'), admin_pass: g('admin_pass') }).then(() => alert('Saved!'));
}

// ============ HELPERS ============
function g(id) { const el = document.getElementById('field-'+id); return el ? el.value : ''; }
function field(key, label, type, val, opts) {
  if (type === 'select') {
    return '<div class="admin-field"><label>'+label+'</label><select id="field-'+key+'" style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:Inter,sans-serif;font-size:14px;background:#fff">'+(opts||'')+'</select></div>';
  }
  return '<div class="admin-field"><label>'+label+'</label><input type="'+type+'" id="field-'+key+'" value="'+esc(val)+'" /></div>';
}
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

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
  modal.querySelector('#am-save').onclick = () => {
    const vals = {}; fields.forEach(f => { vals[f.key] = document.getElementById('field-'+f.key).value; });
    modal.remove(); onSave(vals);
  };
  modal.querySelector('#am-cancel').onclick = () => modal.remove();
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
