if ('indexedDB' in window) {
  const openDB = require('idb').openDB;
  
  const stores = [
    'menuitems',
    'orders'
  ];
  
  const dbPromise = openDB('app-store', 1, {
    upgrade ( db ) {
      for (var i = 0; i < stores.length; i++) {
        if (!db.objectStoreNames.contains(stores[i])) {
          db.createObjectStore(stores[i], { keyPath: 'id' });
        }
      }
    }
  });
  
  // export
  module.exports = {
    writeData: function ( storeName, data ) {
      return dbPromise
        .then(function ( db ) {
          const tx = db.transaction(storeName, 'readwrite');
          tx.store.put(data);
          return tx.done;
      });
    },
    readData: function ( storeName ) {
      return dbPromise
        .then(function ( db ) {
          const tx = db.transaction(storeName, 'readonly');
          return tx.store.getAll();
      });
    }
  };
} else {
  module.exports = {
    writeData: function ( storeName, data ) { return Promise.resolve(null); },
    readData: function ( storeName ) { return Promise.resolve(null); }
  };
}
