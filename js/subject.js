//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

// Al cargar el archivo, obtener todos los registros de la tabla subject
window.addEventListener("load", async () => await loadSubject());

// Obtener todos los registros de la tabla
async function loadSubject(){
    await fetch(`${API_URL}/subject/`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => console.log("Error de conexión, intente nuevamente en algunos segundos."));
}

// Al hacer click en search, obtener el elemento name y llamar a la funcion search
document.getElementById("search").addEventListener("click", async () => await search());

// Funcion para buscar un registro en la tabla search
async function search(){

    // Obtener de los elementos de busqueda su contenido
    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = new Object;
    for(const element of elements) {
        data[element.id.replace("filter-","")] = element.value;
    }

    const validateData = Object.values(data).every(value => !value);
    if(validateData){
        await loadSubject();
        return;
    }

    // En caso de no enviar algun dato, remplazar // por /
    var url = `${API_URL}/subject/name/${data["name"]}/description/${data["description"]}/status/${data["status"]}`;
    url = url.replace(/\/\//g, "/");

    // Obtener los datos de la busqueda
    await fetch(url)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);
}

// Funcion para llenar la tabla
function dataTable(data) {

    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

    const statusData = {
        "-1": "Eliminado",
        "0": "No disponible",
        "1": "Disponible"
    };

    // Crear boton de view
    const button = document.createElement('button');
    button.innerHTML = "Ver más";
    button.className = "view-button";

    data.forEach(element => {
        // Insertar en la ultima posicion
        const row = tableBody.insertRow(-1);

        const id = row.insertCell(0);
        id.innerHTML = element.id;

        const name = row.insertCell(1);
        name.innerHTML = element.name;

        const description = row.insertCell(2);
        description.innerHTML = element.description;

        const status = row.insertCell(3);
        status.innerHTML = statusData[element.id_status];

        const action = row.insertCell(4);
        action.appendChild(button.cloneNode(true));
        //action.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';
    });

    addEvents();
}

// Agregar evento de click a todos los botones de view
function addEvents(){
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async(event) => await detail(event)));
}

// Obtener todos los datos de un elemento
async function detail(event){

    const row = event.target.closest('tr');
    const id = row.cells[0].textContent;

    await fetch(`${API_URL}/subject/${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data))
    .catch(err => console.error(err));

}

document.getElementById("new").addEventListener("click", () => createModalBox(null));

function createModalBox(data){

    // Crear divs contenedores
    var modal = document.createElement("div");
    modal.className = "modal-box";
    modal.id = "modal-box";

    var modalContent = document.createElement("div");
    modalContent.className = "horizontal-card";
    modalContent.id = "modal-content";

    var cardContent = document.createElement("div");
    cardContent.className = "card-content";
    cardContent.id = "card-content";

    // Crear elementos del DOM
    var img = document.createElement("img");
    img.src = "../source/subject2.jpeg";
    
    var spanId = document.createElement("span");
    var inputId = document.createElement("input");

    var spanName = document.createElement("span");
    var inputName = document.createElement("input");
    
    var spanDescription = document.createElement("span");
    var inputDescription = document.createElement("input");
    
    var spanStatus = document.createElement("span");
    var selectStatus = document.createElement("select");
    var options = [
        {value: -1, label: "Eliminado"},
        {value: 0, label: "No disponible"},
        {value: 1, label: "Disponible"}
    ];

    var inputSubmit = document.createElement("input");
    inputSubmit.addEventListener("click", async () => await save());

    // Configurar los elementos
    spanId.textContent = "id";
    spanId.className = "id";
    inputId.type = "text";
    inputId.id = "id";
    inputId.className = "id";
    inputId.placeholder = "id";
    inputId.value = data?.id ?? "";
    
    spanName.textContent = "Nombre";
    inputName.type = "text";
    inputName.id = "name";
    inputName.placeholder = "Nombre";
    inputName.value = data?.name ?? "";
    
    spanDescription.textContent = "Descripción";
    inputDescription.type = "text";
    inputDescription.id = "description";
    inputDescription.placeholder = "Descripción";
    inputDescription.value = data?.description ?? "";
    
    spanStatus.textContent = "Estado";
    selectStatus.id = "status";
    for (var option of options) {
        selectStatus.add(new Option(option.label, option.value));
    }
    selectStatus.value = data?.id_status ?? 1;

    inputSubmit.type = "submit";
    inputSubmit.id = "save";
    inputSubmit.value = data?.id ? "Actualizar" : "Crear";
    
    // Agregar los elementos al DOM
    modalContent.appendChild(img);

    cardContent.appendChild(spanId);
    cardContent.appendChild(inputId);
    
    cardContent.appendChild(spanName);
    cardContent.appendChild(inputName);

    cardContent.appendChild(spanDescription);
    cardContent.appendChild(inputDescription);

    cardContent.appendChild(spanStatus);
    cardContent.appendChild(selectStatus);

    cardContent.appendChild(inputSubmit);

    modalContent.appendChild(cardContent);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
        if(event.target.id === "modal-box"){
            event.target.remove();
        }
    });
}

// Obtener el elemento "save" y agregarle un evento
async function save (){
    // Obtener datos para crear o actualizar el registro.
    const id = document.getElementById("id").value;
    const jsonData = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        id_status: document.getElementById("status").value,
    };

    // Datos para el fetch
    const method = id ? "PUT" : "POST";
    const tableBody = document.querySelector("tbody");
    if(id) jsonData.id = id;
    
    // Gardar o actualizar los elementos en la base de datos
    await fetch(`${API_URL}/subject`, {
        method: method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => search())
    .catch(error => console.error('Ha ocurrido un error: ', error));

    // Comentado puede que temporalmente
    //document.getElementById("modal-box").remove();
};