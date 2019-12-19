window.onload = function (event) {
    event.stopPropagation(true);
    if (!sessionStorage.getItem('connexion')) {
        window.location.href = "authentication.html";
    }
 };


$(document).ready(function () {
    initElement();
    document.getElementById("content").innerHTML = '<object style="width:100%;height:95vh;" type="text/html" data="homeSlideshow.html" ></object>';
    document.getElementById("title").innerHTML = '<span style="float:left;margin-top:10px" class="fa fa-home"></span> Accueil';
});

function initElement() {
    var home = document.getElementById("home");
    home.onclick = function () {
        document.getElementById("content").innerHTML = '<object style="width:100%;height:95vh;" type="text/html" data="homeSlideshow.html" ></object>';
        document.getElementById("title").innerHTML = '<span style="float:left;margin-top:10px" class="fa fa-home"></span> Accueil';
    };

    var client = document.getElementById("customer");
    client.onclick = function () {
        document.getElementById("content").innerHTML = '<object style="width:100%;height:95vh;" type="text/html" data="client.html" ></object>';
        document.getElementById("title").innerHTML = '<span style="float:left;margin-top:10px" class="fa fa-user"></span> Clients';
    };

    var projects = document.getElementById("projects");
    projects.onclick = function () {
        document.getElementById("content").innerHTML = '<object style="width:100%;height:95vh;" type="text/html" data="listProject.html" ></object>';
        document.getElementById("title").innerHTML = '<span style="float:left;margin-top:10px" class="fa fa-flag"></span> Projets';

    };

    var deco = document.getElementById("deconnect");
    deco.onclick = function () {
        sessionStorage.removeItem('connexion');
        document.location.href = "authentication.html";
    }

};

$('li').on('click', function () {
    $('li').removeClass();
    $(this).addClass('permaLink');
});

$('a').on('click', function () {
    $('a').removeClass();
    $(this).addClass('permaLinkSubmenu');
});





