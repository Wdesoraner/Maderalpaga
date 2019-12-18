$(document).ready(function () {
    let DBOpenRequest = window.indexedDB.open("maderaDB", 1);
    DBOpenRequest.onupgradeneeded = function (event) {

        db = event.target.result;
        db.close();
    }

    let customer = ["idCustomer", "name", "firstName", "company", "address", "city", "zipCode", "mail", "phone"]

    let project = ["projectName", "commercial", "date", "idProject", "refProject","customer"]

    let tables = [customer, project]

    let tableNames = ["customer", "project"]

    CreateObjectStore(tableNames,tables, 0);

})

function CreateObjectStore(tableNames, storeTables, indexTab) {
    if (indexTab < storeTables.length) {
        var dbName = "maderaDB";
        var request = indexedDB.open(dbName);
        request.onsuccess = function (e) {
            var database = e.target.result;
            var version = parseInt(database.version);
            database.close();
            var secondRequest = indexedDB.open(dbName, version + 1);
            secondRequest.onupgradeneeded = function (e) {
                var database = e.target.result;
                var objectStore = database.createObjectStore(tableNames[indexTab], { autoIncrement: true });
                storeTables[indexTab].forEach(function (column) {
                    console.log("create index : " + column);
                    objectStore.createIndex(column, column, { unique: false });
                })
                CreateObjectStore(tableNames, storeTables, indexTab+1);
            };
            secondRequest.onsuccess = function (e) {
                e.target.result.close();
            }
        }
    }

}
