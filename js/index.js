//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

window.addEventListener("load", async () => await verifyToken())

async function verifyToken(){

    const cookies = document.cookie.split(';');
    const cookieName = "token";

    let cookieValue;
    for (const value of cookies) {
        if (value.startsWith(cookieName)) {
            cookieValue = value.substring(cookieName.length + 1);
            cookieValue = decodeURIComponent(cookieValue);
            break;
        }
    }
    
    if(!cookieValue){
        return;
    }

    const token = await fetch(`http://localhost:3000/api/access/verifyToken/${cookieValue}`)
    .then(async (response) => {
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message ?? "Error de conexión, intente nuevamente en algunos segundos.");
        }
        return data;
    })
    .catch(error => {
        handleMessage(error);
        return response.status;
    });
    
    if(!token.token){
        document.cookie = cookieName + '=""; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    if(token.role){
        location.href = "menu.html";
    }
}

document.getElementById("login-btn").addEventListener("click", async () => {
    const jsonData = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }

    const login = await fetch(`${API_URL}/access`,{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    })
    .then(async (response) => {
        data = await response.json();
        if(!response.ok){
            throw new Error(data.message ?? "Error de conexión, intente nuevamente en algunos segundos.");
        }
        return data
    })
    .catch(error => handleMessage(error));
    
    if(login){
        /*const date = new Date();
        date.setDate(date.getDate() + 1)
        date.setHours(0,0,0,0);

        document.cookie = `token=${login.token}; SameSite=None; Secure; expires=${date};`*/
        document.cookie = `token=${login.token}; SameSite=None; Secure;`;
    } 

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
viewBtn.addEventListener("click", function(){
    viewBtn.src = ((viewBtn.src == 'file:///home/julio/Documentos/front-se/source/ojo-no.png') ? 'source/ojo.png' : 'source/ojo-no.png');
    let view = document.getElementById("password");
    view.type = ((view.type == "password") ? "text" : "password");
});

function handleMessage(message){
    // Obtener el elemento cuya clase sea "message"
    const span = document.querySelector(".message");

    // Validar que el mensaje esta vacio y el elemento exista para eliminar
    if(!message && span){
        span.remove();

    // Validar que el mensaje esta vacio y el elemento no exista para retornar
    }else if(!message && !span){
        return;
    }

    // Validar que el elemento <span> exista, de ser asi, se cambia solo el su texto y se retorna
    if(span){
        span.textContent = message;
        return;
    }


    // Obtener el div y el hr, getElementsByClassName devuelve un arreglo, por eso se accede a la pos 0
    //const div = document.getElementsByClassName("container")[0];
    const div = document.querySelector(".container");
    const hr = div.querySelector("hr");

    // Crear el elemento a agregar
    const newElement = document.createElement("span");
    newElement.textContent = message;
    newElement.classList.add("message");

    // Agregar el nuevo elemento después del hr
    div.insertBefore(newElement, hr.nextSibling);
}
