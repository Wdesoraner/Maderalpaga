$(document).ready(function () {
    initElement();
    openDB();
    initCustomerList();
});

function addListCustomer(customerName, idCustomer) {
    let list = document.getElementById("customerList");
    let newLi = document.createElement("li");
    newLi.classList.add("list-group-item");
    newLi.id = idCustomer;
    newLi.appendChild(document.createTextNode(customerName));
    newLi.onclick = function () { clickListItem(idCustomer) };
    list.appendChild(newLi);
}

function initElement() {
    document.getElementById("newCustomer").onclick = newCustomer;
    inputState(true);
}

function addCustomer() {
    openDB();
    var newItem = [{
        name: document.getElementById("inputName").value,
        firstName: document.getElementById("inputFirstName").value,
        company: document.getElementById("inputCompany").value,
        address: document.getElementById("inputAddress").value,
        city: document.getElementById("inputCity").value,
        zipCode: document.getElementById("inputZipCode").value,
        mail: document.getElementById("inputMail").value,
        phone: document.getElementById("inputPhone").value
    }];

    console.log(newItem);

    var transaction = db.transaction("customerDB", "readwrite");

    // On indique le succès de la transaction
    transaction.oncomplete = function (event) {
        console.log("Transaction terminée : modification finie");
    };

    transaction.onerror = function (event) {
        console.log("Transaction non-ouverte à cause d'une erreur.Les doublons ne sont pas autorisés");
    };

    // On crée un magasin d'objet pour la transaction
    var objectStore = transaction.objectStore("customerDB");

    // On ajoute l'objet newItem au magasin d'objets
    var objectStoreRequest = objectStore.add(newItem[0]);

    objectStoreRequest.onsuccess = function (event) {
        // On indique le succès de l'ajout de l'objet
        // dans la base de données
        console.log("Un nouvel élément a été ajouté dans la base de données");
    };

    //console.log("wallah");
    //let customer = document.getElementById("inputName");
    //addListCustomer(customer.value);
}

function newCustomer() {
    document.getElementById("validCustomer").onclick = addCustomer;
    document.getElementById("idCustomer").value = 0;
    document.getElementById("inputName").value = "";
    document.getElementById("inputFirstName").value = "";
    document.getElementById("inputCompany").value = "";
    document.getElementById("inputAddress").value = "";
    document.getElementById("inputZipCode").value = "";
    document.getElementById("inputCity").value = "";
    document.getElementById("inputMail").value = "";
    document.getElementById("inputPhone").value = "";
    inputState(false);
}

function editCustomer() {
    document.getElementById("validCustomer").onclick = updateCustomer;
    inputState(false);
}

function updateCustomer() {

}

function initCustomerList() {
    var DBOpenRequest = window.indexedDB.open("customerDB", 1);

    DBOpenRequest.onerror = function (event) {
        console.log("Erreur lors du chargement de la base de données");
    };


    DBOpenRequest.onsuccess = function (event) {
        console.log("Base de données initialisée");

        // On enregistre le résultat de l'ouverture 
        // dans la variable db (on l'utilisera plusieurs
        // fois par la suite).
        console.log(DBOpenRequest.result);
        db = DBOpenRequest.result;

        console.log("Wallah");
        var transaction = db.transaction("customerDB", "readwrite");

        // On crée un magasin d'objet pour la transaction
        var objectStore = transaction.objectStore("customerDB");

        // On ajoute l'objet newItem au magasin d'objets
        var objectStoreRequest = objectStore.getAll();

        objectStoreRequest.onsuccess = function (event) {
            // On indique le succès de l'ajout de l'objet
            // dans la base de données
            console.log("Les objets ont été récupérés");
            console.log(objectStoreRequest.result);

            objectStoreRequest.result.forEach(function (element) {
                if (element.company != "") {
                    addListCustomer(element.company, element.name);
                } else {
                    addListCustomer(element.firstName + " " + element.name, element.name)
                }

                console.log(element);
            });
        };

    };

    // Ce gestionnaire permet de parer au cas où une 
    // nouvelle version de la base de données doit 
    // être créée.
    // Soit la base de données n'existait pas, soit
    // il faut utiliser une nouvelle version

    DBOpenRequest.onupgradeneeded = function (event) {
        db = DBOpenRequest.result;

        db.onerror = function (event) {
            console.log("Erreur lors du chargement de la base");
        };

    }

}

function clickListItem(keyItem) {
    document.getElementById("editCustomer").onclick = editCustomer;

    openDB();
    var transaction = db.transaction("customerDB", "readonly");

    // On indique le succès de la transaction
    transaction.oncomplete = function (event) {
        console.log("Transaction terminée : lecture finie");
    };

    transaction.onerror = function (event) {
        console.log("Transaction non-ouverte à cause d'une erreur");
    };

    // On crée un magasin d'objet pour la transaction
    var objectStore = transaction.objectStore("customerDB");

    // On ajoute l'objet newItem au magasin d'objets
    var objectStoreRequest = objectStore.get(keyItem);

    objectStoreRequest.onsuccess = function (event) {
        // On indique le succès de l'ajout de l'objet
        // dans la base de données
        console.log("Un objet a été récupéré dans la base");
        document.getElementById("inputName").value = objectStoreRequest.result.name;
        document.getElementById("inputFirstName").value = objectStoreRequest.result.firstName;
        document.getElementById("inputCompany").value = objectStoreRequest.result.company;
        document.getElementById("inputAddress").value = objectStoreRequest.result.address;
        document.getElementById("inputCity").value = objectStoreRequest.result.city;
        document.getElementById("inputZipCode").value = objectStoreRequest.result.zipCode;
        document.getElementById("inputMail").value = objectStoreRequest.result.mail;
        document.getElementById("inputPhone").value = objectStoreRequest.result.phone;
    };

}

function openDB() {
    //indexedDB.deleteDatabase("customerDB");
    var DBOpenRequest = window.indexedDB.open("customerDB", 1);

    DBOpenRequest.onerror = function (event) {
        console.log("Erreur lors du chargement de la base de données");
    };

    DBOpenRequest.onsuccess = function (event) {
        console.log("Base de données initialisée");

        // On enregistre le résultat de l'ouverture 
        // dans la variable db (on l'utilisera plusieurs
        // fois par la suite).
        db = DBOpenRequest.result;
    };

    // Ce gestionnaire permet de parer au cas où une 
    // nouvelle version de la base de données doit 
    // être créée.
    // Soit la base de données n'existait pas, soit
    // il faut utiliser une nouvelle version

    DBOpenRequest.onupgradeneeded = function (event) {
        let db = DBOpenRequest.result;

        // On crée un magasin d'objet objectStore pour 
        // cette base de données via IDBDatabase.createObjectStore

        var objectStore = db.createObjectStore("customerDB", { keyPath: "name" });

        // Enfin, on définit les données qui seront contenues
        // dans ce modèle de données

        objectStore.createIndex("firstName", "firstName", { unique: false });
        objectStore.createIndex("company", "company", { unique: false });
        objectStore.createIndex("address", "address", { unique: false });
        objectStore.createIndex("city", "city", { unique: false });
        objectStore.createIndex("zipCode", "zipCode", { unique: false });
        objectStore.createIndex("mail", "mail", { unique: false });
        objectStore.createIndex("phone", "phone", { unique: false });


        db.onerror = function (event) {
            console.log("Erreur lors du chargement de la base");
        };


    }
}

function inputState(bool) {
    var element = document.getElementsByTagName("input");
    for (var i = 0; i < element.length; i++) {
        element[i].readOnly = bool;
    }
}