
$(document).ready(function () {
    initDB();
    initElement();
});

function initElement() {
    var p = document.getElementById("home");
    p.onclick = showAlert;

    //const el = $('#content');
    //const test = Handlebars.compile($('#contenu').html());
    //const html = test();
    //el.html(html);
};

function showAlert() {
    $('#content').load("authentication.html");
}



