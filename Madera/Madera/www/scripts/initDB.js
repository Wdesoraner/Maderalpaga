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

    let state = ["idState", "label"];

    let project = ["projectName", "commercial", "date", "idProject", "refProject", "customer", "addressProject", "cityProject","zipCodeProject","amountProject"];

    let userProject = ["idUser", "idProject"];

    let collection = ["idCollection", "label", "quality"];

    let typeComponent = ["idTypeComponent", "label", "code"];

    let unite = ["idUnite", "label"];

    let components = ["idComponent", "refComposant", "label", "price", "specific", "typeComponent", "taxe", "idUnite"];

    let moduleComponents = ["idModule", "idComponent", "quantity"];

    let modules = ["idModule", "label", "price", "specific", "isModel", "cut", "idCollection", "margin", "idParentModule"];

    let modulesQuotation = ["idModule", "idQuotation", "label", "length", "height", "section", "angle"];
    
    let quotation = ["idQuotation","state","discount", "reference", "date", "idProject"];

    let taxes = ["idTaxe", "amount"];

    let tables = [department, shop, customer, project, collection, typeComponent, components, taxes, quotation, user, userProject, modules, modulesQuotation, moduleComponents, state, unite];

    let tableNames = ["department", "shop", "customer", "project", "collection", "typeComponent", "components", "taxes", "quotation", "user", "userProject", "modules", "modulesQuotation", "moduleComponents", "state", "unite"];

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
                console.log("init table : " + tableNames[indexTab]);

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
                } else if (tableNames[indexTab] == "state") {
                    initTableState(e.target.result);
                } else if (tableNames[indexTab] == "unite") {
                    initTableUnite(e.target.result);
                } else if (tableNames[indexTab] == "modules") {
                    initTableModules(e.target.result);
                } else if (tableNames[indexTab] == "taxes") {
                    initTableTaxes(e.target.result);
                } else if (tableNames[indexTab] == "components") {
                    initTableComponents(e.target.result);
                } else if (tableNames[indexTab] == "moduleComponents") {
                    initTableModuleComponents(e.target.result);
                }

                if (fixture) {
                    if (tableNames[indexTab] == "customer") {
                        initTableCustomer(e.target.result);
                    } else if (tableNames[indexTab] == "project") {
                        initTableProject(e.target.result);
                    } else if (tableNames[indexTab] == "userProject") {
                        initTableUserProject(e.target.result);
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
            amount: 20
        },
        {
            amount: 10
        },
        {
            amount: 5.5
        },
        {
            amount: 2.1
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
            addressProject: "14 boulevard Saint-Martin",
            cityProject: "Lyon",
            zipCodeProject: "69000",
            customer: 1
        },
        {
            projectName: "Petite maison dans la prairie",
            commercial: 3,
            date: "2019-12-17",
            refProject: "AMJM191217",
            addressProject: "14 boulevard Saint-Martin",
            cityProject: "Lyon",
            zipCodeProject: "69000",
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
function initTableQuotation(db) {
    let newItems = [
        {
            reference: "P1D1-191219",
            date: "2019-12-19",
            idProject: 1
        },
        {
            reference: "P1D2-191220",
            date: "2019-12-20",
            idProject: 1
        },
        {
            reference: "P2D1-191218",
            date: "2019-12-18",
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
function initTableState(db) {
    let newItems = [
        {
            label: "En attente"
        },
        {
            label: "Validé"
        },
        {
            label: "Refusé"
        },
        {
            label: "Projet"
        },
    ]

    let transaction = db.transaction("state", "readwrite");

    let objectStore = transaction.objectStore("state");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableUnite(db) {
    let newItems = [
        {
            label: "pièce"
        },
        {
            label: "m"
        },
        {
            label: "m2"
        },
        {
            label: "cm"
        },
        {
            label: "dm"
        },
        {
            label: "°"
        }

    ]

    let transaction = db.transaction("unite", "readwrite");

    let objectStore = transaction.objectStore("unite");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableModules(db) {
    let newItems = [
        {
            label: "Porte Chêne",
            price: 200,
            specific: "Porte en chêne, 2 points",
            isModel: true,
            cut: "",
            idCollection: 1,
            margin: 15
        },
        {
            label: "Porte Hêtre",
            price: 300,
            specific: "Porte en hêtre, 4 points",
            isModel: true,
            cut: "",
            idCollection: 2,
            margin: 10
        },
        {
            label: "Porte Ipé",
            price: 500,
            specific: "Porte en ipé, 6 points",
            isModel: true,
            cut: "",
            idCollection: 3,
            margin: 10
        },
        {
            label: "Mur droit Chêne",
            price: 5000,
            specific: "Mur extérieur",
            isModel: true,
            cut: "A-A",
            idCollection: 1,
            margin: 15
        },
        {
            label: "Mur droit Hêtre",
            price: 5625,
            specific: "Mur extérieur",
            isModel: true,
            cut: "A-A",
            idCollection: 2,
            margin: 15
        },
        {
            label: "Mur droit Ipé",
            price: 7500,
            specific: "Mur extérieur",
            isModel: true,
            cut: "A-A",
            idCollection: 3,
            margin: 10
        },
        {
            label: "Fenêtre PVC",
            price: 130,
            specific: "100*95",
            isModel: true,
            cut: "",
            idCollection: 1,
            margin: 20
        },
        {
            label: "Fenêtre Bois",
            price: 200,
            specific: "100*95",
            isModel: true,
            cut: "",
            idCollection: 2,
            margin: 15
        },
        {
            label: "Fenêtre Bois",
            price: 400,
            specific: "",
            isModel: true,
            cut: "",
            idCollection: 3,
            margin: 15
        },
        {
            label: "Ensemble finition Eco",
            price: 0,
            specific: "",
            isModel: false,
            cut: "",
            idCollection: 1,
            margin: 15
        },
        {
            label: "Ensemble finition Normal",
            price: 0,
            specific: "",
            isModel: false,
            cut: "",
            idCollection: 2,
            margin: 15
        },
        {
            label: "Ensemble finition Premium",
            price: 0,
            specific: "",
            isModel: false,
            cut: "",
            idCollection: 3,
            margin: 15
        }]

    let transaction = db.transaction("modules", "readwrite");

    let objectStore = transaction.objectStore("modules");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}
function initTableTypeComponent(db) {
    let newItems = [
        {
            label: "Huisserie",
            code: "HUI"
        },
        {
            label: "Isolant",
            code: "ISO"
        },
        {
            label: "Matériaux",
            code: "MAT"
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
function initTableComponents(db) {
    let newItems = [

        {
            idComponent: 1,
            refComposant: "HUI-VSL",
            label: "Vis Longue",
            price: 0.5,
            specific: "Vis longue",
            typeComponent: 1,
            taxe: 3,
            idUnite: 1
        },
        {
            idComponent: 2,
            refComposant: "HUI-VSC",
            label: "Vis courte",
            price: 0.5,
            specific: "Vis longue pour poignée de porte",
            typeComponent: 1,
            taxe: 3,
            idUnite: 1
        },
        {
            idComponent: 3,
            refComposant: "HUI-GP",
            label: "Gond porte",
            price: 2,
            specific: "Gond pour porte",
            typeComponent: 1,
            taxe: 3,
            idUnite: 1
        },
        {
            idComponent: 4,
            refComposant: "HUI-POI",
            label: "Ensemble poignée",
            price: 15,
            specific: "Poignée de porte",
            typeComponent: 1,
            taxe: 3,
            idUnite: 1
        },
        {
            idComponent: 5,
            refComposant: "ISO-LR",
            label: "Laine de roche",
            price: 7,
            specific: "",
            typeComponent: 2,
            taxe: 3,
            idUnite: 3
        },
        {
            idComponent: 6,
            refComposant: "ISO-LV",
            label: "Laine de verre",
            price: 6,
            specific: "",
            typeComponent: 2,
            taxe: 3,
            idUnite: 3
        },
        {
            idComponent: 7,
            refComposant: "MAT-BC",
            label: "Chêne",
            price: 40,
            specific: "",
            typeComponent: 3,
            taxe: 3,
            idUnite: 3
        },
        {
            idComponent: 8,
            refComposant: "MAT-BH",
            label: "Hêtre",
            price: 55,
            specific: "",
            typeComponent: 3,
            taxe: 3,
            idUnite: 3
        },
        {
            idComponent: 9,
            refComposant: "MAT-BI",
            label: "Ipé",
            price: 90,
            specific: "",
            typeComponent: 3,
            taxe: 3,
            idUnite: 3
        },
        {
            idComponent: 10,
            refComposant: "MAT-PANOS",
            label: "Panneau à ossature",
            price: 20,
            specific: "Remplissage gamme normal",
            typeComponent: 2,
            taxe: 3,
            idUnite: 3
        },
        {
            idComponent: 11,
            refComposant: "MAT-PO2",
            label: "Poteaux-Poutre",
            price: 40,
            specific: "Remplissage gamme premium",
            typeComponent: 3,
            taxe: 3,
            idUnite: 3
        },
        {
            idComponent: 12,
            refComposant: "MAT-FEB",
            label: "Finition ext. Bois",
            price: 100,
            specific: "Finition ext gamme normal",
            typeComponent: 3,
            taxe: 3,
            idUnite: 3
        },
        {
            idComponent: 13,
            refComposant: "MAT-FEC",
            label: "Finition ext. Crépis",
            price: 100,
            specific: "Finition ext gamme premium",
            typeComponent: 3,
            taxe: 3,
            idUnite: 3
        },
        {
            idComponent: 14,
            refComposant: "MAT-FIP",
            label: "Finition int. Platre",
            price: 90,
            specific: "Finition int. gamme normal",
            typeComponent: 3,
            taxe: 3,
            idUnite: 3
        },
        {
            idComponent: 15,
            refComposant: "MAT-FIB",
            label: "Finition int. Bois",
            price: 90,
            specific: "Finition int. gamme premium",
            typeComponent: 3,
            taxe: 3,
            idUnite: 3
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
function initTableModuleComponents(db) {
    let newItems = [
        {
            idModule: 1,
            idComponent: 1,
            quantity: 6
        },
        {
            idModule: 1,
            idComponent: 3,
            quantity: 2
        },
        {
            idModule: 1,
            idComponent: 4,
            quantity: 1
        },
        {
            idModule: 2,
            idComponent: 2,
            quantity: 6
        },
        {
            idModule: 2,
            idComponent: 3,
            quantity: 4
        },
        {
            idModule: 2,
            idComponent: 4,
            quantity: 1
        },
        {
            idModule: 3,
            idComponent: 2,
            quantity: 6
        },
        {
            idModule: 3,
            idComponent: 3,
            quantity: 6
        },
        {
            idModule: 3,
            idComponent: 4,
            quantity: 1
        },
        {
            idModule: 4,
            idComponent: 7,
            quantity: 0
        },
        {
            idModule: 4,
            idComponent: 6,
            quantity: 0
        },
        {
            idModule: 5,
            idComponent: 8,
            quantity: 0
        },
        {
            idModule: 5,
            idComponent: 6,
            quantity: 0
        },
        {
            idModule: 6,
            idComponent: 9,
            quantity: 0
        },
        {
            idModule: 6,
            idComponent: 5,
            quantity: 0
        },
        {
            idModule: 11,
            idComponent: 10,
            quantity: 0
        },
        {
            idModule: 11,
            idComponent: 12,
            quantity: 0
        },
        {
            idModule: 11,
            idComponent: 14,
            quantity: 0
        },
        {
            idModule: 12,
            idComponent: 11,
            quantity: 0
        },
        {
            idModule: 12,
            idComponent: 13,
            quantity: 0
        },
        {
            idModule: 12,
            idComponent: 15,
            quantity: 0
        },
    ]

    let transaction = db.transaction("moduleComponents", "readwrite");

    let objectStore = transaction.objectStore("moduleComponents");
    let request = objectStore.openCursor();
    let objectStoreRequest;

    newItems.forEach(function (item) {
        objectStoreRequest = objectStore.add(item);
    });
}

/*
function initTable(db) {
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
*/


