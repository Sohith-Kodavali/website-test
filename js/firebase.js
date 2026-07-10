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
    db.settings({ merge: true });
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
  remove: (id) => deleteDoc('customers', id)
};

// ============ ORDERS ============
window.rrkOrders = {
  list: () => getCollection('orders'),
  save: (data) => addDoc('orders', { ...data, created_at: new Date().toISOString() })
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

// ============ COMBOS ============
window.rrkCombos = {
  list: () => getCollection('combos'),
  save: (data) => {
    if (data.id) return updateDoc('combos', data.id, data);
    return addDoc('combos', data);
  },
  remove: (id) => deleteDoc('combos', id)
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
window.rrkSettings = {
  get: () => getCollection('settings').then(items => {
    const obj = {};
    items.forEach(i => { obj[i.key] = i.value; });
    return obj;
  }),
  save: (data) => {
    const promises = [];
    Object.keys(data).forEach(key => {
      promises.push(
        queryDocs('settings', 'key', '==', key).then(results => {
          if (results.length > 0) {
            return updateDoc('settings', results[0].id, { key, value: data[key] });
          } else {
            return addDoc('settings', { key, value: data[key] });
          }
        })
      );
    });
    return Promise.all(promises);
  }
};

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
    return window.rrkCategories.list().then(items => {
      var menu = items.filter(function(c){return c.type==='menu';});
      localStorage.setItem('rrk_menu_cats', JSON.stringify(menu));
      return items;
    });
  }
};
