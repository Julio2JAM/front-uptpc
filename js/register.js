//Validacion de password y repet password, que sean iguales y que sea mayor a 8 caracteres y menor de 16
document.getElementById("repet").addEventListener("input", event => verifyPassword("repet"));
document.getElementById("password").addEventListener("input", event => verifyPassword("password"));
document.getElementById("register-btn").addEventListener("click", event => verifyPassword("register"));
document.getElementById("name").addEventListener("input", event => validateInput(event, "char"));
document.getElementById("lastname").addEventListener("input", event => validateInput(event, "char"));
document.getElementById("cedule").addEventListener("input", event => validateInput(event, "number"));
document.getElementById("phone").addEventListener("input", event => validateInput(event, "number"));

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
const viewBtn = document.querySelectorAll(".view-btn");
for (const iterator of viewBtn) {
    iterator.addEventListener("click", function(){

        viewBtn.forEach(element => element.src = ((element.src == 'file:///home/julio/Documentos/front-se/source/ojo-no.png') ? 'source/ojo.png' : 'source/ojo-no.png'));

        let view = [
            document.getElementById("password"),
            document.getElementById("repet")
        ];

        view.forEach(element => element.type = ((element.type == "password") ? "text" : "password")); 

    });
};

function validateInput(event, type){
    let regex = type == "char" ? /^[a-zA-Z]+$/ : /^[0-9]+$/;
    let remplace = type == "char" ? /[^a-zA-Z]+$/ : /[^0-9]+$/;
    if (!regex.test(event.target.value)) {
        event.target.value = event.target.value.replace(remplace, ''); // Eliminar caracteres no permitidos
    }
}