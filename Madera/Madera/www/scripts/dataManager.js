function exportToJsonString(idbDatabase, cb) {
    var exportObject = {};
    if (idbDatabase.objectStoreNames.length === 0)
        cb(null, JSON.stringify(exportObject));
    else {
        var transaction = idbDatabase.transaction(idbDatabase.objectStoreNames, "readonly");
        transaction.onerror = function (event) {
            cb(event, null);
        };
        Array.prototype.forEach.call(idbDatabase.objectStoreNames, function (storeName) {
            var allObjects = [];
            transaction.objectStore(storeName).openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    allObjects.push(cursor.value);
                    cursor.continue();
                } else {
                    exportObject[storeName] = allObjects;
                    console.log(exportObject);
                    if (idbDatabase.objectStoreNames.length === Object.keys(exportObject).length) {
                        cb(null, JSON.stringify(exportObject));
                    }
                }
            };
        });
    }
}

function exportData() {
    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");

    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        exportToJsonString(db, function (err, jsonString) {
            if (err)
                console.error(err);
            else {
                console.log("Exported as JSON: " + jsonString);
            }
        });
    }
}