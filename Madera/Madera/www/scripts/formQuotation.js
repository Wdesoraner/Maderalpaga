//$(document).ready(function () {
//    $("#btnclic").click(function () {
//        $('.nav-tabs a[href="#step2"]').tab('show');
//    });

//});



//function activaTab(tab) {
//    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
//};



$('.next').click(function () {

    var nextId = $(this).parents('.tab-pane').next().attr("id");
    $('[href="#' + nextId + '"]').tab('show');

    return false;

})

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

    //update progress
    var step = $(e.target).data('step');
    var percent = (parseInt(step) / 5) * 100;

    $('.progress-bar').css({ width: percent + '%' });
    $('.progress-bar').text("Step " + step + " of 5");

    //e.relatedTarget // previous tab

})

$('.first').click(function () {

    $('#myWizard a:first').tab('show')

})