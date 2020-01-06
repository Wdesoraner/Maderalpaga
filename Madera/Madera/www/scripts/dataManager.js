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
                    case "devis_module":
                        addModuleQuotation(database, row.Devis);
                        break;
                    case "etat":
                        addState(database, row.Etat);
                        break;
                    case "utilisateur_projet":
                        addUserProject(database, row.Utilisateur_Projet);
                        break;
                    case "utilisateur":
                        addUser(database, row.Utilisateur);
                        break;
                    case "magasin":
                        addDepartment(database, row.Magasin);
                        break;
                    case "module":
                        addModule(database, row.Module);
                        break;
                    case "gamme":
                        addCollection(database, row.Collection);
                        break;
                    case "unite":
                        addUnite(database, row.Unite);
                        break;
                    case "module_composant":
                        addModuleComponents(database, row.Module_Composant);
                        break;
                    case "composant":
                        addComponents(database, row.Composant);
                        break;
                    case "type_composant":
                        addTypeComponent(database, row.Type_Composant);
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
    let objectStore = transaction.objectStore("customer");
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idClient));
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
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idProjet));
}

function addQuotation(db, data) {
    console.log(data);
    let quotation = ["idQuotation", "reference", "date", "discount", "state", "idProject"];
    let newItem = {
        idQuotation: data.idDevis,
        reference: data.referenceDevis,
        date: data.dateDevis,
        idProject: date.idProjet,
        state: data.etat,
        discount: data.remise
    };
    let transaction = db.transaction("quotation", "readwrite");
    let objectStore = transaction.objectStore("quotation");
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idDevis));
}

function addModuleQuotation(db, data) {
    console.log(data);
    let newItem = {
        idModule : data.idModule,
        idQuotation: data.idDevis,
        label: data.libelle,
        length: data.longueur,
        height: date.hauteur,
        section: data.section,
        angle: data.angle
    };
    let transaction = db.transaction("modulesQuotation", "readwrite");
    let objectStore = transaction.objectStore("modulesQuotation");
    objectStoreRequest = objectStore.add(newItem);
}

function addState(db, data) {
    console.log(data);
    let newItem = {
        idState: data.idEtat,
        label: data.libelle
    };
    let transaction = db.transaction("modulesQuotation", "readwrite");
    let objectStore = transaction.objectStore("modulesQuotation");
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idEtat));
}

function addUserProject(db, data) {
    console.log(data);
    let newItem = {
        idUser: data.idUtilisateur,
        idProject: data.idProjet
    };
    let transaction = db.transaction("userProject", "readwrite");
    let objectStore = transaction.objectStore("userProject");
    objectStoreRequest = objectStore.add(newItem);
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
        password:data.motDePasse
    };
    let transaction = db.transaction("user", "readwrite");
    let objectStore = transaction.objectStore("user");
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idUtilisateur));
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
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idMagasin));
}

function addModule(db, data) {
    console.log(data);
    let newItem = {
        idModule: data.idModule,
        label: data.libelle,
        price: data.prixUnitaire,
        specific: data.caracteristiques,
        isModel : data.estModele,
        cut : data.coupePrincipe,
        idCollection : data.GammeidGamme,
        margin : data.margeCommerce,
        idParentModule : data.idModuleidModule
    };
    let transaction = db.transaction("modules", "readwrite");
    let objectStore = transaction.objectStore("modules");
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idModule));
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
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idGamme));
}

function addUnite(db, data) {
    console.log(data);
    let newItem = {
        idUnite: data.idUnite,
        label: data.libelle,
    };
    let transaction = db.transaction("unite", "readwrite");
    let objectStore = transaction.objectStore("unite");
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idUnite));
}

function addModuleComponents(db, data) {
    console.log(data);
    let newItem = {
        idModule: data.idModule,
        idComponent: data.idComposant,
        quantity : data.quantite
    };
    let transaction = db.transaction("moduleComponents", "readwrite");
    let objectStore = transaction.objectStore("moduleComponents");
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idModule));
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
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idComposant));
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
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idTypeComposant));
}

function addTaxes(db, data) {
    console.log(data);
    let newItem = {
        idTaxe: data.idTVA,
        amount: data.tauxTVA
    };
    let transaction = db.transaction("taxes", "readwrite");
    let objectStore = transaction.objectStore("taxes");
    objectStoreRequest = objectStore.add(newItem, parseInt(data.idTVA));
}