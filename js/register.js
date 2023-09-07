//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

if(document.cookie.indexOf("token") !== -1){
    location.href = "menu.html";
}

// Funcion que recive dos datos, el elemento a validar, y el tipo de dato que se le permite escribir
/*function validateInput(event, type){
    let regex = type == "char" ? /^[a-zA-Z]+$/ : /^[0-9]+$/; 
    let remplace = type == "char" ? /[^a-zA-Z]+$/ : /[^0-9]+$/;
    if (!regex.test(event.target.value)) {
        event.target.value = event.target.value.replace(remplace, ''); // Eliminar caracteres no permitidos
    }
}*/

// Obtener el elemento "username" para validar que no exista en la base de datos
document.getElementById("username").addEventListener("input", async (event) => {

    const username = event.target;

    if(username.value.length < 5){
        username.style.cssText = "";
        return;
    }

    await fetch(`${API_URL}/user/username/?username=${username.value}`)
    .then(response => response.json())
    .then(data => handleMessage(username, data.message ? "The username is already used. Please choose a different" : ""))
    .catch(error => console.log(error))
})

/*
// Obtener los elementos name y lastname para validar que uno de los dos no este vacio
document.getElementById("name").addEventListener("blur", event => doubleValidate(event, "lastname"));
document.getElementById("lastname").addEventListener("blur", event => doubleValidate(event, "name"));
*/

// Obtener el boton de registro y asignarle una funcion ecnargada de llamar a las validaciones necesarias y hacer el registro
document.getElementById("register-btn").addEventListener("click", async () => {

    if(!verifyPassword()){
        return;
    }
    
    const jsonData = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }
    
    await fetch(`${API_URL}/user/`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));

});

// Funcion para validar ciertos parametros de password y repet
function verifyPassword(){

    const password = document.getElementById("password");
    const repet = document.getElementById("repet");

    if(password.value == ""){
        handleMessage(password, "Password is required");
        return false;
    }
    // Si password tiene una longitud menor de 8 o mayor a 16 caracteres, muestra un mensaje de error
    if(password.value.length < 8 || password.value.length > 16){
        handleMessage(password, "The password must be between 8 and 16 caracteres");
        return false;
    }
    // Si repeat es diferente a password y repet no esta vacio, muestra un mensaje de error
    if(repet.value != password.value){
        handleMessage(repet, "The passwords are not equals");
        return false;
    }

    handleMessage(repet,"");
    handleMessage(password, "");
    return true;
}

// Funcion para cambiar los input de password a text y viceversa
const viewBtn = document.querySelectorAll(".view-btn");
for (const iterator of viewBtn) {
    iterator.addEventListener("click", () => {
        const viewButton = [
            document.getElementById("password"),
            document.getElementById("repet")
        ];
        viewButton.forEach(element => {element.type = element.type == "password" ? "text" : "password"});
        viewBtn.forEach(element => {element.src = viewButton[0].type == "password" ? "../source/ojo-no.png" : "../source/ojo.png"})
    });
};

function handleMessage(obj,message){
    // Obtener el elemento cuya clase sea "message"
    const span = document.querySelector(".message");

    // Validar si el mensaje esta vacio y el elemento existe, se elimina
    if(message == ""){
        span ? span.remove() : "" ;

        if(obj){
            obj.style.cssText = "border-color: green !important";;
        }

        return;
    }

    // Validar que el elemento <span> exista, de ser asi, se cambia solo el su texto y se retorna
    if(obj){
        obj.style.cssText = "border-color: red !important";
        obj.focus();
    }

    if(span){
        span.textContent = message;
        return;
    }


    // Obtener el div y el hr, getElementsByClassName devuelve un arreglo, por eso se accede a la pos 0
    //const div = document.getElementsByClassName("container")[0];
    const div = document.querySelector('.container');
    const hr = document.querySelector('hr')

    // Crear el elemento a agregar
    const newElement = document.createElement('span');
    newElement.textContent = message;
    newElement.classList.add('message');

    // Agregar el nuevo elemento después del hr
    div.insertBefore(newElement, hr.nextSibling);
}