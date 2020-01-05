

$(document).ready(function () {
    document.getElementById("connexion").onclick = connexion;
    document.getElementById("saveChange").onclick = changePassword;
});

function changePassword() {

    if (checkRequiredInput()) {
        let loginModal = document.getElementById("loginModal").value
        let newPwd = document.getElementById("newPassword").value
        let confirmPwd = document.getElementById("confirmPassword").value
        console.log(sha256(newPwd));
        console.log(sha256(confirmPwd));
        passReset(loginModal, newPwd, confirmPwd);
    }
}

function passReset(loginModal, newPwd, confirmPwd) {
    var request = indexedDB.open("maderaDB");
    request.onsuccess = function (e) {
        let db = e.target.result;
        let transaction = db.transaction("user", "readwrite");
        let objectStore = transaction.objectStore("user");
        let getCursor = objectStore.openCursor();
        getCursor.onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                if (cursor.value.mail === loginModal && sha256(newPwd) === sha256(confirmPwd)){

                    const updateData = cursor.value;

                    updateData.password = sha256(confirmPwd);
                    const request = cursor.update(updateData);
                    request.onsuccess = function () {
                        console.log('Mot de passe changé avec succès !');
                        
                    };
                    alert("Mot de passe changé !");
                    
                } else {
                    cursor.continue();
                }
            } else {
                alert("Identifiants incorrects");
            }
        }
    }
}

function connexion() {

    if (checkRequiredInput()) {
        let login = document.getElementById("login").value
        let pwd = document.getElementById("password").value
        console.log(sha256(pwd));
        checkUser(login, pwd);
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

function checkUser(login, pwd) {
    var request = indexedDB.open("maderaDB");
    request.onsuccess = function (e) {
        let db = e.target.result;
        let transaction = db.transaction("user", "readonly");
        let objectStore = transaction.objectStore("user");
        let getCursor = objectStore.openCursor();
        getCursor.onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                if (cursor.value.mail == login && cursor.value.password == sha256(pwd)) {
                    sessionStorage.setItem('connexion', 1);
                    sessionStorage.setItem('idCommercial', cursor.key)
                    console.log(sessionStorage.getItem('connexion'));
                    window.location.href = "partialView.html"
                } else {
                    cursor.continue();
                }
            } else {
                alert("Identifiants incorrects");
            }
        }
    }
}