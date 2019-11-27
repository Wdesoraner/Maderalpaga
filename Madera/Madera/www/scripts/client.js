$(document).ready(function () {
    initDB();
    initElement();
    initCustomerList();
});


function initDB() {
    openDB();
}

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
    document.getElementById("editCustomer").onclick = editCustomer;
    document.getElementById("deleteCustomer").onclick = deleteCustomer;
}

function addCustomer() {
    
    console.log("wallah");
    let customer = document.getElementById("inputName");
    addListCustomer(customer.value);
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
}

function editCustomer() {
    document.getElementById("validCustomer").onclick = updateCustomer;
}

function deleteCustomer() {
    document.getElementById("deleteCustomer").onclick
}

function initCustomerList() {
   
}

function clickListItem(idCustomer) {
    
}

var db;
function openDB() {
    var request = indexedDB.open("maderaDB");

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("BD ouverte");
    };

    DBOpenRequest.onupgradeneeded = function (event) {
        var db = this.result;

        db.onerror = function (event) {
            note.innerHTML += '<li>Error loading database.</li>';
        };

        var objectStore = db.createObjectStore("idCustomer", { keyPath: "taskTitle" });

        // définit quels éléments de données l'objet de stockage contiendra.

        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("firstName", "firstName", { unique: false });
        objectStore.createIndex("company", "company", { unique: false });
        objectStore.createIndex("address", "address", { unique: false });
        objectStore.createIndex("city", "city", { unique: false });
        objectStore.createIndex("zipCode", "zipCode", { unique: false });
        objectStore.createIndex("mail", "mail", { unique: false });
        objectStore.createIndex("phone", "phone", { unique: false });
}