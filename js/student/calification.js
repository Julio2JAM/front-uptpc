API_URL = 'http://localhost:3000/api'

const token = getToken();
function getToken(){
    // Array de cookies, separadas por ';'.
    const cookies = document.cookie.split(';');

    // Nombre de la cookie a buscar.
    const cookieName = "token";

    // Si el array esta vacio, quiere decir que no hay cookies registradas.
    if(!cookies){
        return null;
    }

    // Buscar en las cookies
    let cookieValue = null;
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

    return cookieValue;
}

window.addEventListener('load', async () => await loadData())

async function loadData(idEnrollment) {

    fetch(`${API_URL}/calification/my_calification/?idEnrollment=${idEnrollment}`,{
        method: 'GET',
        headers: {'authorization': 'Bearer ' + token},
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error))

}

document.getElementById("select-classroon").addEventListener("click", async () => await classroom());
async function classroom(){
    
    const data = await fetch(`${API_URL}/enrollment/`,{
        method: "GET",
        headers: {'authorization': 'Bearer ' + token},
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error);

    console.log(data);

    const div = document.createElement("div");
    div.id = "modal-menu";
    div.className = "modal-menu";

    const ul = document.createElement("ul");
    data.forEach(element => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.innerHTML = element?.classroom.name;
        a.addEventListener("click", async () => await loadData(element.id))
        li.appendChild(a);
        ul.appendChild(li);
    });

    if(!ul.firstChild){
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.innerHTML = "Sin secciones para seleccionar";
        li.appendChild(a);
        ul.appendChild(li);
    }
    
    div.appendChild(ul);
    document.body.appendChild(div);

    const modalMenu = document.getElementById("modal-menu");
    modalMenu.addEventListener("click", event => {
        if (event.target.id === "modal-menu" || event.target.nodeName == "A") {
            document.getElementById("modal-menu").remove();
        }
    });
    
}