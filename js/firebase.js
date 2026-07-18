// ============================================
// RRK CHICKEN · Firestore CRUD
// ============================================

let db = null;

function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK not loaded');
    return Promise.reject('Firebase SDK not loaded');
  }
  if (db) return Promise.resolve(db);
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    return Promise.resolve(db);
  } catch(e) {
    console.warn('Firebase init error (may already be initialized):', e.message);
    db = firebase.firestore();
    return Promise.resolve(db);
  }
}

// ============ COLLECTION HELPERS ============

function getCollection(name) {
  return initFirebase().then(() => db.collection(name).get().then(snapshot => {
    const items = [];
    snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
  }));
}

function addDoc(collection, data) {
  return initFirebase().then(() => db.collection(collection).add(data).then(ref => ref.id));
}

function updateDoc(collection, id, data) {
  return initFirebase().then(() => db.collection(collection).doc(id).set(data, { merge: true }));
}

function deleteDoc(collection, id) {
  return initFirebase().then(() => db.collection(collection).doc(id).delete());
}

function getDoc(collection, id) {
  return initFirebase().then(() => db.collection(collection).doc(id).get().then(doc => {
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }));
}

function queryDocs(collection, field, op, value) {
  return initFirebase().then(() => db.collection(collection).where(field, op, value).get().then(snapshot => {
    const items = [];
    snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
  }));
}

// ============ CUSTOMERS ============
window.rrkCustomers = {
  list: () => getCollection('customers'),
  register: (data) => addDoc('customers', { ...data, created_at: new Date().toISOString() }),
  remove: (id) => deleteDoc('customers', id),
  claimBirthday: (id) => {
    return getDoc('customers', id).then(function(customer) {
      if (!customer) throw new Error('Customer not found');
      var thisYear = new Date().getFullYear();
      var claims = customer.birthday_claims || [];
      if (claims.some(function(c) { return c.year === thisYear; })) {
        throw new Error('Already claimed this year');
      }
      claims.push({ year: thisYear, date: new Date().toISOString().substring(0, 10) });
      return updateDoc('customers', id, { birthday_claims: claims });
    });
  }
};

// ============ ORDERS ============
window.rrkOrders = {
  list: () => getCollection('orders'),
  listRecent: (sinceTime) => {
    return initFirebase().then(() => {
      return db.collection('orders').where('created_at', '>', sinceTime).orderBy('created_at', 'desc').get().then(snapshot => {
        var items = [];
        snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
        return items;
      });
    });
  },
  listPaginated: (lastDoc, limit) => {
    limit = limit || 50;
    return initFirebase().then(function() {
      var q = db.collection('orders').orderBy('created_at', 'desc').limit(limit);
      if (lastDoc) q = q.startAfter(lastDoc);
      return q.get().then(function(snapshot) {
        var items = [];
        snapshot.forEach(function(doc) { items.push({ id: doc.id, ...doc.data() }); });
        return {
          items: items,
          lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
          hasMore: items.length === limit
        };
      });
    });
  },
  save: (data) => addDoc('orders', { ...data, created_at: new Date().toISOString() }),
  remove: (id) => deleteDoc('orders', id),
  updateStatus: (id, status) => updateDoc('orders', id, { status, updated_at: new Date().toISOString() })
};

// ============ REVIEWS ============
window.rrkReviews = {
  list: () => getCollection('reviews'),
  save: (data) => addDoc('reviews', { ...data, created_at: new Date().toISOString() }),
  remove: (id) => deleteDoc('reviews', id)
};

// ============ RESERVATIONS ============
window.rrkReservations = {
  list: () => getCollection('reservations'),
  save: (data) => addDoc('reservations', data),
  remove: (id) => deleteDoc('reservations', id)
};

// ============ MENU ============
window.rrkMenu = {
  list: () => getCollection('menu'),
  save: (data) => {
    if (data.id) return updateDoc('menu', data.id, data);
    return addDoc('menu', data);
  },
  remove: (id) => deleteDoc('menu', id)
};

// ============ RAW CHICKEN ============
window.rrkRaw = {
  list: () => getCollection('raw'),
  save: (data) => {
    if (data.id) return updateDoc('raw', data.id, data);
    return addDoc('raw', data);
  },
  remove: (id) => deleteDoc('raw', id)
};

// ============ OCCASIONS ============
window.rrkOccasions = {
  list: () => getCollection('occasions'),
  save: (data) => {
    if (data.id) return updateDoc('occasions', data.id, data);
    return addDoc('occasions', data);
  },
  remove: (id) => deleteDoc('occasions', id)
};

// ============ SETTINGS ============
window.rrkSettings = (function() {
  var _cached = null;
  return {
    get: function() {
      if (_cached) return _cached;
      _cached = getCollection('settings').then(function(items) {
        var obj = {};
        items.forEach(function(i) { obj[i.key] = i.value; });
        return obj;
      });
      return _cached;
    },
    clearCache: function() { _cached = null; },
    save: function(data) {
      var promises = [];
      var self = this;
      Object.keys(data).forEach(function(key) {
        promises.push(
          queryDocs('settings', 'key', '==', key).then(function(results) {
            if (results.length > 0) {
              return updateDoc('settings', results[0].id, { key: key, value: data[key] });
            } else {
              return addDoc('settings', { key: key, value: data[key] });
            }
          })
        );
      });
      return Promise.all(promises).then(function() {
        self.clearCache();
      });
    }
  };
})();

// ============ CATEGORIES ============
window.rrkCategories = {
  list: () => getCollection('categories').then(items => {
    items.sort((a,b) => (a.order||99) - (b.order||99));
    return items;
  }),
  save: (data) => {
    if (data.id) return updateDoc('categories', data.id, data);
    return addDoc('categories', data);
  },
  remove: (id) => deleteDoc('categories', id),
  // Export to localStorage so public pages can use without Firebase
  syncToLocal: () => {
    return window.rrkCategories.list().then(function(items) {
      var firestoreCats = items.filter(function(c){return c.type==='menu';});
      var defaultCats = (typeof getMenuCategoriesBase === 'function') ? getMenuCategoriesBase() : [];
      // Auto-seed any missing defaults into Firestore so they're editable
      var missingDefaults = defaultCats.filter(function(dc) {
        return !firestoreCats.some(function(fc) { return fc.key === dc.key; });
      });
      var seedPromise = Promise.resolve();
      if (missingDefaults.length > 0) {
        seedPromise = Promise.all(missingDefaults.map(function(c) {
          return addDoc('categories', { type: 'menu', key: c.key, label: c.label, order: c.order });
        }));
      }
      return seedPromise.then(function() {
        return window.rrkCategories.list();
      }).then(function(allItems) {
        var allCats = allItems.filter(function(c){return c.type==='menu';});
        localStorage.setItem('rrk_menu_cats', JSON.stringify(allCats));
        return allItems;
      });
    });
  }
};

// ============ SEEDING (admin-only helpers) ============
// These add default data only once per flag. They never overwrite existing documents.
function seedOnce(flag, fn) {
  try { if (localStorage.getItem(flag) === '1') return Promise.resolve('already seeded'); } catch(e){}
  return fn().then(function() { try { localStorage.setItem(flag, '1'); } catch(e){} return 'seeded'; });
}

function seedMenuToFirestore() {
  return seedOnce('rrk_menu_seeded', function() {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.menu) return Promise.resolve();
    var items = SITE_DATA.menu.map(function(m) {
      return {
        name: m.name || '', category: m.category || '', diet: m.diet || 'nonveg',
        description: m.description || '', price: Number(m.price) || 0,
        craftCategory: m.craftCategory || m.category || '',
        craftEnabled: m.craftEnabled !== false, image: m.image || '',
        special: m.special || '0', special_tag: m.special_tag || '', today_special: m.today_special || '0'
      };
    });
    return Promise.all(items.map(function(item) { return addDoc('menu', item); }));
  });
}

function seedRawToFirestore() {
  return seedOnce('rrk_raw_seeded', function() {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.raw) return Promise.resolve();
    var items = SITE_DATA.raw.map(function(r) {
      return {
        name: r.name || '', image: r.image || '', price: Number(r.price) || 0,
        weight: r.weight || '1 kg', tag: r.tag || 'Fresh Today', show_home: r.show_home || '1'
      };
    });
    return Promise.all(items.map(function(item) { return addDoc('raw', item); }));
  });
}

function seedOccasionsToFirestore() {
  return seedOnce('rrk_occasions_seeded', function() {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.occasions) return Promise.resolve();
    return Promise.all(SITE_DATA.occasions.map(function(o) { return addDoc('occasions', { ...o, type: o.type || 'home' }); }));
  });
}

function seedCategoriesToFirestore() {
  return seedOnce('rrk_cats_seeded', function() {
    var cats = (typeof getMenuCategoriesBase === 'function') ? getMenuCategoriesBase() : getMenuCategories();
    return Promise.all(cats.map(function(c) {
      return addDoc('categories', { type: 'menu', key: c.key, label: c.label, order: c.order });
    }));
  });
}

function resetAllSeeds() {
  try {
    localStorage.removeItem('rrk_menu_seeded');
    localStorage.removeItem('rrk_raw_seeded');
    localStorage.removeItem('rrk_occasions_seeded');
    localStorage.removeItem('rrk_cats_seeded');
  } catch(e){}
}

function runAllSeeds() {
  return Promise.all([
    seedCategoriesToFirestore(),
    seedMenuToFirestore(),
    seedRawToFirestore(),
    seedOccasionsToFirestore()
  ]);
}
