

$(document).ready(function () {

    initSelect();
    if (sessionStorage.getItem("project")) {
        document.getElementById("idProject").value = sessionStorage.getItem("project");
        document.getElementById("submitButton").onclick = updateProject;
        initExistingProject();
    } else {
        document.getElementById("idProject").value = 0;
        var now = new Date();

        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);

        var today = now.getFullYear() + "-" + (month) + "-" + (day);
        document.getElementById("projectDate").value = today;

        document.getElementById("submitButton").onclick = newProject;

        initCommercial();
    }
    $('[href="#step1"]').tab('show');

    makeTree();
});


function initSelect() {
    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");

    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        var select = document.getElementById("selectCustomer");

        let transaction = db.transaction("customer", "readonly");

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
                    option.value = value.company;
                } else {
                    option.value = value.firstName + " " + value.name;
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

        if (document.getElementById("idCustomer").value != 0) {
            console.log(document.getElementById("idCustomer").value);
            let request = objectStore.get(parseInt(document.getElementById("idCustomer").value));
            request.onerror = function (event) {
                console.err("error fetching data");
            };

            request.onsuccess = function (event) {
                let value = event.target.result;
                console.log(value);
                document.getElementById("customerName").value = value.name;
                document.getElementById("customerFirstName").value = value.firstName;
                document.getElementById("customerCompany").value = value.company;
                document.getElementById("customerAddress").value = value.address;
                document.getElementById("customerCity").value = value.city;
                document.getElementById("customerZipCode").value = value.zipCode;
                document.getElementById("customerMail").value = value.mail;
                document.getElementById("customerPhone").value = value.phone;
                inputState(true);
            }
        }
        else {
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
                customer: document.getElementById("idCustomer").value,
                addressProject: document.getElementById("customerAddress").value,
                cityProject: document.getElementById("customerCity").value,
                zipCodeProject: document.getElementById("customerZipCode").value,
                amountProject: "0"
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

function initExistingProject() {
    var idProject = parseInt(sessionStorage.getItem("project"));
    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");

    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        let transaction = db.transaction("project", "readonly");
        let objectStore = transaction.objectStore("project");
        let request = objectStore.get(idProject);
        console.log(idProject);
        request.onerror = function (event) {
            console.err("error fetching data");
        };

        request.onsuccess = function (event) {
            var result = event.target.result;
            document.getElementById("projectDate").value = result.date;
            document.getElementById("projectReference").value = result.refProject;
            document.getElementById("projectName").value = result.projectName;
            document.getElementById("idCommercial").value = result.commercial;
            console.log(result.customer);
            document.getElementById("idCustomer").value = result.customer;
            optionSelected();

            initCommercial();
        }

    }
}

function updateProject() {
    if (checkRequiredInput()) {
        let db;
        let DBOpenRequest = window.indexedDB.open("maderaDB");
        var id = parseInt(document.getElementById("idProject").value, 10);

        DBOpenRequest.onsuccess = function (event) {
            db = event.target.result;


            var transaction = db.transaction("project", "readwrite");

            // On indique le succès de la transaction
            transaction.oncomplete = function (event) {
                console.log("Transaction terminée : lecture finie");
            };

            transaction.onerror = function (event) {
                console.log("Transaction non-ouverte à cause d'une erreur");
            };

            // On crée un magasin d'objet pour la transaction
            var objectStore = transaction.objectStore("project");

            // On ajoute l'objet newItem au magasin d'objets
            var objectStoreRequest = objectStore.get(id);
            objectStoreRequest.onsuccess = function (event) {
                // On indique le succès de l'ajout de l'objet
                // dans la base de données
                var data = objectStoreRequest.result;
                data.projectName = document.getElementById("projectName").value;
                data.addressProject = document.getElementById("customerAddress").value;
                data.city = document.getElementById("customerCity").value;
                data.zipCode = document.getElementById("customerZipCode").value;

                var requestUpdate = objectStore.put(data, id);
                requestUpdate.onerror = function (event) {
                    // Faire quelque chose avec l’erreur
                };
                requestUpdate.onsuccess = function (event) {
                    // Succès - la donnée est mise à jour !
                    alert("Projet mis à jour !");
                };
            };

        }
    }

}

function refProject() {
    let refProject;
    if (document.getElementById("customerCompany").value != "") {
        refProject = document.getElementById("initialCommercial").value + '-' + document.getElementById("customerCompany").value.substring(0, 2) + '-' + document.getElementById("projectDate").value.split("-").join("");
    } else {
        refProject = document.getElementById("initialCommercial").value + '-' + document.getElementById("customerFirstName").value.charAt(0) + document.getElementById("customerName").value.charAt(0) + '-' + document.getElementById("projectDate").value.split("-").join("");
    }
    document.getElementById("projectReference").value = refProject.toUpperCase();
}

function initCommercial() {
    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");
    var id;

    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;


        var transaction = db.transaction("user", "readonly");
        // On indique le succès de la transaction
        transaction.oncomplete = function (event) {
            console.log("Transaction terminée : lecture finie");
        };

        transaction.onerror = function (event) {
            console.log("Transaction non-ouverte à cause d'une erreur");
        };

        // On crée un magasin d'objet pour la transaction
        var objectStore = transaction.objectStore("user");

        // On ajoute l'objet newItem au magasin d'objets
        if (document.getElementById("idCommercial").value == 0) {
            id = sessionStorage.getItem("idCommercial");
        } else {
            id = document.getElementById("idCommercial").value;
        }
        var objectStoreRequest = objectStore.get(parseInt(id));
        objectStoreRequest.onsuccess = function (event) {
            // On indique le succès de l'ajout de l'objet
            // dans la base de données
            document.getElementById("commercial").value = event.target.result.firstName + " " + event.target.result.name;
            document.getElementById("initialCommercial").value = event.target.result.firstName.charAt(0).toLowerCase() + event.target.result.name.charAt(0).toLowerCase() + id;
            console.log(document.getElementById("initialCommercial").value);
        }
    }
}

function changeSelector() {
    var input = document.getElementById("pickedCustomer").value;
    var select = document.getElementById("selectCustomer");
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value == input) {
            document.getElementById("idCustomer").value = select.options[i].id;
            console.log(document.getElementById("idCustomer").value);
            break;
        }
    }
    optionSelected();
};

function makeTree() {
    let tree = {
        1: {
            2: '',
            3: {
                6: '',
                7: '',
            },
            4: '',
            5: ''
        }
    };

    let treeParams = {
        1: { trad: 'JavaScript' },
        2: { trad: 'jQuery' },
        3: { trad: 'React' },
        4: { trad: 'Angular' },
        5: { trad: 'Vue.js' },
        6: { trad: 'ReactJS' },
        7: { trad: 'React Native' }
    };

    treeMaker(tree, {
        id: 'tree',
        treeParams: treeParams,
        link_width: '4px',
        link_color: '#2199e8',
        card_click: function (element) {
            console.log(element);
        }
        
    });
}

