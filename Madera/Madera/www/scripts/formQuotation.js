$(document).ready(function () {
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
    })

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        //update progress
        var step = $(e.target).data('step');
        var percent = (parseInt(step) / 4) * 100;

        $('.progress-bar').css({ width: percent + '%' });
        $('.progress-bar').text("Étape " + step + " sur 4");

    })


    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        var className = $('#step4').attr('class');
        if (className.includes('active')) {
            resetQuotation();
            completeQuotation();
        }
    })


    $('#step4').on('focusin', function (e) {
        console.log('test');
    });
});

function duplicateItem() {
    var el = document.querySelector(".item-collection");

    const tr = document.createElement("tr");
    tr.innerHTML = '<tr class="item-collection"><td><select class="w-100 h-100 border border-0"><option>Mur Droit</option ><option>Mur Angle</option></select></td ><td><input type="text" class="w-100 h-100 border border-0" /></td><td class="text-right"><input type="number" class="w-75 h-100 border border-0" />m</td><td><select class="w-100 h-100 border border-0"><option></option><option>Entrant</option><option>Sortant</option></select></td></tr >';

    document.getElementById("table-collection").appendChild(tr);

};

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


    var tempText = document.getElementById("customerName").value + ' ' + document.getElementById("customerFirstName").value;
    if (document.getElementById("customerCompany").value != '') {
        tempText += ' (' + document.getElementById("customerCompany").value + ')';
    }

    formText = document.createTextNode(tempText);
    quotationDiv = document.getElementById("customerNameToInsert");
    quotationDiv.appendChild(formText);

    formText = document.createTextNode(document.getElementById("customerAddress").value);
    quotationDiv = document.getElementById("customerAddressToInsert");
    quotationDiv.appendChild(formText);

    var tempText = document.getElementById("customerPostal").value + ' ' + document.getElementById("customerCity").value;

    formText = document.createTextNode(tempText);
    quotationDiv = document.getElementById("customerPostalToInsert");
    quotationDiv.appendChild(formText);


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

        console.log(canvas.height + "  " + canvas.width);


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
