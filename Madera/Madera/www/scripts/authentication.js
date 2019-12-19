

$(document).ready(function () {
    document.getElementById("connexion").onclick = connexion;
});


function connexion() {
    
    if (checkRequiredInput()) {
        let login = document.getElementById("login").value
        let mdp = document.getElementById("password").value  
        console.log(sha256(mdp));
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