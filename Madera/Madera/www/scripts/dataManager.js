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

function getData() {
    $.getJSON("http://127.0.0.1/madera_WS/webservice.php", function (data) {
        var dbName = "maderaDB";
        var request = indexedDB.open(dbName);
        request.onsuccess = function (e) {
            var database = e.target.result;
            data.forEach(function (row) {
                switch (Object.keys(row)[0].toLowerCase()) {
                    case "client":
                        addCustomer(database, row.Client);
                        break;
                    case "projet":
                        addProject(database, row.Projet);
                        break;
                    case "devis":
                        addQuotation(database, row.Devis);
                        break;
                    case "devis_module":
                        addQuotation(database, row.Devis);
                        break;
                }
            });
        }
    });
}
function addCustomer(db, data) {
    console.log(data);
    let newItem = {
        idCustomer: data.idClient,
        name: data.nom,
        firstName: data.prenom,
        company: data.service,
        phone: data.telephone,
        mail: data.mail,
        address: data.adresse,
        zipCode: data.codePostal,
        city: data.ville
    };
    let transaction = db.transaction("customer", "readwrite");
    let objectStore = transaction.objectStore("customer");
    objectStoreRequest = objectStore.add(newItem);
}

function addProject(db, data) {
    console.log(data);
    let newItem = {
        projectName:data.nomProjet,
        commercial: data.responsable,
        date: data.date,
        refProject: data.referenceProjet,
        customer: data.client,
        idProject:data.idProjet,
        amountProject:data.montantProjet,
        addressProject:data.adresseProjet,
        cityProject:data.villeProjet,
        zipCodeProject:data.codePostalProjet
    };
    let transaction = db.transaction("project", "readwrite");
    let objectStore = transaction.objectStore("project");
    objectStoreRequest = objectStore.add(newItem);
}

function addQuotation(db, data) {
    console.log(data);
    let quotation = ["idQuotation", "state","reference", "date", "discount", "idProject"];
    let newItem = {
        idQuotation : data.idDevis,
        reference: data.referenceDevis,
        date: data.dateDevis,
        idProject: date.idProjet,
        state: data.etat,
        discount : data.remise
    };
    let transaction = db.transaction("quotation", "readwrite");
    let objectStore = transaction.objectStore("quotation");
    objectStoreRequest = objectStore.add(newItem);
}