$(document).ready(function () {
    initQuotationTable();
    document.getElementById("add-item-collection").onclick = newQuotation;
});

function initQuotationTable() {

    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");
    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        let transaction = db.transaction("quotation", "readonly");

        let objectStore = transaction.objectStore("quotation");
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

function addRow(value, key) {
    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");
    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        let transaction = db.transaction("project", "readwrite");
        let objectStore = transaction.objectStore("project");
        let request = objectStore.get(parseInt(value.idProject));

        request.onerror = function (event) {
            console.err("error fetching data");
        };

        request.onsuccess = function (event) {
            let table = document.getElementById("quotationTable")
            let hIdProject = document.getElementById("idProject").value;

            if (hIdProject == value.idProject) {

                let newRow = document.createElement("tr");

                newRow.id = key;
                newRow.innerHTML += "<td>" + value.name + "</td>";
                newRow.innerHTML += "<td>" + value.reference + "</td>";
                newRow.innerHTML += "<td>" + value.date + "</td>";
                newRow.innerHTML += "<td>" + value.collection + "</td>";
                newRow.onclick = function () { clickQuotationRow(newRow.id) };
                table.appendChild(newRow);
            }
        }
    }
}

function clickQuotationRow(idQuotation) {
    let hIdProject = document.getElementById("idProject").value;
    sessionStorage.setItem("idProject", hIdProject);
    sessionStorage.removeItem("quotation");
    sessionStorage.setItem("quotation", idQuotation);
    document.location.href = "formQuotation.html"
}

function newQuotation() {
    let hIdProject = document.getElementById("idProject").value;
    sessionStorage.setItem("idProject", hIdProject);
    sessionStorage.removeItem("quotation");
    document.location.href = "formQuotation.html";
}