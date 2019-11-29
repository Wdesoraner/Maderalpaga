
let db;
let DBOpenRequest = window.indexedDB.open("customerDB", 1);

DBOpenRequest.onupgradeneeded = function (event) {
    // Set the db variable to our database so we can use it!  
    db = event.target.result;

    // Create an object store named notes. Object stores
    // in databases are where data are stored.
    if (!db.objectStoreNames.contains("customer")) {
        let objectStore = db.createObjectStore('customer', { autoIncrement: true });
    } else {
        DBOpenRequest.transaction.objectStore("customer");
    };

    if (!notes.indexNames.contains('name')) {
        console.log("create index : name");
        objectStore.createIndex("name", "name", { unique: false });
    }

    if (!notes.indexNames.contains('firstName')) {
        console.log("create index : firstName");
        objectStore.createIndex("firstName", "firstName", { unique: false });
    }

    if (!notes.indexNames.contains('company')) {
        console.log("create index : company");
        objectStore.createIndex("company", "company", { unique: false });
    }

    if (!notes.indexNames.contains('address')) {
        console.log("create index : address");
        objectStore.createIndex("address", "address", { unique: false });
    }

    if (!notes.indexNames.contains('city')) {
        console.log("create index : city");
        objectStore.createIndex("city", "city", { unique: false });
    }

    if (!notes.indexNames.contains('zipCode')) {
        console.log("create index : zipCode");
        objectStore.createIndex("zipCode", "zipCode", { unique: false });
    }

    if (!notes.indexNames.contains('mail')) {
        console.log("create index : mail");
        objectStore.createIndex("mail", "mail", { unique: false });
    }

    if (!notes.indexNames.contains('phone')) {
        console.log("create index : phone");
        objectStore.createIndex("phone", "phone", { unique: false });
    }

}
DBOpenRequest.onsuccess = function (event) {
    db = event.target.result;
    initCustomerList(db);
}
DBOpenRequest.onerror = function (event) {
    alert('error opening database ' + event.target.errorCode);
}

$(document).ready(function () {
    initElement();
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

function addCustomer(db) {


    console.log(db);

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

    let transaction = db.transaction("customer", "readwrite");

    // On indique le succès de la transaction
    transaction.oncomplete = function (event) {
        console.log("Transaction terminée : modification finie");
    };

    transaction.onerror = function (event) {
        console.log("Transaction non-ouverte à cause d'une erreur.Les doublons ne sont pas autorisés");
    };

    // On crée un magasin d'objet pour la transaction
    let objectStore = transaction.objectStore("customer");

    // On ajoute l'objet newItem au magasin d'objets
    let objectStoreRequest = objectStore.add(newItem[0]);

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

    let db;
    let DBOpenRequest = window.indexedDB.open("customerDB", 1);

    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        document.getElementById("validCustomer").onclick = function () { addCustomer(db) };
    }

}

function editCustomer() {
    if (document.getElementById("idCustomer").value != "0") {
        document.getElementById("validCustomer").onclick = updateCustomer;
        inputState(false);
    }
}

function updateCustomer() {
    let db;
    let DBOpenRequest = window.indexedDB.open("customerDB", 1);
    var id = parseInt(document.getElementById("idCustomer").value, 10);

    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;


        var transaction = db.transaction("customer", "readwrite");

        // On indique le succès de la transaction
        transaction.oncomplete = function (event) {
            console.log("Transaction terminée : lecture finie");
        };

        transaction.onerror = function (event) {
            console.log("Transaction non-ouverte à cause d'une erreur");
        };

        // On crée un magasin d'objet pour la transaction
        var objectStore = transaction.objectStore("customer");

        console.log(typeof id);
        // On ajoute l'objet newItem au magasin d'objets
        var objectStoreRequest = objectStore.get(id);
        objectStoreRequest.onsuccess = function (event) {
            // On indique le succès de l'ajout de l'objet
            // dans la base de données
            var data = objectStoreRequest.result;

            data.name = document.getElementById("inputName").value;
            data.firstName = document.getElementById("inputFirstName").value;
            data.company = document.getElementById("inputCompany").value;
            data.city = document.getElementById("inputCity").value;
            data.address = document.getElementById("inputAddress").value;
            data.zipCode = document.getElementById("inputZipCode").value;
            data.mail = document.getElementById("inputMail").value;
            data.phone = document.getElementById("inputPhone").value;

            var requestUpdate = objectStore.put(data);
            requestUpdate.onerror = function (event) {
                // Faire quelque chose avec l’erreur
            };
            requestUpdate.onsuccess = function (event) {
                // Succès - la donnée est mise à jour !
                objectStore.delete(id);
            };
        };

    }

}

function initCustomerList(db) {

    let transaction = db.transaction("customer", "readwrite");

    let objectStore = transaction.objectStore("customer");
    let request = objectStore.openCursor();

    request.onerror = function (event) {
        console.err("error fetching data");
    };

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let key = cursor.primaryKey;
            let value = cursor.value;
            console.log(key, value);
            if (value.company != "") {
                addListCustomer(value.company, key);
            } else {
                addListCustomer(value.firstName + " " + value.name, key)
            }
            cursor.continue();
        }
    };


}

function clickListItem(keyItem) {
    let db;
    let DBOpenRequest = window.indexedDB.open("customerDB", 1);

    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        document.getElementById("editCustomer").onclick = function () { editCustomer(keyItem) };

        var transaction = db.transaction("customer", "readonly");

        // On indique le succès de la transaction
        transaction.oncomplete = function (event) {
            console.log("Transaction terminée : lecture finie");
        };

        transaction.onerror = function (event) {
            console.log("Transaction non-ouverte à cause d'une erreur");
        };

        // On crée un magasin d'objet pour la transaction
        var objectStore = transaction.objectStore("customer");

        // On ajoute l'objet newItem au magasin d'objets
        var objectStoreRequest = objectStore.get(keyItem);

        objectStoreRequest.onsuccess = function (event) {
            // On indique le succès de l'ajout de l'objet
            // dans la base de données
            console.log("Un objet a été récupéré dans la base");
            document.getElementById("idCustomer").value = keyItem;
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


}

function inputState(bool) {
    var element = document.getElementsByTagName("input");
    for (var i = 0; i < element.length; i++) {
        element[i].readOnly = bool;
    }
}