var fixture = true;

$(document).ready(function () {
    let DBOpenRequest = window.indexedDB.open("maderaDB", 1);
    DBOpenRequest.onupgradeneeded = function (event) {

        db = event.target.result;
        db.close();
    }

    let department = ["idDepartment", "label", "code"];

    let shop = ["idShop", "address", "city", "zipCode"];

    let user = ["idUser", "name", "firstName", "department", "shop", "mail", "password"];

    let customer = ["idCustomer", "name", "firstName", "company", "address", "city", "zipCode", "mail", "phone"];

    let project = ["projectName", "commercial", "date", "idProject", "refProject", "customer"];

    let userProject = ["idUser", "idProject"];

    let collection = ["idCollection", "label", "quality"];

    let typeComponent = ["idTypeComponent", "label", "code"];

    let components = ["idComponent", "refComposant", "label", "price", "comment", "typeComponent", "taxe"];

    let taxes = ["idTaxe", "amount"];

    let quotation = ["idQuotation", "name", "reference", "date", "collection", "fill", "finishIn", "finishOut", "cut", "idProject"];

    let componentsQuotation = ["idQuotation", "idComponent"];

    let tables = [department, shop, customer, project, collection, typeComponent, components, taxes, quotation, componentsQuotation, user, userProject];

    let tableNames = ["department", "shop", "customer", "project", "collection", "typeComponent", "components", "taxes", "quotation", "componentsQuotation", "user", "userProject"];

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
                if (tableNames[indexTab] == "shop") {
                    initTableShop(e.target.result);
                } else if (tableNames[indexTab] == "department") {
                    initTableDepartment(e.target.result);
                } else if (tableNames[indexTab] == "user") {
                    initTableUser(e.target.result);
                } else if (tableNames[indexTab] == "collection") {
                    initTableCollection(e.target.result);
                } else if (tableNames[indexTab] == "typeComponent") {
                    initTableTypeComponent(e.target.result);
                } else if (tableNames[indexTab] == "taxes") {
                    initTableTaxes(e.target.result);
                }

                if (fixture) {
                    if (tableNames[indexTab] == "customer") {
                        initTableCustomer(e.target.result);
                    } else if (tableNames[indexTab] == "project") {
                        initTableProject(e.target.result);
                    } else if (tableNames[indexTab] == "userProject") {
                        initTableUserProject(e.target.result);
                    } else if (tableNames[indexTab] == "components") {
                        // initTableComponents(e.target.result);
                    } else if (tableNames[indexTab] == "quotation") {
                        initTableQuotation(e.target.result);
                    } else if (tableNames[indexTab] == "componentsQuotation") {
                        // initTableComponentsQuotation(e.target.result);
                    }
                }
                e.target.result.close();
            }
        }
    }

}

function initTableShop(db) {
    let newItems = [
        {
            address: "12 boulevard des Rêves Brisés",
            city: "Saint-Etienne",
            zipCode: "42000"
        },
        {
            address: "42 rue de Larue",
            city: "Montargis",
            zipCode: "45200"
        }
    ]

    let transaction = db.transaction("shop", "readwrite");

    let objectStore = transaction.objectStore("shop");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableDepartment(db) {
    let newItems = [
        {
            label: "Administrateur",
            code: "ADM"
        },
        {
            label: "Développement",
            code: "DAVE"
        },
        {
            label: "Commercial",
            code: "COMAL"
        },
        {
            label: "Bureau d'étude",
            code: "BE"
        }
    ]

    let transaction = db.transaction("department", "readwrite");

    let objectStore = transaction.objectStore("department");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableUser(db) {
    let newItems = [
        {
            name: "BOREL",
            firstName: "Lucas",
            department: 1,
            shop: 1,
            mail: "lb@madera.fr",
            password: "8c41a399d8cbf4d5711cdbe5f95a89ba81732502edf9267f997487ed9a5f70ad",
        },
        {
            name: "RAKIC",
            firstName: "Jules",
            department: 2,
            shop: 2,
            mail: "jr@madera.fr",
            password: "8c41a399d8cbf4d5711cdbe5f95a89ba81732502edf9267f997487ed9a5f70ad",
        },
        {
            name: "MORIN",
            firstName: "Antoine",
            department: 3,
            shop: 1,
            mail: "am@madera.fr",
            password: "8c41a399d8cbf4d5711cdbe5f95a89ba81732502edf9267f997487ed9a5f70ad",
        },
        {
            name: "COMMERCIAL",
            firstName: "Agent",
            department: 3,
            shop: 2,
            mail: "commercial@madera.fr",
            password: "8c41a399d8cbf4d5711cdbe5f95a89ba81732502edf9267f997487ed9a5f70ad",
        },
        {
            name: "Etude",
            firstName: "Bureau",
            department: 4,
            shop: 1,
            mail: "etude@madera.fr",
            password: "8c41a399d8cbf4d5711cdbe5f95a89ba81732502edf9267f997487ed9a5f70ad",
        },

    ]

    let transaction = db.transaction("user", "readwrite");

    let objectStore = transaction.objectStore("user");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableUserProject(db) {
    let newItems = [
        {
            idUser: 1,
            idProject: 1
        },
        {
            idUser: 4,
            idProject: 2
        },

    ]

    let transaction = db.transaction("userProject", "readwrite");

    let objectStore = transaction.objectStore("userProject");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
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
function initTableCustomer(db) {
    let newItems = [
        {
            name: "Paccino",
            firstName: "Albert",
            company: "",
            address: "4 rue Point du Jour",
            city: "Dijon",
            zipCode: "21000",
            mail: "al.paccino@gmail.com",
            phone: "0607080910"
        },
        {
            name: "Martin",
            firstName: "Jean",
            company: "Google",
            address: "25 avenue Boileau",
            city: "Paris",
            zipCode: "75000",
            mail: "j.martin@outlook.fr",
            phone: "0701235896"
        },
        {
            name: "Dupont",
            firstName: "Phillipe",
            company: "JoeCompany",
            address: "14 boulevard Saint-Martin",
            city: "Lyon",
            zipCode: "69000",
            mail: "phildupont@hotmail.com",
            phone: "0380551325"
        },
    ]

    let transaction = db.transaction("customer", "readwrite");

    let objectStore = transaction.objectStore("customer");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableTaxes(db) {
    let newItems = [
        {
            amount:20
        },
        {
            amount:10
        },
        {
            amount:5.5
        },
        {
            amount:2.1
        },

    ]

    let transaction = db.transaction("taxes", "readwrite");

    let objectStore = transaction.objectStore("taxes");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableProject(db) {
    let newItems = [
        {
            projectName: "Petite maison dans la prairie",
            commercial: 1,
            date: "2019-12-18",
            refProject: "LBAP191218",
            customer: 1
        },
        {
            projectName: "Petite maison dans la prairie",
            commercial: 3,
            date: "2019-12-17",
            refProject: "AMJM191217",
            customer: 2
        },

    ]

    let transaction = db.transaction("project", "readwrite");

    let objectStore = transaction.objectStore("project");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableComponents(db) {
    let newItems = [
        {

        },

    ]

    let transaction = db.transaction("components", "readwrite");

    let objectStore = transaction.objectStore("components");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableQuotation(db) {
    let newItems = [
        {
            name: "Devis 01",
            reference: "P1D1-191219",
            date: "2019-12-19",
            collection: 1,
            fill: "Panneau à Ossature",
            finishIn: "Panneau platre",
            finishOut: "Bois",
            cut: "A-A",
            idProject: 1
        },
        {
            name: "Devis 02",
            reference: "P1D2-191220",
            date: "2019-12-20",
            collection: 2,
            fill: "Poteaux-Poutre",
            finishIn: "Panneau platre",
            finishOut: "Crépis",
            cut: "B-B",
            idProject: 1
        },
        {
            name: "Devis 01",
            reference: "P2D1-191218",
            date: "2019-12-18",
            collection: 3,
            fill: "Poteaux-Poutre",
            finishIn: "Panneau platre",
            finishOut: "Bois",
            cut: "C-C",
            idProject: 2
        },

    ]

    let transaction = db.transaction("quotation", "readwrite");

    let objectStore = transaction.objectStore("quotation");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableComponentsQuotation(db) {
    let newItems = [
        {

        },

    ]

    let transaction = db.transaction("", "readwrite");

    let objectStore = transaction.objectStore("");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}



