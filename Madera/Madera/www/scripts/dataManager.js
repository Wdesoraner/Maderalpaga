function exportToJsonString(idbDatabase, cb) {
    var exportObject = {};
    if (idbDatabase.objectStoreNames.length === 0)
        return exportObject;
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
                    if (idbDatabase.objectStoreNames.length === Object.keys(exportObject).length) {
                        console.log(JSON.stringify(exportObject));
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
                //$.post("http://127.0.0.1/madera_WS/postData.php", jsonString, function () {
                //    console.log("Passe");
                //});
            }
        });
    }
}

function getData() {
    $.getJSON("http://127.0.0.1/madera_WS/getData.php", function (data) {
        var dbName = "maderaDB";
        var request = indexedDB.open(dbName);
        request.onsuccess = function (e) {
            var database = e.target.result;
            data.forEach(function (row) {
                switch (Object.keys(row)[0].toLowerCase()) {
                    case "client":
                        addCustomer(database, row.client);
                        break;
                    case "projet":
                        addProject(database, row.projet);
                        break;
                    case "devis":
                        addQuotation(database, row.devis);
                        break;
                    case "devis_module":
                        addQuotation(database, row.devis_module);
                        break;
                    case "etat":
                        addState(database, row.etat);
                        break;
                    case "utilisateur_projet":
                        addUserProject(database, row.utilisateur_projet);
                        break;
                    case "utilisateur":
                        addUser(database, row.utilisateur);
                        break;
                    case "magasin":
                        addDepartment(database, row.magasin);
                        break;
                    case "module":
                        addModule(database, row.module);
                        break;
                    case "gamme":
                        addCollection(database, row.gamme);
                        break;
                    case "unite":
                        addUnite(database, row.unite);
                        break;
                    case "module_composant":
                        addModuleComponents(database, row.module_composant);
                        break;
                    case "composant":
                        addComponents(database, row.composant);
                        break;
                    case "type_composant":
                        addTypeComponent(database, row.type_composant);
                        break;
                    case "taxe":
                        addTaxes(database, row.TVA);
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
    console.log(transaction);
    let objectStore = transaction.objectStore("customer");
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idClient));
    console.log(objectStoreRequest);
}

function addProject(db, data) {
    console.log(data);
    let newItem = {
        projectName: data.nomProjet,
        commercial: data.responsable,
        date: data.date,
        refProject: data.referenceProjet,
        customer: data.client,
        idProject: data.idProjet,
        amountProject: data.montantProjet,
        addressProject: data.adresseProjet,
        cityProject: data.villeProjet,
        zipCodeProject: data.codePostalProjet
    };
    let transaction = db.transaction("project", "readwrite");
    let objectStore = transaction.objectStore("project");
    transaction.onsuccess = function () {
        console.log("Import réussi !");
    }
    transaction.onerror = function (err) {
        console.log(err);
    }
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idProjet));
}

function addQuotation(db, data) {
    console.log(data);
    let quotation = ["idQuotation", "reference", "date", "discount", "state", "idProject"];
    let newItem = {
        idQuotation: data.idDevis,
        reference: data.referenceDevis,
        date: data.dateDevis,
        idProject: data.idProjet,
        state: data.etat,
        discount: data.remise
    };
    let transaction = db.transaction("quotation", "readwrite");
    let objectStore = transaction.objectStore("quotation");
    transaction.onsuccess = function () {
        console.log("Import réussi !");
    }
    transaction.onerror = function (err) {
        console.log(err);
    }
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idDevis));
}

function addModuleQuotation(db, data) {
    console.log(data);
    let newItem = {
        idModule: data.idModule,
        idQuotation: data.idDevis,
        label: data.libelle,
        length: data.longueur,
        height: date.hauteur,
        section: data.section,
        angle: data.angle
    };
    let transaction = db.transaction("modulesQuotation", "readwrite");
    let objectStore = transaction.objectStore("modulesQuotation");
    transaction.onsuccess = function () {
        console.log("Import réussi !");
    }
    transaction.onerror = function (err) {
        console.log(err);
    }
    let objectStoreRequest = objectStore.put(newItem);
}

function addState(db, data) {
    console.log(data);
    let newItem = {
        idState: data.idEtat,
        label: data.libelle
    };
    let transaction = db.transaction("state", "readwrite");
    let objectStore = transaction.objectStore("state");
    transaction.onsuccess = function () {
        console.log("Import réussi !");
    }
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idEtat));
}

function addUserProject(db, data) {
    console.log(data);
    let newItem = {
        idUser: data.idUtilisateur,
        idProject: data.idProjet
    };
    let transaction = db.transaction("userProject", "readwrite");
    let objectStore = transaction.objectStore("userProject");
    transaction.onsuccess = function () {
        console.log("Import réussi !");
    }
    let objectStoreRequest = objectStore.put(newItem);
}

function addUser(db, data) {
    console.log(data);
    let newItem = {
        idUser: data.idUtilisateur,
        name: data.nom,
        firstName: data.prenom,
        department: data.service,
        shop: data.magasin,
        mail: data.mail,
        password: data.motDePasse
    };
    let transaction = db.transaction("user", "readwrite");
    let objectStore = transaction.objectStore("user");
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idUtilisateur));
}

function addDepartment(db, data) {
    console.log(data);
    let newItem = {
        idShop: data.idMagasin,
        address: data.adresse,
        city: data.ville,
        zipCode: data.codePostal
    };
    let transaction = db.transaction("shop", "readwrite");
    let objectStore = transaction.objectStore("shop");
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idMagasin));
}

function addModule(db, data) {
    console.log(data);
    let newItem = {
        idModule: data.idModule,
        label: data.libelle,
        price: data.prixUnitaire,
        specific: data.caracteristiques,
        isModel: data.estModele,
        cut: data.coupePrincipe,
        idCollection: data.GammeidGamme,
        margin: data.margeCommerce,
        idParentModule: data.idModuleidModule
    };
    let transaction = db.transaction("modules", "readwrite");
    let objectStore = transaction.objectStore("modules");
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idModule));
}

function addCollection(db, data) {
    console.log(data);
    let newItem = {
        idCollection: data.idGamme,
        label: data.libelle,
        quality: data.qualiteGamme
    };
    let transaction = db.transaction("collection", "readwrite");
    let objectStore = transaction.objectStore("collection");
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idGamme));
}

function addUnite(db, data) {
    console.log(data);
    let newItem = {
        idUnite: data.idUnite,
        label: data.libelle,
    };
    let transaction = db.transaction("unite", "readwrite");
    let objectStore = transaction.objectStore("unite");
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idUnite));
}

function addModuleComponents(db, data) {
    console.log(data);
    let newItem = {
        idModule: data.idModule,
        idComponent: data.idComposant,
        quantity: data.quantite
    };
    let transaction = db.transaction("moduleComponents", "readwrite");
    let objectStore = transaction.objectStore("moduleComponents");
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idModule));
}

function addComponents(db, data) {
    console.log(data);
    let newItem = {
        idComponent: data.idComposant,
        label: data.libelle,
        refComposant: data.refComposant,
        price: data.prix,
        specific: data.caracteristiques,
        typeComponent: data.typeComposant,
        taxe: data.idTVA,
        idUnite: data.idUnite
    };
    let transaction = db.transaction("components", "readwrite");
    let objectStore = transaction.objectStore("components");
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idComposant));
}

function addTypeComponent(db, data) {
    console.log(data);
    let newItem = {
        idTypeComponent: data.idTypeComposant,
        label: data.libelle,
        code: data.code
    };
    let transaction = db.transaction("typeComponent", "readwrite");
    let objectStore = transaction.objectStore("typeComponent");
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idTypeComposant));
}

function addTaxes(db, data) {
    console.log(data);
    let newItem = {
        idTaxe: data.idTVA,
        amount: data.tauxTVA
    };
    let transaction = db.transaction("taxes", "readwrite");
    let objectStore = transaction.objectStore("taxes");
    let objectStoreRequest = objectStore.put(newItem, parseInt(data.idTVA));
}