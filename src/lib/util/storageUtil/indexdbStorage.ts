export const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("positionsDB", 1);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      console.log("IndexedDB Upgrade Needed", event);

      if (!db.objectStoreNames.contains("positions")) {
        const objectStore = db.createObjectStore("positions", {
          keyPath: "id",
        });
        objectStore.createIndex("lastClickDate", "lastClickDate", {
          unique: false,
        });
        // console.log("Created object store: positions");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event);
  });
};

export const getLastClickDate = (userId: any, brokerCode: any) => {
  return new Promise<string | null>((resolve, reject) => {
    const key = `${userId}#${brokerCode}`; // Use the composite key `userId#brokerCode`
    openDB()
      .then((db) => {
        const transaction = db.transaction("positions", "readonly");
        const store = transaction.objectStore("positions");
        const request = store.get(key); // Get the record by composite key

        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.lastClickDate : null); // Return lastClickDate if found
        };

        request.onerror = (event) => reject(event);
      })
      .catch(reject);
  });
};

export const saveLastClickDate = (userId:any, brokerCode:any, lastClickDate:any) => {
  return new Promise<void>((resolve, reject) => {
    const key = `${userId}#${brokerCode}`;
    console.log(`Saving to IndexedDB: Key=${key}, Date=${lastClickDate}`);

    openDB()
      .then((db) => {
        const transaction = db.transaction("positions", "readwrite");
        const store = transaction.objectStore("positions");

        const request = store.put({ id: key, lastClickDate });
        request.onsuccess = () =>
          // console.log(`IndexedDB Save Success: ${key}`);
          (request.onerror = (event) =>
            // console.error("IndexedDB Save Error", event);

            (transaction.oncomplete = () => {
              // console.log("IndexedDB Transaction Completed");
              resolve();
            }));
        transaction.onerror = (event) => {
          // console.error("IndexedDB Transaction Failed", event);
          reject(event);
        };
      })
      .catch((error) => {
        // console.error("IndexedDB OpenDB Failed", error);
        reject(error);
      });
  });
};
