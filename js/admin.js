// ============================================
// RRK ADMIN CMS
// ============================================
const ADMIN_KEY = 'rrk_admin_session';

function loadAdminApp() {
  initSiteData();
  const D = getSiteData() || RRK_DEFAULTS;

  // Collapse all panels, show overview
  document.querySelectorAll('.cms-panel').forEach(p => p.style.display = 'none');
  const overview = document.getElementById('cms-menu');
  if (overview) overview.style.display = 'block';
  renderMenuEditor(D);
  renderRawEditor(D);
  renderComboEditor(D);
  renderOccasionEditor(D);
}

// ============================================
// TAB NAVIGATION
// ============================================
function showTab(tabId) {
  document.querySelectorAll('.cms-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.cms-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('cms-' + tabId);
  const tab = document.querySelector(`.cms-tab[data-tab="${tabId}"]`);
  if (panel) panel.style.display = 'block';
  if (tab) tab.classList.add('active');
}

// ============================================
// MENU EDITOR
// ============================================
function renderMenuEditor(D) {
  const el = document.getElementById('cms-menu');
  if (!el) return;
  el.innerHTML = `<h3 style="margin-bottom:20px">Menu Items (${D.menu.length})</h3>
    <div class="cms-list">${D.menu.map(m =>
      `<div class="cms-item"><div class="cms-item-info"><img src="${m.image}" alt="${m.name}" class="cms-item-img" /><div><b>${m.name}</b><span>${m.category} · ₹${m.price} · ${m.diet} · Special: ${m.special ? m.specialTag : 'No'}</span></div></div>
      <div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editMenuItem(${m.id})">Edit</button><button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteMenuItem(${m.id})">Delete</button></div></div>`
    ).join('')}</div>
    <button class="btn btn--primary" style="margin-top:16px" onclick="addMenuItem()">+ Add Menu Item</button>`;
}

function editMenuItem(id) {
  const D = getSiteData();
  const item = D.menu.find(m => m.id === id);
  if (!item) return;

  const fields = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'select', options: D.categories },
    { key: 'diet', label: 'Diet', type: 'select', options: ['veg', 'nonveg'] },
    { key: 'desc', label: 'Description', type: 'text' },
    { key: 'price', label: 'Price (₹)', type: 'number' },
    { key: 'image', label: 'Image Filename', type: 'text' },
    { key: 'special', label: 'Show on Homepage?', type: 'checkbox' },
    { key: 'specialTag', label: 'Homepage Tag', type: 'text' }
  ];
  showItemEditor('Menu Item',item,fields,()=>{
    const d=getSiteData();
    const idx=d.menu.findIndex(m=>m.id===id);
    if(idx>=0)d.menu[idx]=item;
    setSiteData(d);renderMenuEditor(d);
  });
}

function addMenuItem() {
  const D = getSiteData();
  const newItem = { id: Date.now(), name: 'New Item', category: 'chicken', diet: 'nonveg', desc: '', price: 0, image: '1.jpeg', special: false, specialTag: '' };
  const fields = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'select', options: D.categories },
    { key: 'diet', label: 'Diet', type: 'select', options: ['veg', 'nonveg'] },
    { key: 'desc', label: 'Description', type: 'text' },
    { key: 'price', label: 'Price (₹)', type: 'number' },
    { key: 'image', label: 'Image Filename', type: 'text' },
    { key: 'special', label: 'Show on Homepage?', type: 'checkbox' },
    { key: 'specialTag', label: 'Homepage Tag', type: 'text' }
  ];
  showItemEditor('New Menu Item',newItem,fields,()=>{
    const d=getSiteData();d.menu.push(newItem);
    setSiteData(d);renderMenuEditor(d);
  });
}

function deleteMenuItem(id) {
  if (!confirm('Delete this menu item?')) return;
  const D = getSiteData();
  D.menu = D.menu.filter(m => m.id !== id);
  setSiteData(D);
  renderMenuEditor(D);
}

// ============================================
// RAW CHICKEN EDITOR
// ============================================
function renderRawEditor(D) {
  const el = document.getElementById('cms-raw');
  if (!el) return;
  el.innerHTML = `<h3 style="margin-bottom:20px">Raw Chicken Items (${D.raw.length})</h3>
    <div class="cms-list">${D.raw.map(r =>
      `<div class="cms-item"><div class="cms-item-info"><img src="${r.image}" alt="${r.name}" class="cms-item-img" /><div><b>${r.name}</b><span>₹${r.price}/kg · ${r.weight} · ${r.tag}</span></div></div>
      <div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editRawItem(${r.id})">Edit</button><button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteRawItem(${r.id})">Delete</button></div></div>`
    ).join('')}</div>
    <button class="btn btn--primary" style="margin-top:16px" onclick="addRawItem()">+ Add Raw Item</button>`;
}

function editRawItem(id) {
  const D = getSiteData();const item = D.raw.find(r => r.id === id);if(!item)return;
  const fields=[
    {key:'name',label:'Name',type:'text'},{key:'price',label:'Price (₹/kg)',type:'number'},
    {key:'weight',label:'Weight',type:'text'},{key:'image',label:'Image',type:'text'},{key:'tag',label:'Tag',type:'text'}
  ];
  showItemEditor('Raw Item',item,fields,()=>{
    const d=getSiteData();const idx=d.raw.findIndex(r=>r.id===id);
    if(idx>=0)d.raw[idx]=item;setSiteData(d);renderRawEditor(d);
  });
}

function addRawItem() {
  const newItem={id:Date.now(),name:'New Item',price:0,weight:'1 kg',image:'7.jpeg',tag:'Fresh Today'};
  const fields=[
    {key:'name',label:'Name',type:'text'},{key:'price',label:'Price (₹/kg)',type:'number'},
    {key:'weight',label:'Weight',type:'text'},{key:'image',label:'Image',type:'text'},{key:'tag',label:'Tag',type:'text'}
  ];
  showItemEditor('New Raw Item',newItem,fields,()=>{const d=getSiteData();d.raw.push(newItem);setSiteData(d);renderRawEditor(d);});
}

function deleteRawItem(id) {
  if(!confirm('Delete?'))return;const D=getSiteData();D.raw=D.raw.filter(r=>r.id!==id);setSiteData(D);renderRawEditor(D);
}

// ============================================
// COMBO EDITOR
// ============================================
function renderComboEditor(D) {
  const el = document.getElementById('cms-combos');
  if (!el) return;
  el.innerHTML = `<h3 style="margin-bottom:20px">Craft Combos (${D.combos.length})</h3>
    <div class="cms-list">${D.combos.map(c =>
      `<div class="cms-item"><div class="cms-item-info"><div><b>${c.name}</b><span>${c.saveBadge} · ₹${c.price} · ${c.desc}</span></div></div>
      <div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editComboItem(${c.id})">Edit</button><button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteComboItem(${c.id})">Delete</button></div></div>`
    ).join('')}</div>
    <button class="btn btn--primary" style="margin-top:16px" onclick="addComboItem()">+ Add Combo</button>`;
}

function editComboItem(id) {
  const D=getSiteData();const item=D.combos.find(c=>c.id===id);if(!item)return;
  const fields=[
    {key:'name',label:'Name',type:'text'},{key:'saveBadge',label:'Save Badge',type:'text'},
    {key:'desc',label:'Description',type:'text'},{key:'price',label:'Price',type:'number'}
  ];
  showItemEditor('Combo',item,fields,()=>{
    const d=getSiteData();const idx=d.combos.findIndex(c=>c.id===id);
    if(idx>=0)d.combos[idx]=item;setSiteData(d);renderComboEditor(d);
  });
}

function addComboItem() {
  const newItem={id:Date.now(),name:'New Combo',saveBadge:'Save ₹X',desc:'',price:0};
  const fields=[
    {key:'name',label:'Name',type:'text'},{key:'saveBadge',label:'Save Badge',type:'text'},
    {key:'desc',label:'Description',type:'text'},{key:'price',label:'Price',type:'number'}
  ];
  showItemEditor('New Combo',newItem,fields,()=>{const d=getSiteData();d.combos.push(newItem);setSiteData(d);renderComboEditor(d);});
}

function deleteComboItem(id) {
  if(!confirm('Delete?'))return;const D=getSiteData();D.combos=D.combos.filter(c=>c.id!==id);setSiteData(D);renderComboEditor(D);
}

// ============================================
// OCCASION EDITOR
// ============================================
function renderOccasionEditor(D) {
  const el = document.getElementById('cms-occasions');
  if (!el) return;
  el.innerHTML = `<h3 style="margin-bottom:20px">Occasion Options</h3>
    <div class="cms-list">${D.occasions.map((o,i) =>
      `<div class="cms-item"><div class="cms-item-info"><div><b>${o.emoji} ${o.label}</b></div></div>
      <div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editOccasionItem(${i})">Edit</button><button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteOccasionItem(${i})">Delete</button></div></div>`
    ).join('')}</div>
    <button class="btn btn--primary" style="margin-top:16px" onclick="addOccasionItem()">+ Add Occasion</button>`;
}

function editOccasionItem(idx) {
  const D=getSiteData();const item=D.occasions[idx];if(!item)return;
  const fields=[{key:'emoji',label:'Emoji',type:'text'},{key:'label',label:'Label',type:'text'}];
  showItemEditor('Occasion',item,fields,()=>{D.occasions[idx]=item;setSiteData(D);renderOccasionEditor(D);});
}

function addOccasionItem() {
  const newItem={emoji:'🎉',label:'New'};
  const fields=[{key:'emoji',label:'Emoji',type:'text'},{key:'label',label:'Label',type:'text'}];
  showItemEditor('New Occasion',newItem,fields,()=>{const d=getSiteData();d.occasions.push(newItem);setSiteData(d);renderOccasionEditor(d);});
}

function deleteOccasionItem(idx) {
  if(!confirm('Delete?'))return;const D=getSiteData();D.occasions.splice(idx,1);setSiteData(D);renderOccasionEditor(D);
}

// ============================================
// HERO EDITOR
// ============================================
function renderHeroEditor(D) {
  ['cms-hero','cms-hero-badge','cms-hero-stats'].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    if(id==='cms-hero')el.innerHTML=`<h3 style="margin-bottom:16px">Hero Section</h3>
      ${formField('eyebrow','Eyebrow','text',D.hero.eyebrow)}${formField('headlineL1','Headline Line 1','text',D.hero.headlineL1)}
      ${formField('headlineGold','Headline (Gold Word)','text',D.hero.headlineGold)}${formField('lead','Description','textarea',D.hero.lead)}
      ${formField('image','Image','text',D.hero.image)}
      <button class="btn btn--primary" onclick="saveHero()">Save Hero</button>`;
    if(id==='cms-hero-badge')el.innerHTML=`<h3 style="margin-bottom:16px">Hero Badge</h3>
      ${formField('badgeMain','Main Text','text',D.heroBadge.main)}${formField('badgeSub','Sub Text','text',D.heroBadge.sub)}
      <button class="btn btn--primary" onclick="saveHeroBadge()">Save Badge</button>`;
    if(id==='cms-hero-stats')el.innerHTML=`<h3 style="margin-bottom:16px">Hero Stats</h3>
      <div class="cms-list">${D.heroStats.map((s,i)=>
        `<div class="cms-item"><div><b>${s.count}${s.suffix}</b> · ${s.label}</div><div><button class="btn btn--gold-outline" style="padding:4px 10px;font-size:11px;margin-right:4px" onclick="editStat(${i})">Edit</button><button class="btn" style="padding:4px 10px;font-size:11px;background:#C1121F;color:#fff;border:none" onclick="deleteStat(${i})">X</button></div></div>`
      ).join('')}</div><button class="btn btn--primary" style="margin-top:12px" onclick="addStat()">+ Add Stat</button>`;
  });
}

function saveHero() {
  const D=getSiteData();
  D.hero.eyebrow=document.getElementById('field-eyebrow').value;
  D.hero.headlineL1=document.getElementById('field-headlineL1').value;
  D.hero.headlineGold=document.getElementById('field-headlineGold').value;
  D.hero.lead=document.getElementById('field-lead').value;
  D.hero.image=document.getElementById('field-image').value;
  setSiteData(D);alert('Hero saved!');
}

function saveHeroBadge() {
  const D=getSiteData();
  D.heroBadge.main=document.getElementById('field-badgeMain').value;
  D.heroBadge.sub=document.getElementById('field-badgeSub').value;
  setSiteData(D);alert('Badge saved!');
}

function editStat(idx) {
  const D=getSiteData();const s=D.heroStats[idx];if(!s)return;
  const fields=[{key:'count',label:'Count',type:'number'},{key:'suffix',label:'Suffix',type:'text'},{key:'label',label:'Label',type:'text'}];
  showItemEditor('Stat',s,fields,()=>{D.heroStats[idx]=s;setSiteData(D);renderHeroEditor(D);});
}

function addStat() {
  const newStat={count:0,suffix:'',label:'',duration:1500};
  const fields=[{key:'count',label:'Count',type:'number'},{key:'suffix',label:'Suffix',type:'text'},{key:'label',label:'Label',type:'text'}];
  showItemEditor('New Stat',newStat,fields,()=>{const d=getSiteData();d.heroStats.push(newStat);setSiteData(d);renderHeroEditor(d);});
}

function deleteStat(idx) {if(!confirm('Delete?'))return;const D=getSiteData();D.heroStats.splice(idx,1);setSiteData(D);renderHeroEditor(D);}

// ============================================
// TESTIMONIALS EDITOR
// ============================================
function renderTestimonialEditor(D) {
  const el=document.getElementById('cms-testimonials');if(!el)return;
  el.innerHTML=`<h3 style="margin-bottom:20px">Testimonials (${D.testimonials.length})</h3>
    <div class="cms-list">${D.testimonials.map((t,i)=>
      `<div class="cms-item"><div class="cms-item-info"><div><b>${t.author}</b><span>${t.subtitle} · ${'★'.repeat(t.stars)}</span><p style="font-size:13px;color:var(--muted);margin-top:4px">"${t.quote}"</p></div></div>
      <div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editTestimonial(${t.id})">Edit</button><button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteTestimonial(${t.id})">Delete</button></div></div>`
    ).join('')}</div>
    <button class="btn btn--primary" style="margin-top:16px" onclick="addTestimonial()">+ Add Testimonial</button>`;
}

function editTestimonial(id) {
  const D=getSiteData();const t=D.testimonials.find(x=>x.id===id);if(!t)return;
  const fields=[
    {key:'avatar',label:'Avatar Emoji',type:'text'},{key:'stars',label:'Stars (1-5)',type:'number'},
    {key:'quote',label:'Quote',type:'textarea'},{key:'author',label:'Author',type:'text'},{key:'subtitle',label:'Subtitle',type:'text'}
  ];
  showItemEditor('Testimonial',t,fields,()=>{
    const d=getSiteData();const idx=d.testimonials.findIndex(x=>x.id===id);
    if(idx>=0)d.testimonials[idx]=t;setSiteData(d);renderTestimonialEditor(d);
  });
}

function addTestimonial() {
  const newItem={id:Date.now(),avatar:'👤',stars:5,quote:'',author:'',subtitle:''};
  const fields=[
    {key:'avatar',label:'Avatar Emoji',type:'text'},{key:'stars',label:'Stars',type:'number'},
    {key:'quote',label:'Quote',type:'textarea'},{key:'author',label:'Author',type:'text'},{key:'subtitle',label:'Subtitle',type:'text'}
  ];
  showItemEditor('New Testimonial',newItem,fields,()=>{const d=getSiteData();d.testimonials.push(newItem);setSiteData(d);renderTestimonialEditor(d);});
}

function deleteTestimonial(id) {
  if(!confirm('Delete?'))return;const D=getSiteData();D.testimonials=D.testimonials.filter(x=>x.id!==id);setSiteData(D);renderTestimonialEditor(D);
}

// ============================================
// INSTAGRAM EDITOR
// ============================================
function renderInstagramEditor(D) {
  const el=document.getElementById('cms-instagram');if(!el)return;
  el.innerHTML=`<h3 style="margin-bottom:20px">Instagram Feed (${D.instagram.length})</h3>
    <div class="cms-list">${D.instagram.map((ig,i)=>
      `<div class="cms-item"><div class="cms-item-info"><img src="${ig.image}" alt="${ig.caption}" class="cms-item-img" /><div><b>${ig.caption}</b><span>${ig.image}</span></div></div>
      <div class="cms-item-actions"><button class="btn btn--gold-outline" style="padding:6px 14px;font-size:12px;margin-right:6px" onclick="editIgItem(${ig.id})">Edit</button><button class="btn" style="padding:6px 14px;font-size:12px;background:#C1121F;color:#fff;border:none" onclick="deleteIgItem(${ig.id})">Delete</button></div></div>`
    ).join('')}</div>
    <button class="btn btn--primary" style="margin-top:16px" onclick="addIgItem()">+ Add Instagram Item</button>`;
}

function editIgItem(id) {
  const D=getSiteData();const item=D.instagram.find(x=>x.id===id);if(!item)return;
  const fields=[{key:'image',label:'Image',type:'text'},{key:'caption',label:'Caption',type:'text'}];
  showItemEditor('Instagram',item,fields,()=>{
    const d=getSiteData();const idx=d.instagram.findIndex(x=>x.id===id);
    if(idx>=0)d.instagram[idx]=item;setSiteData(d);renderInstagramEditor(d);
  });
}

function addIgItem() {
  const newItem={id:Date.now(),image:'10.jpeg',caption:'New'};
  const fields=[{key:'image',label:'Image',type:'text'},{key:'caption',label:'Caption',type:'text'}];
  showItemEditor('New Instagram',newItem,fields,()=>{const d=getSiteData();d.instagram.push(newItem);setSiteData(d);renderInstagramEditor(d);});
}

function deleteIgItem(id) {
  if(!confirm('Delete?'))return;const D=getSiteData();D.instagram=D.instagram.filter(x=>x.id!==id);setSiteData(D);renderInstagramEditor(D);
}

// ============================================
// ABOUT EDITOR
// ============================================
function renderAboutEditor(D) {
  const el=document.getElementById('cms-about');if(!el)return;
  el.innerHTML=`<h3 style="margin-bottom:16px">About Section</h3>
    ${formField('aboutEyebrow','Eyebrow','text',D.about.eyebrow)}${formField('aboutHL1','Headline Line 1','text',D.about.headlineL1)}
    ${formField('aboutHL2','Headline Line 2','text',D.about.headlineL2)}${formField('aboutBody','Body Text','textarea',D.about.body)}
    ${formField('aboutImage','Image','text',D.about.image)}${formField('aboutBtn','Button Text','text',D.about.buttonText)}
    <button class="btn btn--primary" onclick="saveAbout()">Save About</button>`;
}

function saveAbout() {
  const D=getSiteData();
  D.about.eyebrow=document.getElementById('field-aboutEyebrow').value;
  D.about.headlineL1=document.getElementById('field-aboutHL1').value;
  D.about.headlineL2=document.getElementById('field-aboutHL2').value;
  D.about.body=document.getElementById('field-aboutBody').value;
  D.about.image=document.getElementById('field-aboutImage').value;
  D.about.buttonText=document.getElementById('field-aboutBtn').value;
  setSiteData(D);alert('About saved!');
}

// ============================================
// WHY CARDS EDITOR
// ============================================
function renderWhyCardsEditor(D) {
  const el=document.getElementById('cms-why');if(!el)return;
  el.innerHTML=`<h3 style="margin-bottom:16px">Why Cards Section</h3>
    ${formField('whyEyebrow','Eyebrow','text',D.whySection.eyebrow)}${formField('whyHeadline','Headline','text',D.whySection.headline)}
    <div class="cms-list" style="margin-top:16px">${D.whyCards.map((w,i)=>
      `<div class="cms-item"><div>${w.icon} <b>${w.title}</b> · ${w.desc}</div><div><button class="btn btn--gold-outline" style="padding:4px 10px;font-size:11px;margin-right:4px" onclick="editWhyCard(${i})">Edit</button><button class="btn" style="padding:4px 10px;font-size:11px;background:#C1121F;color:#fff;border:none" onclick="deleteWhyCard(${i})">X</button></div></div>`
    ).join('')}</div>
    <button class="btn btn--primary" style="margin-top:12px" onclick="saveWhySection()">Save</button>
    <button class="btn btn--gold-outline" style="margin-top:12px" onclick="addWhyCard()">+ Add Card</button>`;
}

function saveWhySection() {
  const D=getSiteData();
  D.whySection.eyebrow=document.getElementById('field-whyEyebrow').value;
  D.whySection.headline=document.getElementById('field-whyHeadline').value;
  setSiteData(D);alert('Why cards saved!');
}

function editWhyCard(idx) {
  const D=getSiteData();const w=D.whyCards[idx];if(!w)return;
  const fields=[{key:'icon',label:'Icon Emoji',type:'text'},{key:'title',label:'Title',type:'text'},{key:'desc',label:'Description',type:'text'}];
  showItemEditor('Card',w,fields,()=>{D.whyCards[idx]=w;setSiteData(D);renderWhyCardsEditor(D);});
}

function addWhyCard() {
  const newItem={icon:'⭐',title:'New',desc:''};
  const fields=[{key:'icon',label:'Icon',type:'text'},{key:'title',label:'Title',type:'text'},{key:'desc',label:'Description',type:'text'}];
  showItemEditor('New Card',newItem,fields,()=>{const d=getSiteData();d.whyCards.push(newItem);setSiteData(d);renderWhyCardsEditor(d);});
}

function deleteWhyCard(idx) {if(!confirm('Delete?'))return;const D=getSiteData();D.whyCards.splice(idx,1);setSiteData(D);renderWhyCardsEditor(D);}

// ============================================
// CONTACT EDITOR
// ============================================
function renderContactEditor(D) {
  const el=document.getElementById('cms-contact');if(!el)return;
  el.innerHTML=`<h3 style="margin-bottom:16px">Contact Info</h3>
    ${formField('contactPhone','Phone','text',D.contact.phone)}${formField('contactPhoneRaw','Phone (no spaces)','text',D.contact.phoneRaw)}
    ${formField('contactWhatsapp','WhatsApp Display','text',D.contact.whatsapp)}${formField('contactAddress','Address','text',D.contact.address)}
    ${formField('contactHours','Hours','text',D.contact.hours)}${formField('contactMaps','Google Maps Embed URL','textarea',D.contact.mapsUrl)}
    <button class="btn btn--primary" onclick="saveContact()">Save Contact</button>`;
}

function saveContact() {
  const D=getSiteData();
  D.contact.phone=document.getElementById('field-contactPhone').value;
  D.contact.phoneRaw=document.getElementById('field-contactPhoneRaw').value;
  D.contact.whatsapp=document.getElementById('field-contactWhatsapp').value;
  D.contact.address=document.getElementById('field-contactAddress').value;
  D.contact.hours=document.getElementById('field-contactHours').value;
  D.contact.mapsUrl=document.getElementById('field-contactMaps').value;
  setSiteData(D);alert('Contact saved!');
}

// ============================================
// SOCIAL / FOOTER EDITOR
// ============================================
function renderSocialEditor(D) {
  const el=document.getElementById('cms-social');if(!el)return;
  el.innerHTML=`<h3 style="margin-bottom:16px">Social Links</h3>
    ${formField('socialIG','Instagram URL','text',D.social.instagram)}${formField('socialFB','Facebook URL','text',D.social.facebook)}
    ${formField('socialYT','YouTube URL','text',D.social.youtube)}
    <button class="btn btn--primary" onclick="saveSocial()">Save Social</button><hr style="margin:20px 0;border-color:var(--border)" />
    <h3 style="margin-bottom:16px">Footer</h3>
    ${formField('footerCopy','Copyright','text',D.footer.copyright)}
    <button class="btn btn--primary" onclick="saveFooter()">Save Footer</button>`;
}

function saveSocial() {
  const D=getSiteData();
  D.social.instagram=document.getElementById('field-socialIG').value;
  D.social.facebook=document.getElementById('field-socialFB').value;
  D.social.youtube=document.getElementById('field-socialYT').value;
  setSiteData(D);alert('Social links saved!');
}

function saveFooter() {
  const D=getSiteData();
  D.footer.copyright=document.getElementById('field-footerCopy').value;
  setSiteData(D);alert('Footer saved!');
}

// ============================================
// SETTINGS EDITOR
// ============================================
function renderSettingsEditor(D) {
  const el=document.getElementById('cms-settings');if(!el)return;
  el.innerHTML=`<h3 style="margin-bottom:16px">Global Settings</h3>
    ${formField('brandName','Brand Name','text',D.brand.name)}${formField('brandTagline','Tagline','text',D.brand.tagline)}
    ${formField('whatsappNum','WhatsApp Number','text',D.whatsapp)}
    <h4 style="margin-top:20px">Craft Config</h4>
    ${formField('craftPplMin','People Min','number',D.craftConfig.peopleMin)}${formField('craftPplMax','People Max','number',D.craftConfig.peopleMax)}
    ${formField('craftPplDef','People Default','number',D.craftConfig.peopleDefault)}
    ${formField('craftBudMin','Budget Min','number',D.craftConfig.budgetMin)}${formField('craftBudMax','Budget Max','number',D.craftConfig.budgetMax)}
    ${formField('craftBudDef','Budget Default','number',D.craftConfig.budgetDefault)}
    <button class="btn btn--primary" onclick="saveSettings()">Save Settings</button>
    <hr style="margin:28px 0;border-color:var(--border)" />
    <button class="btn" style="background:#C1121F;color:#fff" onclick="resetAll()">⚠️ Reset All Data to Defaults</button>`;
}

function saveSettings() {
  const D=getSiteData();
  D.brand.name=document.getElementById('field-brandName').value;
  D.brand.tagline=document.getElementById('field-brandTagline').value;
  D.whatsapp=document.getElementById('field-whatsappNum').value;
  D.craftConfig.peopleMin=parseInt(document.getElementById('field-craftPplMin').value);
  D.craftConfig.peopleMax=parseInt(document.getElementById('field-craftPplMax').value);
  D.craftConfig.peopleDefault=parseInt(document.getElementById('field-craftPplDef').value);
  D.craftConfig.budgetMin=parseInt(document.getElementById('field-craftBudMin').value);
  D.craftConfig.budgetMax=parseInt(document.getElementById('field-craftBudMax').value);
  D.craftConfig.budgetDefault=parseInt(document.getElementById('field-craftBudDef').value);
  setSiteData(D);alert('Settings saved!');
}

function resetAll() {
  if(!confirm('⚠️ This will DELETE ALL custom data and restore defaults. Continue?'))return;
  if(!confirm('Are you ABSOLUTELY sure?'))return;
  localStorage.removeItem('rrk_site_data');
  initSiteData();
  loadAdminApp();
  alert('Reset complete!');
}

// ============================================
// REUSABLE FORM HELPERS
// ============================================
function formField(key,label,type,value) {
  if(type==='textarea') return `<div class="admin-field"><label>${label}</label><textarea id="field-${key}" rows="3">${value||''}</textarea></div>`;
  return `<div class="admin-field"><label>${label}</label><input type="${type}" id="field-${key}" value="${value||''}" /></div>`;
}

function showItemEditor(title,item,fields,onSave) {
  const existing=document.querySelector('.admin-modal');
  if(existing)existing.remove();
  const modal=document.createElement('div');
  modal.className='admin-modal';
  modal.innerHTML=`<div class="admin-modal__card"><h3>${title}</h3>
    ${fields.map(f=>formField(f.key,f.label,f.type,item[f.key])).join('')}
    <div style="display:flex;gap:10px;margin-top:16px"><button class="btn btn--primary btn--block" id="admin-modal-save">Save</button><button class="btn btn--gold-outline btn--block" id="admin-modal-cancel">Cancel</button></div></div>`;
  document.body.appendChild(modal);
  modal.querySelector('#admin-modal-save').onclick=()=>{
    fields.forEach(f=>{item[f.key]=document.getElementById('field-'+f.key).value;if(f.type==='number')item[f.key]=parseFloat(item[f.key])||0;if(f.type==='checkbox')item[f.key]=document.getElementById('field-'+f.key).checked;});
    modal.remove();onSave();
  };
  modal.querySelector('#admin-modal-cancel').onclick=()=>modal.remove();
  if(fields.some(f=>f.type==='checkbox'))fields.forEach(f=>{if(f.type==='checkbox')document.getElementById('field-'+f.key).checked=item[f.key];});
}
