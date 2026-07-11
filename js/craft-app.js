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
    offerPercent: 0,
    freeDelivery: false,
    deliveryMode: 'delivery',
    deliveryLocation: ''
  };

  var D = {};

  function getD() { return D; }
  function deriveCraftMenu() {
    var craftCats = typeof getCraftCategories === 'function' ? getCraftCategories() : [];
    if (craftCats.length === 0) craftCats = [
      {key:'starters'},{key:'kaju-pakodi'},{key:'manchuria'},{key:'biryani'},
      {key:'fried-rice'},{key:'noodles'},{key:'roti-curry'},{key:'breads'},{key:'ice-creams'}
    ];
    var cats = {};
    craftCats.forEach(function(c){ cats[c.key] = []; });
    (D.menu || []).forEach(function(m) {
      var cat = m.craftCategory || m.category;
      if (m.craftEnabled && cat && cats[cat]) {
        cats[cat].push({
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
    if (!inp) return;
    var max = parseInt(inp.max) || 9999;
    var n = parseInt(inp.value) || 0;
    if (n < 0) n = 0;
    if (n > max) { n = max; inp.value = n; }
    updateGuestState(n);
  }

  function stepGuests(delta) {
    var inp = document.getElementById('cpGuestCount');
    if (!inp) return;
    var min = parseInt(inp.min) || 1;
    var max = parseInt(inp.max) || 9999;
    var n = (parseInt(inp.value) || 0) + delta;
    if (n < min) n = min;
    if (n > max) n = max;
    setGuests(n);
  }

  function focusGuests() {
    var inp = document.getElementById('cpGuestCount');
    if (inp) { inp.value = ''; inp.focus(); updateGuestState(0); }
  }

  function updateGuestState(n) {
    var valid = n >= (D.craftConfig && D.craftConfig.guestMin || 10);
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
      if (step4) step4.style.display = 'block';
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
    updateBudgetBar();
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

  function sandboxToggle(e) {
    if (e && e.target && e.target.matches('input[type="checkbox"]')) {
      e.target.parentNode.classList.toggle('checked', e.target.checked);
    }
    rebuildState();
    updateSandboxStats();
    updateCheckoutBar();
  }

  function rebuildState() {
    state.sandboxChecked = {};
    var step3 = document.getElementById('step3');
    if (!step3) return;
    step3.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
      var cat = cb.getAttribute('data-cat');
      var idx = cb.getAttribute('data-idx');
      var checked = cb.checked;
      cb.parentNode.classList.toggle('checked', checked);
      if (checked) {
        if (!state.sandboxChecked[cat]) state.sandboxChecked[cat] = {};
        var craftMenu = deriveCraftMenu();
        var item = craftMenu[cat] && craftMenu[cat][parseInt(idx)];
        if (item) state.sandboxChecked[cat][idx] = { name: item.name, price: item.price, diet: item.diet };
      }
    });
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
    if (warningEl) warningEl.style.display = (totalItems < 3) ? 'block' : 'none';
    updateBudgetBar(perPlate);
  }

  function updateBudgetBar(perPlate) {
    var pp = (typeof perPlate === 'number') ? perPlate : sandboxPerPlate();
    var budget = state.budgetPerPerson;
    var fill = document.getElementById('cpBudgetFill');
    var label = document.getElementById('cpBudgetLabel');
    if (!fill || !label) return;
    var pct = budget > 0 ? Math.min((pp / budget) * 100, 200) : 0;
    fill.style.width = Math.min(pct, 100) + '%';
    if (pp <= budget) {
      fill.className = 'cp-budget-bar__fill cp-budget-in';
      label.textContent = '✅ In Budget — ₹' + pp.toLocaleString('en-IN') + '/plate vs ₹' + budget + ' budget';
      label.className = 'cp-budget-bar__label cp-budget-in';
    } else if (pp <= budget * 1.5) {
      fill.className = 'cp-budget-bar__fill cp-budget-warn';
      label.textContent = '⚠️ Slightly Over — ₹' + pp.toLocaleString('en-IN') + '/plate vs ₹' + budget + ' est. budget';
      label.className = 'cp-budget-bar__label cp-budget-warn';
    } else {
      fill.className = 'cp-budget-bar__fill cp-budget-over';
      label.textContent = '🔴 Over Budget — ₹' + pp.toLocaleString('en-IN') + '/plate vs ₹' + budget + ' budget';
      label.className = 'cp-budget-bar__label cp-budget-over';
    }
  }

  function setDeliveryMode(mode) {
    state.deliveryMode = mode;
    var opts = document.querySelectorAll('.cp-toggle-opt');
    opts.forEach(function(o) {
      o.classList.toggle('active', o.querySelector('input').value === mode);
    });
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
    state.offerPercent = 0;

    var occasion = (D.craftOccasions || []).find(function(o) { return o.name === state.occasion; });
    if (occasion) {
      couponEl.style.display = 'block';
      couponEl.className = 'cp-coupon ' + (occasion.couponType || 'default');
      var offerText = occasion.offerPercent > 0 ? ' <strong>' + occasion.offerPercent + '% off applied!</strong>' : '';
      couponEl.innerHTML = (occasion.message || '') + offerText;
      state.couponType = occasion.couponType || '';
      state.offerPercent = Number(occasion.offerPercent) || 0;
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
    var offer = state.offerPercent || 0;
    if (offer > 0) total = total * (1 - offer / 100);
    return Math.round(total);
  }

  // ========== CHECKOUT BAR ==========
  function updateCheckoutBar() {
    var bar = document.getElementById('cpCheckoutBar');
    if (!bar) return;
    var itemCount = sandboxItemCount();

    // Show bar as soon as any item is selected (with valid guests)
    if (state.guestsValid && itemCount >= 1) {
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
    // Enable button when ≥1 item, but show warning <3 in confirm step
    if (coBtn) coBtn.disabled = !(state.guestsValid && itemCount >= 1);
  }

  // ========== CONFIRM / CANCEL ==========
  function getSelectedItemNames() {
    var names = [];
    Object.keys(state.sandboxChecked).forEach(function(cat) {
      Object.keys(state.sandboxChecked[cat]).forEach(function(idx) {
        names.push(state.sandboxChecked[cat][idx].name);
      });
    });
    return names;
  }

  function showConfirm() {
    var step5 = document.getElementById('step5');
    var confirmBox = document.getElementById('cpConfirmBox');
    if (!step5 || !confirmBox) return;

    var total = calcGrandTotal();
    var itemCount = sandboxItemCount();
    var items = getSelectedItemNames();

    var pp = sandboxPerPlate();
    var savings = '';
    var couponText = '';
    var itemWarning = itemCount < 3 ? '<div class="cp-review-warning">⚠️ Minimum 3 items recommended for catering. You have only '+itemCount+'.</div>' : '';
    if (state.couponType === 'corp') { couponText = '<br>🏷️ Coupon: CORP10 (10% off)'; savings = '<span class="cp-save-tag">10% Off</span>'; }
    if (state.couponType === 'bday') couponText = '<br>🎁 Coupon: BDAYFREE (Free Welcome Drinks)';
    if (state.freeDelivery) couponText += '<br>🚚 Free Delivery Applied';

    var locationHTML = '';
    if (state.deliveryMode === 'delivery') {
      locationHTML =
        '<div class="cp-review-row cp-review-location"><strong>📍 Delivery Location</strong></div>'+
        '<input type="text" id="cpLocationInput" placeholder="Enter your full address for delivery" class="cp-location-input" oninput="CpApp.onLocationChange()">'+
        '<button class="btn btn--gold-outline" style="margin-top:8px;font-size:12px;padding:8px 14px" onclick="CpApp.shareLiveLocation()">📍 Share Live Location</button>'+
        '<p class="muted" style="font-size:11px;margin-top:4px" id="cpLocationStatus"></p>';
    }

    confirmBox.innerHTML =
      '<div class="cp-review-row"><strong>Guests:</strong> <span>'+state.guests+'</span></div>'+
      '<div class="cp-review-row"><strong>Per Plate:</strong> <span>₹'+pp.toLocaleString('en-IN')+'</span></div>'+
      '<div class="cp-review-row"><strong>Order Type:</strong> <span>'+(state.deliveryMode==='takeaway'?'🥡 Takeaway':'🚚 Delivery')+'</span></div>'+
      '<div class="cp-review-row"><strong>Items:</strong> <span>'+itemCount+' selected</span></div>'+
      itemWarning+
      '<div class="cp-review-items">'+items.map(function(n){return'<span class="cp-review-chip">'+n+'</span>';}).join('')+'</div>'+
      locationHTML+
      (state.occasion ? '<div class="cp-review-row"><strong>Occasion:</strong> <span>'+state.occasion+'</span></div>' : '')+
      (couponText ? '<div class="cp-review-coupon">'+couponText+'</div>' : '')+
      '<div class="cp-review-total"><strong>Grand Total:</strong> <span>₹'+total.toLocaleString('en-IN')+'</span>'+savings+'</div>';

    step5.style.display = 'block';
    step5.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function onLocationChange() {
    var inp = document.getElementById('cpLocationInput');
    state.deliveryLocation = inp ? inp.value : '';
  }

  function shareLiveLocation() {
    var statusEl = document.getElementById('cpLocationStatus');
    if (navigator.geolocation) {
      if (statusEl) statusEl.textContent = 'Getting location...';
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          var lat = pos.coords.latitude;
          var lng = pos.coords.longitude;
          state.deliveryLocation = 'https://maps.google.com/?q=' + lat + ',' + lng;
          var inp = document.getElementById('cpLocationInput');
          if (inp) inp.value = state.deliveryLocation;
          if (statusEl) statusEl.textContent = '✅ Location captured!';
          updateCheckoutBar();
        },
        function(err) {
          if (statusEl) statusEl.textContent = '⚠️ Could not get location. Please type your address instead.';
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      if (statusEl) statusEl.textContent = '⚠️ Geolocation not supported. Please type your address.';
    }
  }

  function cancelOrder() {
    var step5 = document.getElementById('step5');
    var step6 = document.getElementById('step6');
    if (step5) step5.style.display = 'none';
    if (step6) step6.style.display = 'none';
    document.getElementById('step2').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function confirmOrder() {
    var step5 = document.getElementById('step5');
    var step6 = document.getElementById('step6');
    var waBox = document.getElementById('cpWaBox');
    if (!step6 || !waBox) return;

    var total = calcGrandTotal();
    var itemCount = sandboxItemCount();
    var items = getSelectedItemNames();

    waBox.innerHTML =
      '<div class="cp-wa-summary">'+
        '<div class="cp-wa-stat"><span>👥</span> '+state.guests+' Guests</div>'+
        '<div class="cp-wa-stat"><span>🍽️</span> '+itemCount+' Items</div>'+
        '<div class="cp-wa-stat"><span>💰</span> ₹'+total.toLocaleString('en-IN')+'</div>'+
        (state.occasion ? '<div class="cp-wa-stat"><span>🎉</span> '+state.occasion+'</div>' : '')+
      '</div>'+
      '<p class="cp-wa-items">'+items.slice(0,6).join(', ')+(items.length>6?' +'+(items.length-6)+' more':'')+'</p>';

    if (step5) step5.style.display = 'none';
    step6.style.display = 'block';
    step6.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function orderWhatsApp() {
    var total = calcGrandTotal();
    var itemCount = sandboxItemCount();
    var items = getSelectedItemNames();

    var msg = '*Craft My Plate · Confirmed Order*%0A%0A';
    msg += '👥 Guests: ' + state.guests + '%0A';
    msg += '🍽️ Items (' + itemCount + '): ' + items.join(', ') + '%0A';
    msg += '💰 Grand Total: ₹' + total.toLocaleString('en-IN') + '%0A';
    msg += '📦 Type: ' + (state.deliveryMode === 'takeaway' ? 'Takeaway' : 'Delivery') + '%0A';
    if (state.deliveryMode === 'delivery' && state.deliveryLocation) {
      msg += '📍 Location: ' + state.deliveryLocation + '%0A';
    }
    if (state.occasion) msg += '🎉 Occasion: ' + state.occasion + '%0A';
    if (state.couponType !== '') msg += '🏷️ Applied: ' + state.couponType + (state.offerPercent > 0 ? ' (' + state.offerPercent + '% off)' : '') + '%0A';
    if (state.freeDelivery) msg += '🚚 FREE DELIVERY %0A';

    // Save order to Firestore
    var orderData = {
      type: 'craft',
      status: 'pending',
      guests: state.guests,
      items: items.join(', '),
      total: total,
      perPlate: sandboxPerPlate(),
      mode: state.deliveryMode === 'takeaway' ? 'Takeaway' : 'Delivery',
      location: state.deliveryLocation || '',
      occasion: state.occasion || '',
      coupon: state.couponType || '',
      offerPercent: state.offerPercent || 0,
      created_at: new Date().toISOString()
    };
    if (typeof rrkOrders !== 'undefined' && rrkOrders.save) {
      rrkOrders.save(orderData).then(function() {
        console.log('Craft order saved to Firestore: ₹' + orderData.total, orderData.guests + ' guests');
      }).catch(function(e) { console.warn('Craft order save failed', e); });
    }

    showToast('✅ Order sent! Soon our team will contact you.');
    heavyVibe();

    setTimeout(function() {
      var wa = (window.RRK_CONFIG && window.RRK_CONFIG.whatsapp) ? window.RRK_CONFIG.whatsapp : (D.whatsapp || '919999999999');
      window.open('https://wa.me/' + wa + '?text=' + msg, '_blank');
    }, 1200);
  }

  function showToast(message) {
    var existing = document.querySelector('.cp-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'cp-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() {
      toast.classList.add('cp-toast-visible');
    }, 10);
    setTimeout(function() {
      toast.classList.remove('cp-toast-visible');
      setTimeout(function() { toast.remove(); }, 400);
    }, 3500);
  }

  // ========== INIT ==========
  function init(data) {
    D = data || (typeof SITE_DATA !== 'undefined' ? SITE_DATA : {});
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
    init: init, setGuests: setGuests, onGuestChange: onGuestChange, stepGuests: stepGuests, focusGuests: focusGuests,
    onBudgetChange: onBudgetChange, switchTab: switchTab, sandboxToggle: sandboxToggle,
    onOccasionChange: onOccasionChange, updateCheckoutBar: updateCheckoutBar,
    calcGrandTotal: calcGrandTotal,
    showConfirm: showConfirm, cancelOrder: cancelOrder, confirmOrder: confirmOrder, orderWhatsApp: orderWhatsApp,
    setDeliveryMode: setDeliveryMode,
    onLocationChange: onLocationChange, shareLiveLocation: shareLiveLocation,
    getD: getD
  };
})();