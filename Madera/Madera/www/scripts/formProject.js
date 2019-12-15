

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
    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");

    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        var select = document.getElementById("selectCustomer");

        let transaction = db.transaction("customer", "readwrite");

        let objectStore = transaction.objectStore("customer");
        let request = objectStore.openCursor();

        request.onerror = function (event) {
            console.err("error fetching data");
        };

        request.onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                var option = document.createElement("option");
                let key = cursor.primaryKey;
                let value = cursor.value;
                console.info(key, value.company);
                if (value.company != "") {
                    option.text = value.company;
                } else {
                    option.text = value.firstName + " " + value.name;
                }
                option.id = key;
                console.log(option);
                select.appendChild(option);
                cursor.continue();
            }
            sortList();
        };
    }
}

function optionSelected() {
    let userSelected = document.getElementById("pickedCustomer").value;

    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");

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

    if (checkRequiredInput()) {

        console.log("yep");
        let db;
        let DBOpenRequest = window.indexedDB.open("maderaDB");

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
                date: document.getElementById("projectDate").value,
                customer : document.getElementById("idCustomer").value
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

function sortList() {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("selectCustomer");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("option");
        // Loop through all list items:
        for (i = 1; i < (b.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Check if the next item should
            switch place with the current item: */
            if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
                /* If next item is alphabetically lower than current item,
                mark as a switch and break the loop: */
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }
}

function checkRequiredInput() {
    var inputList = document.getElementsByTagName('input');
    for (var i = 0; i < inputList.length; i++) {
        if (inputList[i].value === '' && inputList[i].hasAttribute('required')) {
            alert('Certains champs requis sont incomplets!');
            return false;
        }
    };
    return true;

}