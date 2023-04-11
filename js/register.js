//Validacion de password y repet password, que sean iguales y que sea mayor a 8 caracteres y menor de 16
document.getElementById("repet").addEventListener("blur", event => verifyPassword("repet"));
document.getElementById("password").addEventListener("blur", event => verifyPassword("password"));
document.getElementById("register-btn").addEventListener("click", event => verifyPassword("register"));
document.getElementById("name").addEventListener("input", event => validateInput(event, "char"));
document.getElementById("lastname").addEventListener("input", event => validateInput(event, "char"));
document.getElementById("cedule").addEventListener("input", event => validateInput(event, "number"));
document.getElementById("phone").addEventListener("input", event => validateInput(event, "number"));
document.getElementById("username").addEventListener("input", event => {

    let username = event.target;

    if(username.value.length < 5){
        username.style.cssText = "";
        return;
    }

    fetch(`http://localhost:3000/api/user/username/${username.value}`)
    .then(response => response.json())
    .then(data => {
        username.style.cssText = (data.message == true) ? "border-color: red !important" : "border-color: green !important";
        //message("The username is already used. Please choose a different");
    })
    .catch(error => console.log("Conexion failed, try in some seconds"))
})

function verifyPassword(value){
    let password = document.getElementById("password");
    let repet = document.getElementById("repet");    

    if(password.value.length < 8 || password.value.length > 16 ){
        console.log(password.value + " is not a valid password");
        password.style.cssText = "border-color: red !important";
        //message("The password must be between 8 and 16 caracteres");
        validate = false;
    }else{
        password.style.cssText = "border-color: green !important";
    }

    if(repet.value != password.value && repet.value != ""){
        console.log("NO!");
        repet.style.cssText = "border-color: red !important";
        //message("The passwords are not equals");
        validate = false;
    }else if(repet.value == password.value && repet.value != ""){
        repet.style.cssText = "border-color: green !important";
    }

    if(!validate){
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

function showMessage(message){
    // Obtener el elemento cuya clase sea "message"
    const span = document.querySelector(".message");

    // Validar que el elemento <span> exista, de ser asi, se cambia solo el su texto y se retorna
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