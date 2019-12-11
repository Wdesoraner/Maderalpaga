

$(document).ready(function () {

    initSelect();
    document.getElementById("idProject").value = 0
    $('[href="#step1"]').tab('show');
    var now = new Date();

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    document.getElementById("projectDate").value = today;

    if (document.getElementById("idProject").value = "0") {
        document.getElementById("submitButton").onclick = newProject;
    }
});

function initSelect() {
    var select = document.getElementById("selectCustomer");
    var option = document.createElement("option");

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
                option.text = value.company;
                option.id = value.key;
            } else {
                option.text = value.firstName + " " + value.name;
                option.id = value.key;
            }
            select.appendChild(option);
            cursor.continue();
        }
    };
}

function optionSelected() {
    let userSelected = document.getElementById("pickedCustomer").value;

    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB", 1);

    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;

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
                if (value.company == userSelected || value.firstName + " " + value.name == userSelected) {
                    document.getElementById("idCustomer").value = key;
                    document.getElementById("customerName").value = value.name;
                    document.getElementById("customerFirstName").value = value.firstName;
                    document.getElementById("customerCompany").value = value.company;
                    document.getElementById("customerAddress").value = value.address;
                    document.getElementById("customerCity").value = value.city;
                    document.getElementById("customerZipCode").value = value.zipCode;
                    document.getElementById("customerMail").value = value.mail;
                    document.getElementById("customerPhone").value = value.phone;
                    inputState(true);
                } else {
                    cursor.continue();
                }
            } else {
                document.getElementById("idCustomer").value = "";
                document.getElementById("customerName").value = "";
                document.getElementById("customerFirstName").value = "";
                document.getElementById("customerCompany").value = "";
                document.getElementById("customerAddress").value = "";
                document.getElementById("customerCity").value = "";
                document.getElementById("customerZipCode").value = "";
                document.getElementById("customerMail").value = "";
                document.getElementById("customerPhone").value = "";
                inputState(false);
            }
        };
    }
}

function inputState(bool) {
    var element = document.getElementsByClassName("customer");
    for (var i = 0; i < element.length; i++) {
        element[i].readOnly = bool;
    }
}

function newProject() {

    if (document.getElementById("projectName").value != ""){

        let db;
        let DBOpenRequest = window.indexedDB.open("maderaDB", 1);

        DBOpenRequest.onsuccess = function (event) {
            db = event.target.result;
            let transaction = db.transaction("project", "readwrite");

            // On indique le succès de la transaction
            transaction.oncomplete = function (event) {
                console.log("Transaction terminée : modification finie");
            };

            transaction.onerror = function (event) {
                console.log("Transaction non-ouverte à cause d'une erreur.Les doublons ne sont pas autorisés");
            };

            var newItem = [{
                projectName: document.getElementById("projectName").value,
                commercial: document.getElementById("idCommercial").value,
                refProject: document.getElementById("projectReference").value,
                date: document.getElementById("projectDate").value
            }];

            // On crée un magasin d'objet pour la transaction
            let objectStore = transaction.objectStore("project");

            // On ajoute l'objet newItem au magasin d'objets
            let objectStoreRequest = objectStore.add(newItem[0]);

            objectStoreRequest.onsuccess = function (event) {
                // On indique le succès de l'ajout de l'objet
                // dans la base de données
                console.log("Un nouvel élément a été ajouté dans la base de données");
            };

        }
    }
}