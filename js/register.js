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
        let username = document.getElementById("username");

        fetch("http://localhost:3000/api/user",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username: username.value, password: password.value})
        })
        .then(response => console.log(response.json()))
        .catch(error => console.log(error));

        console.log("REGISTER");
    }
}

//Funcion para cambiar los input de password a text y viceversa
document.getElementById("view-btn").addEventListener("click", function(){
    let view = [
        document.getElementById("password"),
        document.getElementById("repet")
    ];

    view.forEach(element => element.type = (element.type == "password") ? "text" : "password");
});

document.getElementById("login-btn").addEventListener("click", () => {
    location.href = "index.html"
});