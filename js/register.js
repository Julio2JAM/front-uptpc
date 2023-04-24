const inputs = document.querySelectorAll('#general-information input');
for(const element of inputs){
    if(element.id == "name" || element.id == "lastname"){
        continue;
    }

    element.addEventListener('blur', () => {
        element.value == "" ? null : element.style.cssText = "";
    })
}

// Obtener los elementos name y lastname para validar que uno de los dos no este vacio
document.getElementById("name").addEventListener("blur", event => doubleValidate(event, "lastname"));
document.getElementById("lastname").addEventListener("blur", event => doubleValidate(event, "name"));

// Funcion para validar 2 elementos eviados y que uno de los 2 no este vacio
function doubleValidate(principal, secundary){
    principal = principal.target;
    secundary = document.getElementById(secundary);
    
    if(principal.value != "" || secundary.value != ""){
        principal.style.cssText = "";
        secundary.style.cssText = "";
    }
}


async function dataPerson(){
    //const div = document.getElementById("general-information");
    //const input = div.querySelectorAll("input");
    let name = document.getElementById("name");
    let lastname = document.getElementById("lastname");
    let cedule = document.getElementById("cedule");

    if(name.value == "" && lastname.value == ""){
        handleValidationErrors(name,"Please enter a name or lastname in the form.")
        lastname.style.cssText = "border-color: red !important";
        return false;
    }else{
        name.style.cssText = "border-color: green !important";
        lastname.style.cssText = "border-color: green !important";
        handleMessage("");
    }

    if(cedule.value.length < 5){
        handleValidationErrors(cedule,"Please enter a valid cedule.")
        return false;
    }

    await fetch(`http://localhost:3000/api/student/cedule/${cedule.value}`)//${cedule.value}
    .then(response => response.json())
    .then(data => {

        if(data.message){
            handleValidationErrors(cedule,"Please enter a valid cedule.")
            console.log("1");
            return false;
        }else{
            console.log("1");
            handleMessage("");
            cedule.style.cssText = "border-color: green !important";
        }

    })
    .catch(error => console.log("Conexion failed, try in some seconds"));

    console.log("2");
    
    const inputs = document.querySelectorAll('#general-information input');
    const data = {};
    for (const element of inputs) {
        
        if(element.id == name.id || element.id == lastname.id){
            data[element.id] = element.value;
        }
        
        if(element.value == ""){
            element.style.cssText = "border-color: red !important";
            element.focus();
            return false;
        }else{
            handleMessage("");
            element.style.cssText = "border-color: green !important";
        }
    
        data[element.id] = element.value;
    }
    return data;

};

// Obtener los elementos password y repet para validarlos
document.getElementById("repet").addEventListener("blur", event => verifyPassword());
document.getElementById("password").addEventListener("blur", event => verifyPassword());

// Funcion para validar ciertos parametros de password y repet
function verifyPassword(){

    let password = document.getElementById("password");
    let repet = document.getElementById("repet");

    if(password.value == ""){
        handleMessage("");
        password.style.cssText = "";
        return false;
    }

    // Si password tiene una longitud menor de 8 o mayor a 16 caracteres, muestra un mensaje de error
    if(password.value.length < 8 || password.value.length > 16 ){
        handleValidationErrors(password, "The password must be between 8 and 16 caracteres");
        return false;
    }else{
        handleMessage("");
        password.style.cssText = "border-color: green !important";
    }

    if(repet.value == ""){
        handleMessage("");
        repet.style.cssText = "";
        return false;
    }

    // Si repeat es diferente a password y repet no esta vacio, muestra un mensaje de error
    if(repet.value != password.value){
        handleValidationErrors(repet, "The passwords are not equals");
        return false;
    }else{
        handleMessage("");
        repet.style.cssText = "border-color: green !important";
    }

    return true;
}


document.getElementById("register-btn").addEventListener("click", async () => {

    let passwordIsValid = verifyPassword();
    let person = await dataPerson();
    
    if(!passwordIsValid || person){
        return;
    }
    
    let user = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }
    
    fetch("http://localhost:3000/api/user/register",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({user: user, person: person})
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));

});



// Obtener elementos del formulario para validar el tipo de dato que se le permite escribir
document.getElementById("name").addEventListener("input", event => validateInput(event, "char"));
document.getElementById("lastname").addEventListener("input", event => validateInput(event, "char"));
document.getElementById("cedule").addEventListener("input", event => validateInput(event, "number"));
document.getElementById("phone").addEventListener("input", event => validateInput(event, "number"));

// Funcion que recive dos datos, el elemento a validar, y el tipo de dato que se le permite escribir
function validateInput(event, type){
    let regex = type == "char" ? /^[a-zA-Z]+$/ : /^[0-9]+$/; 
    let remplace = type == "char" ? /[^a-zA-Z]+$/ : /[^0-9]+$/;
    if (!regex.test(event.target.value)) {
        event.target.value = event.target.value.replace(remplace, ''); // Eliminar caracteres no permitidos
    }
}

// Obtener el elemento "username" para validar que no exista en la base de datos
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
            handleValidationErrors(username, "The username is already used. Please choose a different");
        }else{
            username.style.cssText = "border-color: green !important";
            handleMessage("");
        }
        
    })
    .catch(error => console.log("Conexion failed, try in some seconds"))
})

// Funcion para cambiar los input de password a text y viceversa
const viewBtn = document.querySelectorAll(".view-btn");
for (const iterator of viewBtn) {
    iterator.addEventListener("click", () => {

        viewBtn.forEach(element => element.src = ((element.src == 'file:///home/julio/Documentos/front-se/source/ojo-no.png') ? 'source/ojo.png' : 'source/ojo-no.png'));

        let view = [
            document.getElementById("password"),
            document.getElementById("repet")
        ];

        view.forEach(element => element.type = ((element.type == "password") ? "text" : "password")); 

    });
};

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

function handleValidationErrors(obj,message){
    handleMessage(message);
    obj.style.cssText = "border-color: red !important";
    obj.focus();
    return;
}
