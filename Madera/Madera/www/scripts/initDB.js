$(document).ready(function () {
    let DBOpenRequest = window.indexedDB.open("maderaDB", 1);
    DBOpenRequest.onupgradeneeded = function (event) {

        db = event.target.result;
        db.close();
    }

    let customer = ["idCustomer", "name", "firstName", "company", "address", "city", "zipCode", "mail", "phone"]

    let project = ["projectName", "commercial", "date", "idProject", "refProject"]

    CreateObjectStore("customer", customer);

    CreateObjectStore("project", project);

})

function CreateObjectStore(storeName, indexTab) {
    var dbName = "maderaDB";
    var request = indexedDB.open(dbName);
    request.onsuccess = function (e) {
        var database = e.target.result;
        var version = parseInt(database.version);
        database.close();
        var secondRequest = indexedDB.open(dbName, version + 1);
        secondRequest.onupgradeneeded = function (e) {
            var database = e.target.result;
            var objectStore = database.createObjectStore(storeName, { autoIncrement: true });
            indexTab.forEach(function (column) {
                console.log("create index : " + column);
                objectStore.createIndex(column, column, { unique: false });
            })
        };
        secondRequest.onsuccess = function (e) {
            e.target.result.close();
        }
    }
}
