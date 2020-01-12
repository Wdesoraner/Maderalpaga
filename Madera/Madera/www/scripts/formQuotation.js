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

        newRowModule = getRowModule(idTr, id)

        let tr = document.createElement("tr");
        tr.innerHTML = newRowModule;
        tr.classList.add('item-collection');
        //tr.style.add('background-color:lightgray');
        tr.style.backgroundColor = "lightgray";
        tr.id = idTr;

        var element = document.getElementById(id);
        element.closest("tr").after(tr);

        let DBOpenRequest = indexedDB.open("maderaDB");
        DBOpenRequest.onsuccess = function (event) {
            db = event.target.result;
            initModuleList(db, idTr);
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

    initCollectionListQuotation();

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
        generatePDF();
        if (!sessionStorage.getItem("quotation")) {
            // addQuotation(db);
        }
    })

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        //update progress
        var step = $(e.target).data('step');
        var percent = (parseInt(step) / 4) * 100;

        $('.progress-bar').css({ width: percent + '%' });
        $('.progress-bar').text("Étape " + step + " sur 4");


    })

    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        var className = $('#step3').attr('class');
        if (className.includes('active')) {
            resetQuotation();

            let listModules = getModulesList();
            console.log("listModules : ", listModules);
            console.clear();
            completeQuotation(listModules);
        }
    })

    if (sessionStorage.getItem("quotation")) {
        document.getElementById("idQuotation").value = sessionStorage.getItem("quotation");
        //document.getElementById("btnSaveQuotation").onclick = updateQuotation;
        initExistingQuotation();
    }

    $("#quotationCollection").on("change", function () {
        var id = $("#quotationCollection option:selected").attr("id");
        //alert(typeof(id));
        $("#quotationFillType").val(id);
        $("#quotationFinishOut").val(id);
        $("#quotationFinishIn").val(id);

    })

});

function initCollectionListQuotation() {
    let DBOpenRequest = indexedDB.open("maderaDB");
    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;

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
                addOptionCollectionQuotation(value.label, key);
                cursor.continue();
            }
        };
    }
}

function addOptionCollectionQuotation(collectionLabel, idCollection) {
    let list = document.getElementById("quotationCollection");
    let opt = document.createElement("option");
    opt.id = idCollection;
    opt.appendChild(document.createTextNode(collectionLabel));
    opt.onclick = function () { clickListItem(idCollection) };
    list.appendChild(opt);
}

function getRowModule(idTr, idParent = 0) {
    return '<tr id="' + idTr + '" class="item-collection"><td style="display:none"><input type="text" id="parentModule' + idTr + '" value="' + idParent + '"></td><td><select class="w-100 h-100 border border-0" id="selectModule' + idTr + '" onchange="onChangeModule(' + idTr + ')"></select></td><td><select disabled class="w-100 h-100 border border-0" id="selectCollection' + idTr + '"></select></td > <td><input type="text" id="labelModule' + idTr + '" class="w-100 h-100 border border-0" /></td><td> <div class="row"><div class="col-6"> L : <input type="number" id="lengthModule' + idTr + '" class="w-50 h-100 border border-0" />m </div><div class="col-6"> H : <input type="number" id="heightModule' + idTr + '" class="w-50 h-100 border border-0" />m </div></div></td><td><select id="selectAngle' + idTr + '" class="w-100 h-100 border border-0"><option></option><option value=true>Oui</option><option value=false>Non</option></select></td><td><input type="number" id="quantityModule' + idTr + '" class="h-100 border border-0" value="1"/></td><td><button class="btn btn-success rounded rounded-circle add-child-item"  style="width:40px; height:40px; margin-bottom:5px; color:white" id="btnAdd' + idTr + '""><div class="font-weight-bold">+</div></button><button class="btn btn-danger rounded rounded-circle del-item-collection"  style="width:40px; height:40px; margin-bottom:5px; color:white; margin-left: 5px" id="btnDel' + idTr + '><div class="font-weight-bold">-</div></button></td></tr>'
    // onclick="addChild(' + idTr + ')
    //"onclick="delItem(' + idTr + ')"
}

function onChangeModule(idTr) {
    var id = $("#selectModule" + idTr + " option:selected").attr("id");
    console.log($("#lengthModule" + idTr));
    $("#labelModule" + idTr).val('');
    $("#lengthModule" + idTr).val('');
    $("#heightModule" + idTr).val('');
    document.getElementById("selectAngle" + idTr).value = "";
    $("#quantityModule" + idTr).val('1');

    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");
    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        let transaction = db.transaction("modules", "readonly");
        let objectStore = transaction.objectStore("modules");
        let request = objectStore.get(parseInt(id));

        request.onerror = function (event) {
            console.err("error fetching data");
        };

        request.onsuccess = function (event) {
            var result = event.target.result;
            console.log(result.idCollection);
            let idCollection = result.idCollection;
            //return result.idCollection;

            document.getElementById("selectCollection" + idTr).options.namedItem(idCollection).selected = true;
        }
    }
}

function duplicateItem() {
    document.getElementById("hiddenId").value++;

    let idTr = document.getElementById("hiddenId").value;

    newRowModule = getRowModule(idTr)

    let tr = document.createElement("tr");

    tr.innerHTML = newRowModule;

    tr.classList.add('item-collection');
    tr.id = idTr;
    document.getElementById("table-collection").appendChild(tr);

    let DBOpenRequest = indexedDB.open("maderaDB");
    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        initModuleList(db, idTr);
        initCollectionList(db, idTr);

    }
    listen.clickListener($(tr));


}

function resetQuotation() {
    document.getElementById('refQuotationToInsert').innerHTML = "";
    document.getElementById('dateQuotationToInsert').innerHTML = "";
    document.getElementById('customerNameToInsert').innerHTML = "";
    document.getElementById('customerAddressToInsert').innerHTML = "";
    document.getElementById('customerPostalToInsert').innerHTML = "";
    $(".item-quotation").remove();


}

function completeQuotation(listModules) {

    var formText = document.createTextNode(document.getElementById("quotationReference").value);
    var quotationDiv = document.getElementById("refQuotationToInsert");
    quotationDiv.appendChild(formText);

    var date = new Date(document.getElementById("quotationDate").value);
    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };

    var dateTemp = date.toLocaleDateString('fr-FR', options)

    formText = document.createTextNode(dateTemp);
    quotationDiv = document.getElementById("dateQuotationToInsert");
    quotationDiv.appendChild(formText);


    let DBOpenRequest = window.indexedDB.open("maderaDB");
    DBOpenRequest.onsuccess = function (event) {
        let project = sessionStorage.getItem("project");

        let db = event.target.result;
        let transaction = db.transaction("project", "readonly");
        let objectStore = transaction.objectStore("project");
        let request = objectStore.get(parseInt(project));

        request.onerror = function (event) {
            console.err("error fetching data");
        };

        request.onsuccess = function (event) {
            var result = event.target.result;
            console.log(result);

            let transaction2 = db.transaction("customer", "readonly");
            let objectStore2 = transaction2.objectStore("customer");
            let request = objectStore2.get(parseInt(result.customer));

            request.onsuccess = function (event) {
                var result2 = event.target.result;


                var tempText = result2.name + ' ' + result2.firstName;
                if (result2.company != '') {
                    tempText += ' (' + result2.company + ')';
                }

                formText = document.createTextNode(tempText);
                quotationDiv = document.getElementById("customerNameToInsert");
                quotationDiv.appendChild(formText);

                formText = document.createTextNode(result2.address);
                quotationDiv = document.getElementById("customerAddressToInsert");
                quotationDiv.appendChild(formText);

                var tempText = result2.zipCode + ' ' + result2.city;

                formText = document.createTextNode(tempText);
                quotationDiv = document.getElementById("customerPostalToInsert");
                quotationDiv.appendChild(formText);
            }
            db.close();
        }
    }

    //DBOpenRequest = window.indexedDB.open("maderaDB");
    //DBOpenRequest.onsuccess = function (event) {

    //    let db = event.target.result;
    //    let transaction = db.transaction("modules", "readonly");
    //    let objectStore = transaction.objectStore("modules");

    //    let searchedLabel = "Ensemble finition " + $("#quotationCollection option:selected").text();

    //    console.log("searchedLabel : ", searchedLabel);

    //    var myIndex = objectStore.index('label');
    //    var request = myIndex.getKey(searchedLabel);

    //    console.log("request : ", request);

    //    request.onerror = function (event) {
    //        console.err("error fetching data");
    //    };

    //    request.onsuccess = function (event) {
    //        var result = event.target.result;

    //        let totalHeight = 0;
    //        let totalLength = 0;

    //        listModules.forEach(function (module) {
    //            var elt = document.getElementById("selectModule");

    //            let label = elt.options[module.moduleModel].text;

    //            console.log("label select : ", label);


    //            if (true) {

    //            }
    //        })

    //        let newModule = {
    //            moduleParent: 0,
    //            moduleId: listModules.length + 1,
    //            moduleModel: result,
    //            moduleCollection: parseInt($("#quotationCollection" + id + " option:selected").attr("id")),
    //            moduleLabel: searchedLabel,
    //            moduleLength: 0,
    //            moduleHeight: 0,
    //            moduleAngle: false,
    //        };

    //        listModules.push(newModule);

    //        db.close();
    //    }
    //}

    let tableToComplete = $("#quotationModules");
    let i = 1;

    tableModuleComponent(listModules);
}

function getModulesList() {
    let itemsHTML = document.getElementsByClassName("item-collection");

    let listItems = []

    for (let item of itemsHTML) {
        let id = item.id;

        let quantity = $("#quantityModule" + id).val();

        for (let i = 0; i < quantity; i++) {
            let stringParent = $("#parentModule" + id).val();
            let newModule = {
                moduleParent: parseInt(stringParent.replace("btnAdd", "")),
                moduleId: parseInt(id),
                moduleModel: parseInt($("#selectModule" + id + " option:selected").attr("id")),
                moduleCollection: parseInt($("#selectCollection" + id + " option:selected").attr("id")),
                moduleLabel: $("#labelModule" + id).val(),
                moduleLength: $("#lengthModule" + id).val(),
                moduleHeight: $("#heightModule" + id).val(),
                moduleAngle: $("#selectAngle" + id + " option:selected").attr("id")
            };

            listItems.push(newModule);
        }
    }
    //console.log(listItems);
    return listItems;
}

function tableModuleComponent(listModules) {
    DBOpenRequest = window.indexedDB.open("maderaDB");
    DBOpenRequest.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction("components", "readonly");
        let objectStore = transaction.objectStore("components");

        let structureTree = '{"1":{';
        let dataTree = '"1": { "trad": "Base" },';

        var request = objectStore.getAll();
        request.onsuccess = function (event) {
            let listComponent = event.target.result;
            writeRow(listModules, 0, 1, listComponent, structureTree, dataTree);
        }
    }
}

function writeRow(tabModule, index, id, listComponent, structureTree, dataTree) {
    if (tabModule.length > index) {
        console.log("tabModule.length : ", tabModule.length);
        console.log("index:", index);
        let item = tabModule[index];
        DBOpenRequest = window.indexedDB.open("maderaDB");
        DBOpenRequest.onsuccess = function (event) {
            let searchId = id;

            let db = event.target.result;
            let transaction = db.transaction("moduleComponents", "readonly");
            let objectStore = transaction.objectStore("moduleComponents");

            var myIndex = objectStore.index('idModule');
            var getRequest = myIndex.getAll(item.moduleModel);

            getRequest.onsuccess = function (event) {
                let result = event.target.result;

                let tr = document.createElement("tr");
                tr = document.createElement("tr");
                tr.innerHTML = getRowModuleQuotation(id, 1, item.moduleLabel, 0, 0);

                tr.classList.add('item-quotation');
                tr.id = id++;
                document.getElementById("quotationModulesBody").appendChild(tr);
                if (result.length > 0) {
                    structureTree +='"'+ id + '":{';
                } else {
                    structureTree +='"'+ id + '":" "';
                }
                dataTree +='"'+ id + '":{"trad":"' + item.moduleLabel + '"},';

                console.log("listComponent : ", listComponent);
                let components = [];

                result.forEach(function (component, i) {
                    let compo = listComponent.find(cour => cour.idComponent == component.idComponent);
                    console.log("compo : ", compo);
                    let quantity = component.quantity;

                    if (quantity == 0) {
                        quantity = item.moduleLength * item.moduleHeight;
                    }
                    let name = compo.label + " (" + compo.refComposant + ")"
                    let aComponent = {
                        quantity: quantity,
                        name: name,
                        unitPrice: compo.price
                    };


                    components.push(aComponent);

                    console.log("id:", id);
                    let tr = document.createElement("tr");
                    tr = document.createElement("tr");
                    tr.innerHTML = getRowModuleQuotation(id, aComponent.quantity, aComponent.name, aComponent.unitPrice, aComponent.unitPrice * aComponent.quantity);

                    tr.classList.add('item-quotation');
                    tr.id = id++;
                    document.getElementById("quotationModulesBody").appendChild(tr);

                    if (i != result.length - 1) {
                        structureTree +='"'+ id + '":"",';
                        dataTree +='"'+ id + '":{"trad":"' + aComponent.name + '"},';
                    } else {
                        if (index == tabModule.length - 1) {
                            structureTree += '"' + id + '":""}}}';
                            dataTree += '"' + id + '":{"trad":"' + aComponent.name + '"}';
                        } else {
                            structureTree += '"' + id + '":""},';
                            dataTree += '"' + id + '":{"trad":"' + aComponent.name + '"},';
                        }
                    }
                    

                });
                calculatePriceModule(searchId, components)
                writeRow(tabModule, index + 1, id, listComponent, structureTree, dataTree);
            }
        }
    }
    calculatePriceTotal();
    console.log("tabStruc:", structureTree);
    console.log("tabData:", dataTree);
    sessionStorage.setItem('structureTree', structureTree);
    sessionStorage.setItem('dataTree', dataTree);
}

function calculatePriceModule(searchId, components) {
    console.log("searchId : ", searchId);
    console.log("components : ", components);

    let total = 0;
    components.forEach(function (compo) {
        total += compo.quantity * compo.unitPrice;
    });
    console.log("total : ", total);

    document.getElementById("unitPrice" + searchId).innerHTML = "";
    document.getElementById("totalPrice" + searchId).innerHTML = total.toFixed(2) + "€";

}

function calculatePriceTotal() {
    let itemsHTML = document.getElementsByClassName("item-quotation");

    console.log("itemsHTML : ", itemsHTML);


    let i = 1;
    let total = 0;

    for (let item of itemsHTML) {
        if ($("#unitPrice" + i).text() == "") {
            total += parseFloat($("#totalPrice" + i).text())
        }
        i++;

    }

    let tva = total * 0.2;

    $("#totalHT").text(total.toFixed(2) + "€");
    $("#tva20").text(tva.toFixed(2) + "€");
    $("#totalTTC").text((total + tva).toFixed(2) + "€");
}

function getRowModuleQuotation(id, quantity = 1, name, unitPrice = 0, totalPrice = 0) {
    tr = '<tr><td id="quantity' + id + '">' + quantity + '</td><td id="label' + id + '">' + name + '</td><td id="unitPrice' + id + '">' + unitPrice.toFixed(2) + ' €</td><td id="totalPrice' + id + '">' + totalPrice.toFixed(2) + ' €</td></tr>';
    //console.log(tr);
    return tr;
}

function generatePDF() {
    var HTML_Width = $("#previewQuotation").width();
    var HTML_Height = $("#previewQuotation").height();

    var top_left_margin = 50;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($("#previewQuotation")[0], { allowTaint: true, useCORS: true }).then(function (canvas) {
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


/*-------------------------------------------------DB--------------------------------------------------------------*/

let db;
let DBOpenRequest = indexedDB.open("maderaDB");

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


function initModuleList(db, idTr) {
    let transaction = db.transaction("modules", "readwrite");

    let objectStore = transaction.objectStore("modules");
    let request = objectStore.openCursor();

    request.onerror = function (event) {
        console.err("error fetching data");
    };

    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let key = cursor.primaryKey;
            let value = cursor.value;
            if (value.isModel) {
                addOptionTypeModule(value.label, key, idTr);
            }
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

function addQuotation(db) {

    var newItem = [{
        idProject: sessionStorage.getItem("idProject"),
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

function initExistingQuotation() {
    var idQuotation = parseInt(sessionStorage.getItem("quotation"));
    let db;
    let DBOpenRequest = window.indexedDB.open("maderaDB");

    DBOpenRequest.onsuccess = function (event) {
        db = event.target.result;
        let transaction = db.transaction("quotation", "readonly");
        let objectStore = transaction.objectStore("quotation");
        let request = objectStore.get(idQuotation);
        console.log(idQuotation);
        request.onerror = function (event) {
            console.err("error fetching data");
        };

        request.onsuccess = function (event) {
            var result = event.target.result;
            document.getElementById("quotationName").value = "Devis n°" + idQuotation;
            document.getElementById("quotationReference").value = result.reference;
            document.getElementById("quotationDate").value = result.date;

            //document.getElementById("quotationFillType").value = result.fill;
            //document.getElementById("quotationFinishOut").value = result.finishOut;
            //document.getElementById("quotationFinishIn").value = result.finishIn;
            //document.getElementById("quotationCut").value = result.cut;

            //optionSelected();
            //initCommercial();
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

function updateQuotation() {
    if (checkRequiredInput()) {
        let db;
        let DBOpenRequest = window.indexedDB.open("maderaDB");
        var id = parseInt(document.getElementById("idQuotation").value, 10);

        DBOpenRequest.onsuccess = function (event) {
            db = event.target.result;

            var transaction = db.transaction("quotation", "readwrite");

            // On indique le succès de la transaction
            transaction.oncomplete = function (event) {
                console.log("Transaction terminée : lecture finie");
            };

            transaction.onerror = function (event) {
                console.log("Transaction non-ouverte à cause d'une erreur");
            };

            // On crée un magasin d'objet pour la transaction
            var objectStore = transaction.objectStore("quotation");

            // On ajoute l'objet newItem au magasin d'objets
            var objectStoreRequest = objectStore.get(id);
            objectStoreRequest.onsuccess = function (event) {
                // On indique le succès de l'ajout de l'objet
                // dans la base de données
                var data = objectStoreRequest.result;
                data.idProject = sessionStorage.getItem("idProject");
                data.name = document.getElementById("quotationName").value;
                data.reference = document.getElementById("quotationReference").value;
                //data.commercial = document.getElementById("quotationCommercial").value;
                data.date = document.getElementById("quotationDate").value;
                data.collection = document.getElementById("quotationCollection").value;
                data.cut = document.getElementById("quotationCut").value;
                data.fill = document.getElementById("quotationFillType").value;
                data.finishIn = document.getElementById("quotationFinishIn").value;
                data.finishOut = document.getElementById("quotationFinishOut").value;

                var requestUpdate = objectStore.put(data);
                requestUpdate.onerror = function (event) {
                    // Faire quelque chose avec l’erreur
                };
                requestUpdate.onsuccess = function (event) {
                    // Succès - la donnée est mise à jour !
                    objectStore.delete(id);
                    alert("Devis mis à jour !");
                };
            };

        }
    }

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

function addOptionTypeModule(typeModuleLabel, idTypeModule, idTr) {
    let list = document.getElementById("selectModule" + idTr);
    let opt = document.createElement("option");
    opt.id = idTypeModule;
    opt.appendChild(document.createTextNode(typeModuleLabel));
    opt.onclick = function () { clickListItem(idTypeModule) };
    list.appendChild(opt);
}
