// ============================================
// RRK CRAFT MY PLATE · Simplified Controller
// ============================================
var CpApp = (function() {
  var state = {
    guests: 0,
    guestsValid: false,
    budgetPerPerson: 300,
    sandboxChecked: {},
    sandboxTab: 'starters',
    occasion: '',
    couponType: '',
    freeDelivery: false
  };

  var D = window.SITE_DATA || (function() {
    try { return JSON.parse(localStorage.getItem('rrk_site_data')) || {}; } catch(e) { return {}; }
  })();

  function getD() { return D; }
  function deriveCraftMenu() {
    var cats = {starters:[], mains:[], breads:[], desserts:[], beverages:[]};
    (D.menu || []).forEach(function(m) {
      if (m.craftEnabled && m.craftCategory && cats[m.craftCategory]) {
        cats[m.craftCategory].push({
          name: m.name,
          price: parseInt(m.craftPrice) || 0,
          diet: m.diet || 'nonveg'
        });
      }
    });
    return cats;
  }

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
    var okBudget = document.getElementById('cpGuestOkBudget');
    var step3 = document.getElementById('step3');
    var step4 = document.getElementById('step4');
    var bar = document.getElementById('cpCheckoutBar');

    if (!valid) {
      if (msgEl) msgEl.style.display = 'block';
      if (okEl) okEl.style.display = 'none';
      if (step3) step3.classList.remove('cp-step-unlocked');
      if (step4) step4.style.display = 'none';
      if (bar) { bar.classList.remove('visible'); bar.style.display = 'none'; }
    } else {
      if (msgEl) msgEl.style.display = 'none';
      if (okEl) { okEl.style.display = 'block'; if (okCount) okCount.textContent = n; if (okBudget) okBudget.textContent = state.budgetPerPerson; }
      if (step3) step3.classList.add('cp-step-unlocked');
      highlightByBudget();
      updateCheckoutBar();
    }
  }

  // ========== BUDGET ==========
  function onBudgetChange() {
    var slider = document.getElementById('cpBudget');
    if (!slider) return;
    state.budgetPerPerson = parseInt(slider.value) || 300;
    var valEl = document.getElementById('cpBudgetVal');
    var okBudget = document.getElementById('cpGuestOkBudget');
    if (valEl) valEl.textContent = state.budgetPerPerson;
    if (okBudget) okBudget.textContent = state.budgetPerPerson;
    highlightByBudget();
    updateCheckoutBar();
  }

  function highlightByBudget() {
    var step3 = document.getElementById('step3');
    if (!step3) return;
    var items = step3.querySelectorAll('.cp-item');
    items.forEach(function(el) {
      var cb = el.querySelector('input[type="checkbox"]');
      if (!cb) return;
      var price = parseInt(cb.getAttribute('data-price')) || 0;
      el.classList.toggle('cp-item-overbudget', price > state.budgetPerPerson);
      el.classList.toggle('cp-item-inbudget', price <= state.budgetPerPerson);
    });
  }

  // ========== SANDBOX ==========
  function switchTab(cat, e) {
    state.sandboxTab = cat;
    var step3 = document.getElementById('step3');
    if (!step3) return;
    step3.querySelectorAll('.cp-tab-btn').forEach(function(t) { t.classList.remove('active'); });
    step3.querySelectorAll('.cp-panel').forEach(function(p) { p.classList.remove('active'); });
    if (e && e.target) e.target.classList.add('active');
    var panel = step3.querySelector('.cp-panel[data-cat="'+cat+'"]');
    if (panel) panel.classList.add('active');
  }

  function sandboxToggle() {
    var step3 = document.getElementById('step3');
    if (!step3) return;
    state.sandboxChecked = {};
    var checkboxes = step3.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(cb) {
      var cat = cb.getAttribute('data-cat');
      var idx = parseInt(cb.getAttribute('data-idx'));
      var checked = cb.checked;
      cb.closest('.cp-item').classList.toggle('checked', checked);
      if (checked) {
        var craftMenu = deriveCraftMenu();
        var item = craftMenu[cat] && craftMenu[cat][idx];
        if (!state.sandboxChecked[cat]) state.sandboxChecked[cat] = {};
        if (item) state.sandboxChecked[cat][idx] = { name: item.name, price: item.price, diet: item.diet };
      }
    });
    updateSandboxStats();
    updateCheckoutBar();
  }

  function updateSandboxStats() {
    var totalItems = 0, perPlate = 0;
    Object.keys(state.sandboxChecked).forEach(function(cat) {
      Object.keys(state.sandboxChecked[cat]).forEach(function(idx) {
        totalItems++;
        perPlate += state.sandboxChecked[cat][idx].price;
      });
    });
    var perPlateEl = document.getElementById('cpPerPlate');
    var itemCountEl = document.getElementById('cpItemCount');
    var warningEl = document.getElementById('cpWarning');
    if (perPlateEl) perPlateEl.textContent = perPlate.toLocaleString('en-IN');
    if (itemCountEl) itemCountEl.textContent = totalItems;
    if (warningEl) warningEl.style.display = (totalItems < 5) ? 'block' : 'none';
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
    var couponEl = document.getElementById('cpCoupon');
    if (!couponEl) return;
    couponEl.style.display = 'none';
    couponEl.className = 'cp-coupon';
    state.couponType = '';

    if (state.occasion === 'Birthday Party') {
      couponEl.style.display = 'block';
      couponEl.className = 'cp-coupon bday';
      couponEl.innerHTML = '🎁 <strong>Code BDAYFREE applied!</strong> Free custom welcome drinks added for all your <strong>'+state.guests+'</strong> guests!';
      state.couponType = 'bday';
    } else if (state.occasion === 'Corporate Event') {
      couponEl.style.display = 'block';
      couponEl.className = 'cp-coupon corp';
      couponEl.innerHTML = '💼 <strong>Code CORP10 applied!</strong> 10% discount subtracted from your total bill.';
      state.couponType = 'corp';
    } else if (state.occasion === 'Wedding/Engagement') {
      couponEl.style.display = 'block';
      couponEl.className = 'cp-coupon wedding';
      couponEl.innerHTML = '💍 <strong>Special Wedding Pricing!</strong> Complimentary dessert platter for the couple.';
      state.couponType = 'wedding';
    } else if (state.occasion === 'Casual House Party') {
      couponEl.style.display = 'block';
      couponEl.className = 'cp-coupon house';
      couponEl.innerHTML = '🏠 <strong>House Party Bonus!</strong> Extra starter item added at no extra cost.';
      state.couponType = 'house';
    }
    updateFreeDelivery();
    updateCheckoutBar();
  }

  function updateFreeDelivery() {
    var total = calcGrandTotal();
    state.freeDelivery = (total >= 40000);
    var el = document.getElementById('cpFreeDelivery');
    if (el) el.style.display = state.freeDelivery ? 'block' : 'none';
  }

  // ========== PRICING ==========
  function calcGrandTotal() {
    if (!state.guestsValid) return 0;
    var pp = sandboxPerPlate();
    var total = state.guests * pp;
    if (state.couponType === 'corp') total = total * 0.9;
    return Math.round(total);
  }

  // ========== CHECKOUT BAR ==========
  function updateCheckoutBar() {
    var bar = document.getElementById('cpCheckoutBar');
    if (!bar) return;
    var itemCount = sandboxItemCount();
    var hasEnough = itemCount >= 5;

    if (state.guestsValid && hasEnough) {
      bar.style.display = 'block';
      bar.classList.add('visible');
    } else {
      bar.style.display = 'none';
      bar.classList.remove('visible');
    }

    var step4 = document.getElementById('step4');
    if (state.guestsValid && hasEnough && step4) step4.style.display = 'block';
    if (!hasEnough && step4) step4.style.display = 'none';

    var coGuests = document.getElementById('cpCoGuests');
    var coItems = document.getElementById('cpCoItems');
    var coTotal = document.getElementById('cpCoTotal');
    var coBtn = document.getElementById('cpCheckoutBtn');

    if (coGuests) coGuests.textContent = state.guests || '—';
    if (coItems) coItems.textContent = itemCount || '—';
    var grandTotal = calcGrandTotal();
    if (coTotal) coTotal.textContent = '₹' + grandTotal.toLocaleString('en-IN');
    if (coBtn) coBtn.disabled = !(state.guestsValid && hasEnough);
  }

  // ========== CHECKOUT ==========
  function checkout() {
    if (!state.guestsValid) return;
    var g = state.guests;
    var total = calcGrandTotal();
    var itemCount = sandboxItemCount();

    var msg = '*Craft My Plate · Catering Order*%0A%0A';
    msg += '👥 Guests: ' + g + '%0A';
    msg += '🍽️ Items: ' + itemCount + '%0A';
    msg += '💰 Grand Total: ₹' + total.toLocaleString('en-IN') + '%0A';
    if (state.occasion) msg += '🎉 Occasion: ' + state.occasion + '%0A';
    if (state.couponType === 'corp') msg += '🏷️ Coupon: CORP10 (10% off) %0A';
    if (state.couponType === 'bday') msg += '🎁 Coupon: BDAYFREE (Free Welcome Drinks) %0A';
    if (state.freeDelivery) msg += '🚚 FREE DELIVERY %0A';

    var wa = (D.whatsapp || '919999999999');
    window.open('https://wa.me/' + wa + '?text=' + msg, '_blank');
  }

  // ========== INIT ==========
  function init() {
    var budgetSlider = document.getElementById('cpBudget');
    if (budgetSlider && D.craftConfig) {
      budgetSlider.value = D.craftConfig.budgetDefault || 300;
      state.budgetPerPerson = parseInt(budgetSlider.value);
      var valEl = document.getElementById('cpBudgetVal');
      if (valEl) valEl.textContent = state.budgetPerPerson;
    }
    var guestInput = document.getElementById('cpGuestCount');
    if (guestInput) {
      var defaultVal = (D.craftConfig && D.craftConfig.peopleDefault) || 50;
      guestInput.value = defaultVal;
      updateGuestState(defaultVal);
    }
    // Reveal all elements
    document.querySelectorAll('.cp-hero, .cp-step-section').forEach(function(el) {
      el.classList.add('revealed');
    });
    highlightByBudget();
  }

  return {
    init: init, setGuests: setGuests, onGuestChange: onGuestChange,
    onBudgetChange: onBudgetChange, switchTab: switchTab, sandboxToggle: sandboxToggle,
    onOccasionChange: onOccasionChange, updateCheckoutBar: updateCheckoutBar,
    calcGrandTotal: calcGrandTotal, checkout: checkout,
    getD: getD
  };
})();