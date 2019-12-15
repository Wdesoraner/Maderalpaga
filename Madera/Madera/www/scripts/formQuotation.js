var listen = {
    //listener click tr
    clickListener: function (tr) {
        tr.find('.add-child-item').click(function (e) {
            console.log($(this));
            listen.addChild($(this).attr('id'));
            //listen.addChild($(this).attr('id'));
        }),
            tr.find('.del-item-collection').click(function (e) {
                listen.delChild($(this).closest("tr").attr('id'))
            })
            ;
    },
    addChild: function (id) {

        // si undefined, duplicateItem()
        if (id === undefined) {

        }
        document.getElementById("hiddenId").value++;
        let idTr = document.getElementById("hiddenId").value;

        newRowComponent = getRowComponent(idTr, id)

        let tr = document.createElement("tr");
        tr.innerHTML = newRowComponent;
        tr.classList.add('item-collection');
        tr.id = idTr;

        var element = document.getElementById(id);
        element.closest("tr").after(tr);
        //element.after(tr);

        let DBOpenRequest = indexedDB.open("localMaderaDB");
        DBOpenRequest.onsuccess = function (event) {
            db = event.target.result;
            initTypeComponentList(db, idTr);
            initCollectionList(db, idTr);
        }
        listen.clickListener($(tr));
    },
    delChild: function (id) {
        var element = document.getElementById(id);
        element.remove(element);
    }
}


$(document).ready(function () {
    document.getElementById("hiddenId").value = 0;

    duplicateItem();

    $('[href="#step1"]').tab('show');

    $('.next').click(function () {

        var nextId = $(this).parents('.tab-pane').next().attr("id");
        $('[href="#' + nextId + '"]').tab('show');
        return false;
    })

    $('#add-item-collection').click(function () {
        duplicateItem();
    })

    $('#btnSaveQuotation').click(function () {
        //generatePDF();
        addQuotation(db);
    })

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        //update progress
        var step = $(e.target).data('step');
        var percent = (parseInt(step) / 3) * 100;

        $('.progress-bar').css({ width: percent + '%' });
        $('.progress-bar').text("Étape " + step + " sur 3");


    })


    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        var className = $('#step3').attr('class');
        if (className.includes('active')) {
            resetQuotation();
            completeQuotation();
        }
    })



});

function getRowComponent(idTr, idParent = 0) {
    return '<tr id="' + idTr + '" class="item-collection"><td style="width:10%"><span id="parentComponent">' + idParent + '</span></td><td><select class="w-100 h-100 border border-0" id="selectTypeComponent' + idTr + '"></select></td><td><select class="w-100 h-100 border border-0" id="selectCollection' + idTr + '"></select></td > <td><input type="text" class="w-100 h-100 border border-0" /></td> <td class="text-right"><input type="number" class="w-75 h-100 border border-0" />m</td><td><select class="w-100 h-100 border border-0"><option></option><option>Entrant</option><option>Sortant</option></select></td><td><button class="btn btn-success rounded rounded-circle add-child-item" id="btnAdd' + idTr + '""><div class="font-weight-bold">+</div></button><button class="btn btn-danger rounded rounded-circle del-item-collection" id="btnDel' + idTr + '><div class="font-weight-bold">-</div></button></td></tr>'
    // onclick="addChild(' + idTr + ')
    //"onclick="delItem(' + idTr + ')"
}

function duplicateItem() {
    document.getElementById("hiddenId").value++;

    //    console.log(document.getElementById("hiddenId").value);

    let idTr = document.getElementById("hiddenId").value;

    newRowComponent = getRowComponent(idTr)

    let tr = document.createElement("tr");

    tr.innerHTML = newRowComponent;

    tr.classList.add('item-collection');
    tr.id = idTr;
    document.getElementById("table-collection").appendChild(tr);

    let DBOpenRequest = indexedDB.open("localMaderaDB");
    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        initTypeComponentList(db, idTr);
        initCollectionList(db, idTr);

        //initTableCollection(db);
        //initTableTypeComponent(db);
    }
    listen.clickListener($(tr));


};

//function delItem(id) {
//    console.log('wallah');

//    var element = document.getElementById(id);
//    element.remove(element);
//    //element.parentNode.removeChild(element);
//}

//function addChild(id) {
//    document.getElementById("hiddenId").value++;
//    let idTr = document.getElementById("hiddenId").value;

//    newRowComponent = getRowComponent(idTr, id)

//    let tr = document.createElement("tr");
//    tr.innerHTML = newRowComponent;
//    tr.classList.add('item-collection');
//    tr.id = idTr;

//    var element = document.getElementById(id);
//    console.log(element.id);
//    //element.closest("tr").after(tr);
//    element.after(tr);

//    let DBOpenRequest = indexedDB.open("localMaderaDB");
//    DBOpenRequest.onsuccess = function (event) {
//        db = event.target.result;
//        initTypeComponentList(db, idTr);
//        initCollectionList(db, idTr);
//    }


//    test.generateLine();




//    //console.log('ntm');
//    //document.getElementById("hiddenId").value++;
//    //let idTr = document.getElementById("hiddenId").value;

//    //var element = document.getElementById(id);
//    //var table = document.getElementById("table-collection");
//    //newRowComponent = getRowComponent(idTr)
//    //element.closest("tr").after();
//    //var row = table.insertRow(document.getElementById(id).rowIndex);
//    //console.log(document.getElementById(id).rowIndex);

//}

function resetQuotation() {
    document.getElementById('refQuotationToInsert').innerHTML = "";
    document.getElementById('dateQuotationToInsert').innerHTML = "";
    document.getElementById('customerNameToInsert').innerHTML = "";
    document.getElementById('customerAddressToInsert').innerHTML = "";
    document.getElementById('customerPostalToInsert').innerHTML = "";

}

function completeQuotation() {

    var formText = document.createTextNode(document.getElementById("quotationReference").value);
    var quotationDiv = document.getElementById("refQuotationToInsert");
    quotationDiv.appendChild(formText);

    var date = new Date(document.getElementById("quotationDate").value);
    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };

    var dateTemp = date.toLocaleDateString('fr-FR', options)

    formText = document.createTextNode(dateTemp);
    quotationDiv = document.getElementById("dateQuotationToInsert");
    quotationDiv.appendChild(formText);


    //var tempText = document.getElementById("customerName").value + ' ' + document.getElementById("customerFirstName").value;
    //if (document.getElementById("customerCompany").value != '') {
    //tempText += ' (' + document.getElementById("customerCompany").value + ')';
    //}

    //formText = document.createTextNode(tempText);
    //quotationDiv = document.getElementById("customerNameToInsert");
    //quotationDiv.appendChild(formText);

    //formText = document.createTextNode(document.getElementById("customerAddress").value);
    //quotationDiv = document.getElementById("customerAddressToInsert");
    //quotationDiv.appendChild(formText);

    //var tempText = document.getElementById("customerPostal").value + ' ' + document.getElementById("customerCity").value;

    //formText = document.createTextNode(tempText);
    //quotationDiv = document.getElementById("customerPostalToInsert");
    //quotationDiv.appendChild(formText);


}

function generatePDF() {
    var HTML_Width = $("#previewQuotation").width();
    var HTML_Height = $("#previewQuotation").height();

    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($("#previewQuotation")[0], { allowTaint: true }).then(function (canvas) {
        canvas.getContext('2d');

        //console.log(canvas.height + "" + canvas.width);


        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);


        for (var i = 1; i <= totalPDFPages; i++) {
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
        }

        pdf.save("HTML-Document.pdf");
    });
}

function initQuotationList(db) {

    let transaction = db.transaction("quotation", "readwrite");

    let objectStore = transaction.objectStore("quotation");
    let request = objectStore.openCursor();

    request.onerror = function (event) {
        console.err("error fetching data");
    };

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let key = cursor.primaryKey;
            let value = cursor.value;
            //console.log(key, value);
            if (value.company != "") {
                addListCustomer(value.company, key);
            } else {
                addListCustomer(value.firstName + " " + value.name, key)
            }
            cursor.continue();
        }
    };


}

function addOptionCollection(collectionLabel, idCollection, idTr) {
    let list = document.getElementById("selectCollection" + idTr);
    let opt = document.createElement("option");
    opt.id = idCollection;
    opt.appendChild(document.createTextNode(collectionLabel));
    opt.onclick = function () { clickListItem(idCollection) };
    list.appendChild(opt);
}

function addOptionTypeComponent(typeComponentLabel, idTypeComponent, idTr) {
    let list = document.getElementById("selectTypeComponent" + idTr);
    let opt = document.createElement("option");
    opt.id = idTypeComponent;
    opt.appendChild(document.createTextNode(typeComponentLabel));
    opt.onclick = function () { clickListItem(idTypeComponent) };
    list.appendChild(opt);
}


/*-------------------------------------------------DB--------------------------------------------------------------*/

let db;
let DBOpenRequest = indexedDB.open("localMaderaDB");

DBOpenRequest.onupgradeneeded = function (event) {
    // Set the db variable to our database so we can use it!
    db = event.target.result;

    // Create an object store named db. Object stores
    // in databases are where data are stored.
    let objectStore = db.createObjectStore('collection', { autoIncrement: true });
    //console.log("create index : label");
    objectStore.createIndex("label", "label", { unique: false });

    //console.log("create index : collection");
    objectStore.createIndex("quality", "quality", { unique: false });



    objectStore = db.createObjectStore('components', { autoIncrement: true });

    //console.log("create index : refComposant");
    objectStore.createIndex("refComposant", "refComposant", { unique: false });

    //console.log("create index : label");
    objectStore.createIndex("label", "label", { unique: false });

    //console.log("create index : price");
    objectStore.createIndex("price", "price", { unique: false });

    //console.log("create index : comment");
    objectStore.createIndex("comment", "comment", { unique: false });

    //console.log("create index : typeComponent");
    objectStore.createIndex("typeComponent", "typeComponent", { unique: false });

    //console.log("create index : component");
    objectStore.createIndex("component", "component", { unique: false });



    objectStore = db.createObjectStore('quotation', { autoIncrement: true });

    //console.log("create index : date");
    objectStore.createIndex("name", "name", { unique: true });

    //console.log("create index : date");
    objectStore.createIndex("reference", "reference", { unique: true });

    //console.log("create index : date");
    objectStore.createIndex("date", "date", { unique: false });

    //console.log("create index : collection");
    objectStore.createIndex("collection", "collection", { unique: false });

    //console.log("create index : fill");
    objectStore.createIndex("fill", "fill", { unique: false });

    //console.log("create index : fill");
    objectStore.createIndex("finishIn", "finishIn", { unique: false });

    //console.log("create index : fill");
    objectStore.createIndex("finishOut", "finishOut", { unique: false });

    //console.log("create index : cut");
    objectStore.createIndex("cut", "cut", { unique: false });

    //console.log("create index : components");
    objectStore.createIndex("components", "components", { unique: false });



    objectStore = db.createObjectStore('typeComponent', { autoIncrement: true });


    //console.log("create index : date");
    objectStore.createIndex("label", "label", { unique: false });

    //console.log("create index : collection");
    objectStore.createIndex("code", "code", { unique: false });
}
DBOpenRequest.onsuccess = function (event) {
    //db = event.target.result;
    //initTypeComponentList(db);
    //initCollectionList(db);

    //initTableCollection(db);
    //initTableTypeComponent(db);
}
DBOpenRequest.onerror = function (event) {
    alert('error opening database ' + event.target.errorCode);
}

function initQuotationList(db) {
    let transaction = db.transaction("quotation", "readwrite");

    let objectStore = transaction.objectStore("quotation");
    let request = objectStore.openCursor();

    request.onerror = function (event) {
        console.err("error fetching data");
    };

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        //if (cursor) {
        //let key = cursor.primaryKey;
        //let value = cursor.value;
        ////console.log(key, value);
        //if (value.company != "") {
        //addListCustomer(value.company, key);
        //} else {
        //addListCustomer(value.firstName + " " + value.name, key)
        //}
        //cursor.continue();
        //}
    };
}
function initComponentsList(db, idTr) {
    let transaction = db.transaction("components", "readwrite");

    let objectStore = transaction.objectStore("quotation");
    let request = objectStore.openCursor();

    request.onerror = function (event) {
        console.err("error fetching data");
    };

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        //if (cursor) {
        //let key = cursor.primaryKey;
        //let value = cursor.value;
        ////console.log(key, value);
        //if (value.company != "") {
        //addListCustomer(value.company, key);
        //} else {
        //addListCustomer(value.firstName + " " + value.name, key)
        //}
        //cursor.continue();
        //}
    };
}

function initTypeComponentList(db, idTr) {
    let transaction = db.transaction("typeComponent", "readwrite");

    let objectStore = transaction.objectStore("typeComponent");
    let request = objectStore.openCursor();

    request.onerror = function (event) {
        console.err("error fetching data");
    };

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let key = cursor.primaryKey;
            let value = cursor.value;
            //console.log(key, value);
            addOptionTypeComponent(value.label, key, idTr);
            cursor.continue();
        }
    };
}
function initCollectionList(db, idTr) {
    let transaction = db.transaction("collection", "readwrite");

    let objectStore = transaction.objectStore("collection");
    let request = objectStore.openCursor();

    request.onerror = function (event) {
        console.err("error fetching data");
    };

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let key = cursor.primaryKey;
            let value = cursor.value;
            //console.log(key, value);
            addOptionCollection(value.label, key, idTr);
            cursor.continue();
        }
    };

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
    let objectStore = transaction.objectStore("collection");
    // On ajoute l'objet newItem au magasin d'objets
    let objectStoreRequest;
    newItems.forEach(function (item) {
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


function addQuotation(db) {

    console.log(db);

    var newItem = [{
        name: document.getElementById("quotationName").value,
        reference: document.getElementById("quotationReference").value,
        date: document.getElementById("quotationDate").value,
        collection: document.getElementById("quotationCollection").value,
        fill: document.getElementById("quotationFillType").value,
        finishOut: document.getElementById("quotationFinishOut").value,
        finishIn: document.getElementById("quotationFinishIn").value,
        cut: document.getElementById("quotationCut").value
    }];

    console.log(newItem);

    let transaction = db.transaction("quotation", "readwrite");

    // On indique le succès de la transaction
    transaction.oncomplete = function (event) {
        console.log("Transaction terminée : modification finie");
    };

    transaction.onerror = function (event) {
        console.log("Transaction non-ouverte à cause d'une erreur.Les doublons ne sont pas autorisés");
    };

    // On crée un magasin d'objet pour la transaction
    let objectStore = transaction.objectStore("quotation");

    // On ajoute l'objet newItem au magasin d'objets
    let objectStoreRequest = objectStore.add(newItem[0]);

    objectStoreRequest.onsuccess = function (event) {
        // On indique le succès de l'ajout de l'objet
        // dans la base de données
        console.log("Un nouvel élément a été ajouté dans la base de données");
    };
    
}


//let DBOpenRequest = indexedDB.open("quotationDB");

//DBOpenRequest.onupgradeneeded = function (event) {
//// Set the db variable to our database so we can use it!
//db = event.target.result;

//// Create an object store named db. Object stores
//// in databases are where data are stored.
//let objectStore = db.createObjectStore('quotation', { autoIncrement: true });


////console.log("create index : date");
//objectStore.createIndex("date", "date", { unique: false });

////console.log("create index : collection");
//objectStore.createIndex("collection", "collection", { unique: false });

////console.log("create index : finishOut");
//objectStore.createIndex("address", "address", { unique: false });

////console.log("create index : finishIn");
//objectStore.createIndex("city", "city", { unique: false });

////console.log("create index : fill");
//objectStore.createIndex("fill", "fill", { unique: false });

////console.log("create index : cut");
//objectStore.createIndex("cut", "cut", { unique: false });

////console.log("create index : components");
//objectStore.createIndex("components", "components", { unique: false });

//}
//DBOpenRequest.onsuccess = function (event) {
//db = event.target.result;
//initQuotationList(db);
//}
//DBOpenRequest.onerror = function (event) {
//alert('error opening database ' + event.target.errorCode);
//}


//DBOpenRequest = indexedDB.open("typeComponentDB");

//DBOpenRequest.onupgradeneeded = function (event) {
//// Set the db variable to our database so we can use it!
//db = event.target.result;

//// Create an object store named db. Object stores
//// in databases are where data are stored.
//let objectStore = db.createObjectStore('typeComponent', { autoIncrement: true });


////console.log("create index : date");
//objectStore.createIndex("label", "label", { unique: false });

////console.log("create index : collection");
//objectStore.createIndex("code", "code", { unique: false });

//}
//DBOpenRequest.onsuccess = function (event) {
//db = event.target.result;
//initQuotationList(db);
//}
//DBOpenRequest.onerror = function (event) {
//alert('error opening database ' + event.target.errorCode);
//}


//DBOpenRequest = indexedDB.open("componentsDB");

//DBOpenRequest.onupgradeneeded = function (event) {
//// Set the db variable to our database so we can use it!
//db = event.target.result;

//// Create an object store named db. Object stores
//// in databases are where data are stored.
//let objectStore = db.createObjectStore('components', { autoIncrement: true });


////console.log("create index : refComposant");
//objectStore.createIndex("refComposant", "refComposant", { unique: false });

////console.log("create index : label");
//objectStore.createIndex("label", "label", { unique: false });

////console.log("create index : price");
//objectStore.createIndex("price", "price", { unique: false });

////console.log("create index : comment");
//objectStore.createIndex("comment", "comment", { unique: false });

////console.log("create index : typeComponent");
//objectStore.createIndex("typeComponent", "typeComponent", { unique: false });

////console.log("create index : component");
//objectStore.createIndex("component", "component", { unique: false });

//}
//DBOpenRequest.onsuccess = function (event) {
//db = event.target.result;
//initComponentList(db);
//}
//DBOpenRequest.onerror = function (event) {
//alert('error opening database ' + event.target.errorCode);
//}


//DBOpenRequest = indexedDB.open("collectionDB");

//DBOpenRequest.onupgradeneeded = function (event) {
//// Set the db variable to our database so we can use it!
//db = event.target.result;

//// Create an object store named db. Object stores
//// in databases are where data are stored.
//let objectStore = db.createObjectStore('collection', { autoIncrement: true });


////console.log("create index : label");
//objectStore.createIndex("label", "label", { unique: false });

////console.log("create index : collection");
//objectStore.createIndex("quality", "quality", { unique: false });

//}
//DBOpenRequest.onsuccess = function (event) {
//db = event.target.result;
//initCollectionList(db);
//}
//DBOpenRequest.onerror = function (event) {
//alert('error opening database ' + event.target.errorCode);
//}





