//Validacion de password y repet password, que sean iguales y que sea mayor a 8 caracteres y menor de 16
document.getElementById("repet").addEventListener("input", event => verifyPassword("repet"));
document.getElementById("password").addEventListener("input", event => verifyPassword("password"));
document.getElementById("register-btn").addEventListener("click", event => verifyPassword("register"));

function verifyPassword(value){
    let password = document.getElementById("password");
    let repet = document.getElementById("repet");    

    if((value == "password" || value == "register") && (password.value).length < 8 || (password.value).length > 16 ){
        console.log(password.value + " is not a valid password");
        return;
    }

    if(value == "repet" || value == "register" && repet.value != password.value){
        console.log("NO!");
        return;
    }

    if(value == "register"){
        console.log("REGISTER");
    }
}

//Funcion para cambiar los input de password a text y viceversa
document.getElementById("view").addEventListener("click", function(){
    let view = [
        document.getElementById("password"),
        document.getElementById("repet")
    ];

    view.forEach(element => element.type = (element.type == "password") ? "text" : "password");
});