$(document).ready(function () {
    $("#btnclic").click(function () {
        $('.nav-tabs a[href="#step2"]').tab('show');
    });
    
});



function activaTab(tab) {
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};