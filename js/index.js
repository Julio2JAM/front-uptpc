//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

window.addEventListener("load", async () => await verifyToken())

async function verifyToken() {

    // Array de cookies, separadas por ';'.
    const cookies = document.cookie.split(';');

    // Nombre de la cookie a buscar.
    const cookieName = "token";

    // Si el array esta vacio, quiere decir que no hay cookies registradas.
    if(!cookies){
        return;
    }

    // Buscar en las cookies
    let cookieValue;
    for (const value of cookies) {
        // Validar que la cookie evaluada, comience por el nombre que se está buscando.
        if (value.startsWith(cookieName)) {
            // Obtener el valor de la cookie, eliminando el nombre +1 caracter, porque al obtener el array de cookies, los valores obtenidos son tipo JSON, es decir "nombre:valor", de esta manera, se elimina "nombre:", dejando solo el valor.
            cookieValue = value.substring(cookieName.length + 1);
            // Decodificar el valor obtenido y asignarlo a la variable anteriormente declarada 'cookieValue'.
            cookieValue = decodeURIComponent(cookieValue);
            // Detener el ciclo de busqueda.
            break;
        }
    }

    // Validar que se haya obtenido una cookie, es decir, que cookieValue no este vacia.
    if (!cookieValue) {
        return;
    }

    const token = await fetch(`${API_URL}/access/verifyToken/${cookieValue}`)
    .then(response => response.json())
    .catch(error => handleMessage(error));

    if (!token.token) {
        document.cookie = cookieName + '=""; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    const roles = {
        admin: "menu.html",
        student: "assignmentStudent.html",
    }

    if (!token.role || !roles[token.role]) {
        handleMessage("No posee permisos para acceder.");
        return;
    }

    location.href = roles[token.role];
}

document.getElementById("login-btn").addEventListener("click", async event => {
    event.preventDefault();

    const jsonData = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }

    const login = await fetch(`${API_URL}/access`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .catch(error => handleMessage("Error de conexion, intente nuevamente."));

    if(login.message){
        handleMessage(login.message);
        return;
    }
    
    document.cookie = `token=${login.token}; SameSite=None; Secure;`;
    await verifyToken();

    /*
    const http = async (url, {headers, method, body}) => {
        return new Promise(async (resolve, reject) => {
           await fetch(url, {headers, method, body})
           .then(async (response) => {
            const STATUS_OK = [200, 201, 204]
            const data = await response.json()
            if(STATUS_OK.includes(response.status)){
                resolve(data)
            }
            reject(data)
           })
        })
    }

    const data = await http(`${API_URL}/access`,{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    })
    .catch(error => console.log(error))*/

});


//Funcion para cambiar los input de password a text y viceversa
const viewBtn = document.querySelector(".view-btn");
const iconEye = `<svg style="width:1.5rem; height: 1.5rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 14">
    <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z"/></g></svg>`;

const iconEyeSlash = `<svg style="width:1.5rem; height: 1.5rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1.933 10.909A4.357 4.357 0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 19 9c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M2 17 18 1m-5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
</svg>`;

viewBtn.innerHTML = iconEye;
viewBtn.addEventListener("click", function () {

    viewBtn.removeChild(viewBtn.firstChild);

    let view = document.getElementById("password");
    view.type = ((view.type == "password") ? "text" : "password");
    viewBtn.innerHTML = (view.type == "password") ? iconEye : iconEyeSlash;
});

function handleMessage(message) {

    if (typeof message !== "string") {
        message = "Error de conexión, intente nuevamente en algunos segundos.";
    }

    // Obtener el elemento cuya clase sea "message"
    const span = document.querySelector(".message");

    // Validar que el mensaje esta vacio y el elemento exista para eliminar
    if (!message && span) {
        span.remove();

    // Validar que el mensaje esta vacio y el elemento no exista para retornar
    } else if (!message && !span) {
        return;
    }

    // Validar que el elemento <span> exista, de ser asi, se cambia solo el su texto y se retorna
    if (span) {
        span.textContent = message;
        return;
    }


    // Obtener el div y el hr, getElementsByClassName devuelve un arreglo, por eso se accede a la pos 0
    //const div = document.getElementsByClassName("container")[0];
    const div = document.querySelector("form");
    const br = document.querySelector("form br");

    // Crear el elemento a agregar
    const newElement = document.createElement("span");
    newElement.textContent = message;
    newElement.classList.add("message");

    // Agregar el nuevo elemento después del hr
    div.insertBefore(newElement, br.nextSibling);
}
