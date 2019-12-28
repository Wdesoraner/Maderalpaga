$(document).ready(function () {
    initProjectTable();
    document.getElementById("add-item-collection").onclick = newProject;
});

function initProjectTable() {

    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");
    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        let transaction = db.transaction("project", "readonly");

        let objectStore = transaction.objectStore("project");
        let request = objectStore.openCursor();

        request.onerror = function (event) {
            console.err("error fetching data");
        };

        request.onsuccess = function (event) {
            var cursor = event.target.result;
            let customer;
            if (cursor) {
                addRow(cursor.value, cursor.key)
                cursor.continue();
            }
        }
    };

}

function addRow(value,key) {
    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");
    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        let transaction = db.transaction("customer", "readwrite");
        let objectStore = transaction.objectStore("customer");
        let request = objectStore.get(parseInt(value.customer));

        request.onerror = function (event) {
            console.err("error fetching data");
        };

        request.onsuccess = function (event) {
            let table = document.getElementById("projectTable")
            let newRow = document.createElement("tr");
            console.log(request.result);
            if (request.result.company != "") {
                customer = request.result.company;
            } else {
                customer = request.result.firstName + " " + request.result.name;
            }
            newRow.id = key;
            newRow.innerHTML += "<td>" + value.projectName + "</td>";
            newRow.innerHTML += "<td>" + value.date + "</td>";
            newRow.innerHTML += "<td>" + value.commercial + "</td>";
            newRow.innerHTML += "<td>" + customer + "</td>";
            newRow.onclick = function () { clickProjectRow(newRow.id) };
            table.appendChild(newRow);
        }
    }

}

function clickProjectRow(idProject) {
    sessionStorage.removeItem("project");
    sessionStorage.setItem("project", idProject);
    document.location.href = "formProject.html"
}

function newProject() {
    sessionStorage.removeItem("project");
    document.location.href = "formProject.html";
}