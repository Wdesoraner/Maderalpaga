$(document).ready(function () {
    let DBOpenRequest = window.indexedDB.open("maderaDB", 1);
    DBOpenRequest.onupgradeneeded = function (event) {

        db = event.target.result;
        db.close();
    }

    let customer = ["idCustomer", "name", "firstName", "company", "address", "city", "zipCode", "mail", "phone"]

    let project = ["projectName", "commercial", "date", "idProject", "refProject", "customer"]

    let collection = ["idCollection", "label", "quality"];

    let typeComponent = ["idTypeComponent", "label", "code"];

    let components = ["idComponent", "refComposant", "label", "price", "comment", "typeComponent"];

    let quotation = ["idQuotation", "name", "reference", "date", "collection", "fill", "finishIn", "finishOut", "cut"];

    let componentsQuotation = ["idQuotation", "idComponent"]

    let tables = [customer, project, collection, typeComponent, components, quotation, componentsQuotation]

    let tableNames = ["customer", "project", "collection", "typeComponent", "components", "quotation", "componentsQuotation"]

    CreateObjectStore(tableNames, tables, 0);
})

function CreateObjectStore(tableNames, storeTables, indexTab) {
    if (indexTab < storeTables.length) {
        var dbName = "maderaDB";
        var request = indexedDB.open(dbName);
        var dbShouldInit = false;

        request.onsuccess = function (e) {
            var database = e.target.result;
            var version = parseInt(database.version);
            database.close();
            var secondRequest = indexedDB.open(dbName, version + 1);
            secondRequest.onupgradeneeded = function (e) {
                dbShouldInit = true;
                var database = e.target.result;
                var objectStore = database.createObjectStore(tableNames[indexTab], { autoIncrement: true });
                storeTables[indexTab].forEach(function (column) {
                    console.log("create index : " + column);
                    objectStore.createIndex(column, column, { unique: false });
                })
                CreateObjectStore(tableNames, storeTables, indexTab + 1);
            };
            secondRequest.onsuccess = function (e) {
                if (tableNames[indexTab] == "collection") {
                    initTableCollection(e.target.result);
                } else if (tableNames[indexTab] == "typeComponent") {
                    initTableTypeComponent(e.target.result);
                }
                e.target.result.close();
            }
        }
    }

}






function writeTable() {

    var dbName = "maderaDB";
    var request = indexedDB.open(dbName);
    request.onsuccess = function (e) {
        var database = e.target.result;

        initTableCollection(database);
        initTableTypeComponent(database);
        database.close();
    }
}

function initTableCollection(db) {
    let newItems = [
        {
            label: "Economique",
            quality: 1
        },
        {
            label: "Normal",
            quality: 2
        },
        {
            label: "Premium",
            quality: 3
        }
    ];

    let transaction = db.transaction("collection", "readwrite");
    // On crée un magasin d'objet pour la transaction
    // On ajoute l'objet newItem au magasin d'objets
    let objectStoreRequest;
    newItems.forEach(function (item) {
        let objectStore = transaction.objectStore("collection");
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableTypeComponent(db) {
    let newItems = [
        {
            label: "Mur Droit",
            code: "MD"
        },
        {
            label: "Mur Angle",
            code: "MA"
        },
        {
            label: "Porte Pleine",
            code: "PtPl"
        },
        {
            label: "Porte Fenetre",
            code: "PtFe"
        },
        {
            label: "Fenetre",
            code: "Fe"
        },
    ]

    let transaction = db.transaction("typeComponent", "readwrite");

    let objectStore = transaction.objectStore("typeComponent");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}

