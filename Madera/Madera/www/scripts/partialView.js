
$(document).ready(function () {
    document.getElementById("content").innerHTML = '<object style="width:100%;height:95vh;" type="text/html" data="homeSlideshow.html" ></object>'
    initElement();
});

function initElement() {
    var home = document.getElementById("home");
    home.onclick = function () { document.getElementById("content").innerHTML = '<object style="width:100%;height:95vh;" type="text/html" data="homeSlideshow.html" ></object>' };

    var client = document.getElementById("customer");
    client.onclick = function () { document.getElementById("content").innerHTML = '<object style="width:100%;height:95vh;" type="text/html" data="client.html" ></object>' };

    var createQuote = document.getElementById("createQuote");
    createQuote.onclick = function () { document.getElementById("content").innerHTML = '<object style="width:100%;height:95vh;" type="text/html" data="listQuotation.html" ></object>' };

    var projects = document.getElementById("projects");
    projects.onclick = function () { document.getElementById("content").innerHTML = '<object style="width:100%;height:95vh;" type="text/html" data="listProject.html" ></object>' };
    
};





