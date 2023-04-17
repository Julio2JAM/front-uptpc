// ! EN DESARROLLO
document.getElementById("register-btn").addEventListener("click", () => {
    //const div = document.getElementById("general-information");
    //const input = div.querySelectorAll("input");
    let name = document.getElementById("name");
    let lastname = document.getElementById("lastname");
    let cedule = document.getElementById("cedule");

    if(name.value == "" && lastname == ""){
        handleMessage("Please enter a name or lastname in the form.");
        name.style.cssText = "border-color: red !important";
        lastname.style.cssText = "border-color: red !important";
        return;
    }else if(name.value != "" && lastname != ""){
        handleMessage("");
    }

    fetch(`http://localhost:3000/api/student/cedule/${cedule.value}`)
    .then(response => response.json())
    .then(data)
    .catch(error => console.log("Conexion failed, try in some seconds"));

    const inputs = document.querySelectorAll('#general-information input');

    const values = {};
    inputs.forEach(element => {

        if(element.value == ""){
            let element = document.getElementById(key);
            element.style.cssText = "border-color: red !important";
            element.focus();
            return;
        }
        values[element.id] = element.value;
        
    })

});

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

        if(data.message == true){
            username.style.cssText = "border-color: red !important";
            handleMessage("The username is already used. Please choose a different");
        }else{
            username.style.cssText = "border-color: green !important";
            handleMessage("");
        }
        
    })
    .catch(error => console.log("Conexion failed, try in some seconds"))
})

function verifyPassword(value){
    let password = document.getElementById("password");
    let repet = document.getElementById("repet");
    let validate = false;

    if(password.value.length < 8 || password.value.length > 16 ){
        password.style.cssText = "border-color: red !important";
        handleMessage("The password must be between 8 and 16 caracteres");
    }else{
        handleMessage("");
        validate = true;
        password.style.cssText = "border-color: green !important";
    }

    if(repet.value != password.value && repet.value != ""){
        repet.style.cssText = "border-color: red !important";
        handleMessage("The passwords are not equals");
    }else if(repet.value == password.value && repet.value != ""){
        handleMessage("");
        validate = true;
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

function handleMessage(message){
    // Obtener el elemento cuya clase sea "message"
    const span = document.querySelector(".message");

    // Validar si el mensaje esta vacio y el elemento existe, se elimina
    if(message == "" && span){
        span.remove();

    // Validar si el mensaje esta vacio y el elemento no existe, retorna
    }else if(message == "" && !span){
        return;
    }

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
