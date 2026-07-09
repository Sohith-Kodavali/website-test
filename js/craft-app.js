// ============================================
// RRK CRAFT MY PLATE · 6-Step App Controller
// ============================================
var CpApp = (function() {
  var state = {
    guests: 0,
    guestsValid: false,
    activeCombo: null,
    activeMode: 'combo', // 'combo' | 'scratch'
    comboItems: [],     // [{cat, idx}]
    sandboxChecked: {},
    sandboxTab: 'starters',
    occasion: '',
    upgrades: {},       // {boneless: bool, livecounter: bool, welcome: bool}
    couponType: '',     // 'bday' | 'corp' | 'wedding' | 'house'
    freeDelivery: false
  };

  var D = window.SITE_DATA || (function() {
    try { return JSON.parse(localStorage.getItem('rrk_site_data')) || {}; } catch(e) { return {}; }
  })();

  var subs = []; // subscribers for recalc

  function notify() { subs.forEach(function(fn) { fn(); }); }

  function onSubscribe(fn) { subs.push(fn); }

  function getGuests() { return state.guests; }
  function isGuestsValid() { return state.guestsValid; }
  function getActiveCombo() { return state.activeCombo; }
  function getActiveMode() { return state.activeMode; }
  function getComboItems() { return state.comboItems; }
  function getSandboxChecked() { return state.sandboxChecked; }
  function getUpgrades() { return state.upgrades; }
  function getOccasion() { return state.occasion; }
  function getCouponType() { return state.couponType; }
  function hasFreeDelivery() { return state.freeDelivery; }
  function getD() { return D; }

  // ========== GUEST COUNT ==========
  function setGuests(n) {
    n = parseInt(n) || 0;
    var inp = document.getElementById('cpGuestCount');
    if (inp) inp.value = n;
    updateGuestState(n);
  }

  function onGuestChange() {
    var inp = document.getElementById('cpGuestCount');
    var n = parseInt(inp.value) || 0;
    updateGuestState(n);
  }

  function updateGuestState(n) {
    var valid = n >= (D.craftConfig && D.craftConfig.guestMin || 20);
    state.guests = n;
    state.guestsValid = valid;

    var msgEl = document.getElementById('cpValidMsg');
    var okEl = document.getElementById('cpGuestOk');
    var okCount = document.getElementById('cpGuestOkCount');
    var step3 = document.getElementById('step3');
    var step4 = document.getElementById('step4');
    var step5 = document.getElementById('step5');
    var step6 = document.getElementById('step6');
    var bar = document.getElementById('cpCheckoutBar');

    if (!valid) {
      if (msgEl) msgEl.style.display = 'block';
      if (okEl) okEl.style.display = 'none';
      if (step3) step3.classList.remove('cp-step-unlocked');
      if (step4) step4.style.display = 'none';
      if (step5) step5.style.display = 'none';
      if (step6) step6.style.display = 'none';
      if (bar) { bar.classList.remove('visible'); bar.style.display = 'none'; }
    } else {
      if (msgEl) msgEl.style.display = 'none';
      if (okEl) { okEl.style.display = 'block'; if (okCount) okCount.textContent = n; }
      if (step3) step3.classList.add('cp-step-unlocked');
      updateComboPrices();
      updateCheckoutBar();
    }
    notify();
  }

  // ========== COMBO SELECTION ==========
  function updateComboPrices() {
    var g = state.guests;
    var totals = document.querySelectorAll('.cp-combo-total');
    totals.forEach(function(el) {
      var base = parseInt(el.getAttribute('data-base')) || 0;
      el.textContent = (g * base).toLocaleString('en-IN');
    });
  }

  function selectCombo(comboKey) {
    state.activeCombo = comboKey;
    state.activeMode = 'combo';
    var def = D.comboDefs && D.comboDefs[comboKey];
    if (!def) return;

    // Populate combo items
    state.comboItems = def.items.map(function(ref) {
      var item = D.craftMenu[ref.cat][ref.idx];
      return { cat: ref.cat, idx: ref.idx, name: item.name, price: item.price, diet: item.diet };
    });

    // Show step 4
    var step4 = document.getElementById('step4');
    var step5 = document.getElementById('step5');
    var step6 = document.getElementById('step6');
    var nameEl = document.getElementById('cp4ComboName');

    if (nameEl) nameEl.textContent = def.label;
    if (step4) step4.style.display = 'block';
    if (step5) step5.style.display = 'none';
    if (step6) step6.style.display = 'block';

    renderComboItems();
    resetUpgrades();
    recalc();
    updateCheckoutBar();

    if (step4) step4.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderComboItems() {
    var container = document.getElementById('cp4Items');
    if (!container) return;

    var html = '';
    state.comboItems.forEach(function(item, i) {
      var swapOpts = getSwapOptions(item.cat, item.idx);
      html += '<div class="cp4-item" data-cat="'+item.cat+'" data-idx="'+item.idx+'" data-i="'+i+'">'+
        '<span class="cp4-name">'+item.name+'</span>'+
        '<span class="cp4-price">₹'+item.price+'/person</span>'+
        '<button class="btn btn--swap" onclick="CpApp.toggleSwap(event)" title="Swap">🔄 Swap</button>'+
        '<div class="cp4-swap-drop" style="display:none"><select onchange="CpApp.doSwap(this)">'+swapOpts+'</select></div>'+
      '</div>';
    });
    container.innerHTML = html;
  }

  function getSwapOptions(cat, excludeIdx) {
    var items = D.craftMenu[cat];
    if (!items) return '';
    return items.map(function(item, i) {
      var sel = (i === excludeIdx) ? ' selected' : '';
      return '<option value="'+i+'"'+sel+'>'+item.name+'</option>';
    }).join('');
  }

  function toggleSwap(e) {
    var parent = e.target.closest('.cp4-item');
    if (!parent) return;
    var drop = parent.querySelector('.cp4-swap-drop');
    if (!drop) return;
    var isOpen = drop.style.display === 'block';
    // Close all
    document.querySelectorAll('.cp4-swap-drop').forEach(function(d) { d.style.display = 'none'; });
    if (!isOpen) {
      drop.style.display = 'block';
    }
  }

  function doSwap(selectEl) {
    var parent = selectEl.closest('.cp4-item');
    var i = parseInt(parent.getAttribute('data-i'));
    var newIdx = parseInt(selectEl.value);
    var cat = parent.getAttribute('data-cat');
    if (isNaN(i) || !cat) return;

    var item = D.craftMenu[cat][newIdx];
    state.comboItems[i] = { cat: cat, idx: newIdx, name: item.name, price: item.price, diet: item.diet };
    renderComboItems();
    updateCheckoutBar();

    // Close dropdown
    var drop = parent.querySelector('.cp4-swap-drop');
    if (drop) drop.style.display = 'none';
  }

  function resetUpgrades() {
    state.upgrades = { boneless: false, livecounter: false, welcome: false };
    var cbBoneless = document.getElementById('cpUpgradeBoneless');
    var cbLive = document.getElementById('cpUpgradeLiveCounter');
    var cbWelcome = document.getElementById('cpUpgradeWelcome');
    if (cbBoneless) cbBoneless.checked = false;
    if (cbLive) cbLive.checked = false;
    if (cbWelcome) cbWelcome.checked = false;
  }

  // ========== SCRATCH / SANDBOX ==========
  function showScratch() {
    state.activeMode = 'scratch';
    state.activeCombo = null;
    state.sandboxChecked = {};
    state.comboItems = [];

    var step4 = document.getElementById('step4');
    var step5 = document.getElementById('step5');
    var step6 = document.getElementById('step6');

    if (step4) step4.style.display = 'none';
    if (step5) {
      step5.style.display = 'block';
      // Reset panels
      var panels = step5.querySelectorAll('.cp5-panel');
      panels.forEach(function(p) { p.classList.remove('active'); });
      var firstPanel = step5.querySelector('.cp5-panel');
      if (firstPanel) firstPanel.classList.add('active');
      // Reset tabs
      var tabs = step5.querySelectorAll('.cp5-tab');
      tabs.forEach(function(t, i) { t.classList.toggle('active', i === 0); });
      // Uncheck all
      var checkboxes = step5.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(function(cb) { cb.checked = false; });
      // Remove checked classes
      step5.querySelectorAll('.cp5-item.checked').forEach(function(el) { el.classList.remove('checked'); });
    }
    if (step6) step6.style.display = 'block';

    updateSandboxStats();
    updateCheckoutBar();
    if (step5) step5.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function backToCombos() {
    var step5 = document.getElementById('step5');
    var step3 = document.getElementById('step3');
    if (step5) step5.style.display = 'none';
    if (step3) step3.scrollIntoView({ behavior: 'smooth', block: 'start' });
    state.activeMode = 'combo';
    state.activeCombo = null;
    state.sandboxChecked = {};
    updateCheckoutBar();
  }

  function switchTab(cat, e) {
    state.sandboxTab = cat;
    var step5 = document.getElementById('step5');
    if (!step5) return;

    step5.querySelectorAll('.cp5-tab').forEach(function(t) { t.classList.remove('active'); });
    step5.querySelectorAll('.cp5-panel').forEach(function(p) { p.classList.remove('active'); });

    if (e && e.target) e.target.classList.add('active');
    var panel = step5.querySelector('.cp5-panel[data-cat="'+cat+'"]');
    if (panel) panel.classList.add('active');
  }

  function sandboxToggle() {
    var step5 = document.getElementById('step5');
    if (!step5) return;

    state.sandboxChecked = {};
    var checkboxes = step5.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(cb) {
      var cat = cb.getAttribute('data-cat');
      var idx = parseInt(cb.getAttribute('data-idx'));
      var checked = cb.checked;
      // Toggle checked class on parent
      var parent = cb.closest('.cp5-item');
      if (parent) { parent.classList.toggle('checked', checked); }
      if (checked) {
        var item = D.craftMenu[cat] && D.craftMenu[cat][idx];
        if (!state.sandboxChecked[cat]) state.sandboxChecked[cat] = {};
        state.sandboxChecked[cat][idx] = { name: item.name, price: item.price, diet: item.diet };
      }
    });

    updateSandboxStats();
    updateCheckoutBar();
  }

  function updateSandboxStats() {
    var totalItems = 0;
    var perPlate = 0;
    var cats = Object.keys(state.sandboxChecked);
    cats.forEach(function(cat) {
      var indices = Object.keys(state.sandboxChecked[cat]);
      indices.forEach(function(idx) {
        totalItems++;
        perPlate += state.sandboxChecked[cat][idx].price;
      });
    });

    var perPlateEl = document.getElementById('cp5PerPlate');
    var itemCountEl = document.getElementById('cp5ItemCount');
    var warningEl = document.getElementById('cp5Warning');

    if (perPlateEl) perPlateEl.textContent = perPlate.toLocaleString('en-IN');
    if (itemCountEl) itemCountEl.textContent = totalItems;
    if (warningEl) {
      warningEl.style.display = (totalItems < 5 && state.activeMode === 'scratch') ? 'block' : 'none';
    }
  }

  function sandboxItemCount() {
    var count = 0;
    Object.keys(state.sandboxChecked).forEach(function(cat) {
      count += Object.keys(state.sandboxChecked[cat]).length;
    });
    return count;
  }

  function sandboxPerPlate() {
    var total = 0;
    Object.keys(state.sandboxChecked).forEach(function(cat) {
      Object.keys(state.sandboxChecked[cat]).forEach(function(idx) {
        total += state.sandboxChecked[cat][idx].price;
      });
    });
    return total;
  }

  // ========== OCCASION & COUPONS ==========
  function onOccasionChange() {
    var sel = document.getElementById('cpOccasion');
    state.occasion = sel ? sel.value : '';
    var couponEl = document.getElementById('cp6Coupon');
    var freeDelEl = document.getElementById('cp6FreeDelivery');

    if (!couponEl) return;

    // Reset coupons
    couponEl.style.display = 'none';
    couponEl.className = 'cp6-coupon';
    state.couponType = '';

    if (state.occasion === 'Birthday Party') {
      couponEl.style.display = 'block';
      couponEl.className = 'cp6-coupon bday';
      couponEl.innerHTML = '🎁 <strong>Code BDAYFREE applied!</strong> Free custom welcome drinks added for all your <strong>'+state.guests+'</strong> guests!';
      state.couponType = 'bday';
    } else if (state.occasion === 'Corporate Event') {
      couponEl.style.display = 'block';
      couponEl.className = 'cp6-coupon corp';
      couponEl.innerHTML = '💼 <strong>Code CORP10 applied!</strong> 10% discount subtracted from your total bill.';
      state.couponType = 'corp';
    } else if (state.occasion === 'Wedding/Engagement') {
      couponEl.style.display = 'block';
      couponEl.className = 'cp6-coupon wedding';
      couponEl.innerHTML = '💍 <strong>Special Wedding Pricing!</strong> Complimentary dessert platter for the couple.';
      state.couponType = 'wedding';
    } else if (state.occasion === 'Casual House Party') {
      couponEl.style.display = 'block';
      couponEl.className = 'cp6-coupon house';
      couponEl.innerHTML = '🏠 <strong>House Party Bonus!</strong> Extra starter item added at no extra cost.';
      state.couponType = 'house';
    }

    // Free delivery check
    updateFreeDelivery();
    updateCheckoutBar();
  }

  function updateFreeDelivery() {
    var total = calcGrandTotal();
    state.freeDelivery = (total >= 40000);
    var freeDelEl = document.getElementById('cp6FreeDelivery');
    if (freeDelEl) {
      freeDelEl.style.display = state.freeDelivery ? 'block' : 'none';
    }
  }

  // ========== PRICING ==========
  function calcGrandTotal() {
    if (!state.guestsValid) return 0;
    var g = state.guests;

    if (state.activeMode === 'combo' && state.activeCombo) {
      var def = D.comboDefs[state.activeCombo];
      var basePrice = def ? def.pricePer : 0;
      var upgradeCost = 0;
      if (state.upgrades.boneless) upgradeCost += 40;
      if (state.upgrades.livecounter) upgradeCost += 80;
      if (state.upgrades.welcome) upgradeCost += 25;
      var total = g * (basePrice + upgradeCost);

      // Apply coupon
      if (state.couponType === 'corp') total = total * 0.9;
      if (state.couponType === 'bday') total = total; // free drinks, no price change
      if (state.freeDelivery) total = total; // free delivery saved separately

      return Math.round(total);
    }

    if (state.activeMode === 'scratch') {
      var pp = sandboxPerPlate();
      var total = g * pp;
      if (state.couponType === 'corp') total = total * 0.9;
      return Math.round(total);
    }

    return 0;
  }

  function calcItemCount() {
    if (state.activeMode === 'combo' && state.comboItems.length > 0) {
      return state.comboItems.length;
    }
    if (state.activeMode === 'scratch') {
      return sandboxItemCount();
    }
    return 0;
  }

  function recalc() {
    state.upgrades.boneless = document.getElementById('cpUpgradeBoneless') ? document.getElementById('cpUpgradeBoneless').checked : false;
    state.upgrades.livecounter = document.getElementById('cpUpgradeLiveCounter') ? document.getElementById('cpUpgradeLiveCounter').checked : false;
    state.upgrades.welcome = document.getElementById('cpUpgradeWelcome') ? document.getElementById('cpUpgradeWelcome').checked : false;

    updateFreeDelivery();
    updateCheckoutBar();
  }

  // ========== CHECKOUT BAR ==========
  function updateCheckoutBar() {
    var bar = document.getElementById('cpCheckoutBar');
    if (!bar) return;

    var hasSelection = state.activeCombo || state.activeMode === 'scratch';
    var itemCount = calcItemCount();
    var hasEnoughItems = state.activeMode === 'combo' || (state.activeMode === 'scratch' && sandboxItemCount() >= 5);

    if (state.guestsValid && hasSelection && hasEnoughItems) {
      bar.style.display = 'block';
      bar.classList.add('visible');
    } else {
      bar.style.display = 'none';
      bar.classList.remove('visible');
    }

    var coGuests = document.getElementById('cpCoGuests');
    var coItems = document.getElementById('cpCoItems');
    var coTotal = document.getElementById('cpCoTotal');
    var coBtn = document.getElementById('cpCheckoutBtn');

    if (coGuests) coGuests.textContent = state.guests || '—';
    if (coItems) coItems.textContent = itemCount || '—';

    var grandTotal = calcGrandTotal();
    if (coTotal) coTotal.textContent = '₹' + grandTotal.toLocaleString('en-IN');

    var canCheckout = state.guestsValid && hasSelection && itemCount >= (state.activeMode === 'scratch' ? 5 : 0);
    if (coBtn) coBtn.disabled = !canCheckout;
  }

  // ========== CHECKOUT ==========
  function checkout() {
    if (!state.guestsValid) return;
    var g = state.guests;
    var total = calcGrandTotal();
    var itemCount = calcItemCount();

    var msg = '*Craft My Plate · Catering Order*%0A%0A';
    msg += '👥 Guests: ' + g + '%0A';
    msg += '🍽️ Items: ' + itemCount + '%0A';

    if (state.activeMode === 'combo' && state.activeCombo) {
      var def = D.comboDefs[state.activeCombo];
      msg += '📦 Combo: ' + (def ? def.label : state.activeCombo) + '%0A';
    } else {
      msg += '📦 Mode: Custom Build%0A';
    }

    msg += '💰 Grand Total: ₹' + total.toLocaleString('en-IN') + '%0A';

    if (state.occasion) {
      msg += '🎉 Occasion: ' + state.occasion + '%0A';
    }
    if (state.couponType === 'corp') {
      msg += '🏷️ Coupon: CORP10 (10% off) %0A';
    }
    if (state.couponType === 'bday') {
      msg += '🎁 Coupon: BDAYFREE (Free Welcome Drinks) %0A';
    }
    if (state.freeDelivery) {
      msg += '🚚 FREE DELIVERY %0A';
    }

    var wa = (D.whatsapp || '919999999999');
    window.open('https://wa.me/' + wa + '?text=' + msg, '_blank');
  }

  // ========== INIT ==========
  function init() {
    // Set initial guest count
    setTimeout(function() {
      var inp = document.getElementById('cpGuestCount');
      if (inp) {
        var defaultVal = (D.craftConfig && D.craftConfig.peopleDefault) || 50;
        inp.value = defaultVal;
        updateGuestState(defaultVal);
      }
      // Mark all visible reveal elements
      document.querySelectorAll('.cp-hero, .cp-step-section').forEach(function(el) {
        el.classList.add('revealed');
      });
    }, 100);
  }

  return {
    init: init,
    setGuests: setGuests,
    onGuestChange: onGuestChange,
    selectCombo: selectCombo,
    toggleSwap: toggleSwap,
    doSwap: doSwap,
    showScratch: showScratch,
    backToCombos: backToCombos,
    switchTab: switchTab,
    sandboxToggle: sandboxToggle,
    onOccasionChange: onOccasionChange,
    recalc: recalc,
    updateCheckoutBar: updateCheckoutBar,
    calcGrandTotal: calcGrandTotal,
    checkout: checkout,
    getGuests: getGuests,
    isGuestsValid: isGuestsValid,
    getActiveCombo: getActiveCombo,
    getActiveMode: getActiveMode,
    getD: getD
  };
})();