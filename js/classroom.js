//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

// Al cargar el archivo, obtener todos los registros de la tabla subject
window.addEventListener("load", async () => await loadData());

// Funcion para obtener los datos de la tabla de la BD
async function loadData(){
    await fetch(`${API_URL}/classroom/`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);
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
        await loadData();
        return;
    }

    // En caso de no enviar algun dato, remplazar // por /
    var url = `${API_URL}/classroom/name/${data["name"]}/datetime_start/${data["datetime_start"]}/datetime_end/${data["datetime_end"]}/id_status/${data["status"]}`;                       
    url = url.replace(/\/\//g, "/");

    // Obtener los datos de la busqueda
    await fetch(url)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => console.log(error));
}

// Funcion para llenar la tabla de la web
function dataTable(data){

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    const statusData = {
        "-1": "Eliminado",
        "0": "No disponible",
        "1": "Disponible"
    };

    const button = document.createElement("button");
    button.className = "view-button";
    button.innerText = "Ver más";

    for (const element of data) {

        const row = tbody.insertRow(-1);
        
        const id = row.insertCell(0);
        id.innerHTML = element.id ?? "";

        const name = row.insertCell(1);
        name.innerHTML = element.name ?? "test";

        const datetimeStart = row.insertCell(2);
        datetimeStart.textContent = element.datetime_start ?? "Sin fecha de inicio.";

        const datetimeEnd = row.insertCell(3);
        datetimeEnd.textContent = element.datetime_end ?? "Sin fecha de fin.";

        const status = row.insertCell(4);
        status.textContent = statusData[element.id_status] ?? "";

        const view = row.insertCell(5);
        view.appendChild(button.cloneNode(true));

    }

    addEvents();
}

// Funcion para agregar el evento de click a todos los votones view
function addEvents(){
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async (event) => await detail(event)));
}

// Funcion para mostrar los detalles de cada registro
async function detail(event) {

    const row = event.target.closest("tr");
    const id = row.cells[0].innerHTML;

    await fetch(`${API_URL}/classroom/${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data))
    .catch(error => console.error(error));

}

// Agregar evento para el boton new
document.getElementById("new").addEventListener("click", () => createModalBox(null));

// Funcion para crear el modal box
function createModalBox(data) {

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
    img.src = "../source/classroom2.jpeg";
    modalContent.appendChild(img);
    
    // Id
    var spanId = document.createElement("span");
    spanId.innerText = "ID";
    spanId.className = "id";
    var inputId = document.createElement("input");
    inputId.id = "id";
    inputId.type = "text";
    inputId.className = "id";
    inputId.value = data?.id ?? "";

    cardContent.appendChild(spanId);
    cardContent.appendChild(inputId);

    // Name
    var spanName = document.createElement("span");
    spanName.innerText = "Name";
    var inputName = document.createElement("input");
    inputName.id = "name";
    inputName.type = "text";
    inputName.value = data?.name ?? "";
    inputName.placeholder = "Name";

    cardContent.appendChild(spanName);
    cardContent.appendChild(inputName);

    // datetimeStart
    var spanDatetimeStart = document.createElement("span");
    spanDatetimeStart.innerHTML = "Datetime start";
    var inputDatetimeStart = document.createElement("input");
    inputDatetimeStart.id = "datetime_start";
    inputDatetimeStart.type = "date";
    inputDatetimeStart.value = data?.datetime_start ?? "";

    cardContent.appendChild(spanDatetimeStart);
    cardContent.appendChild(inputDatetimeStart);
    
    // datetimeEnd
    var spanDatetimeEnd = document.createElement("span");
    spanDatetimeEnd.innerHTML = "Datetime end";
    var inputDatetimeEnd = document.createElement("input");
    inputDatetimeEnd.id = "datetime_end";
    inputDatetimeEnd.type = "date";
    inputDatetimeEnd.value = data?.datetime_end ?? "";

    cardContent.appendChild(spanDatetimeEnd);
    cardContent.appendChild(inputDatetimeEnd);
    
    // Status
    var spanStatus = document.createElement("span");
    spanStatus.innerText = "Status";
    var selectStatus = document.createElement("select");
    var options = [
        {value: "", label: "Select a status"},
        {value: -1, label: "Eliminado"},
        {value: 0, label: "No disponible"},
        {value: 1, label: "Disponible"}
    ];
    for (var option of options) {
        selectStatus.add(new Option(option.label, option.value));
    }
    selectStatus.id = "status";
    selectStatus.value = data?.id_status ?? "";

    cardContent.appendChild(spanStatus);
    cardContent.appendChild(selectStatus);

    // Save
    var inputSubmit = document.createElement("input");
    inputSubmit.id = "save";
    inputSubmit.type = "submit";
    inputSubmit.value = !data?.id ? "Crear" : "Actualizar";
    inputSubmit.addEventListener("click", async () => await save());

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

// Agregar o actualizar registros de la BD
async function save(){

    const id  = document.getElementById("id").value;
    const jsonData = {
        name: document.getElementById("name").value, 
        datetime_start: document.getElementById("datetime_start").value, 
        datetime_end: document.getElementById("datetime_end").value,
        id_status: document.getElementById("status").value
    };

    const method = id ? "PUT" : "POST";
    const tableBody = document.querySelector("tbody");
    id ? jsonData.id = id : null;
    
    await fetch(`${API_URL}/classroom`, {
        method: method,
        headers: {"content-type": "application/json"},
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => search())
    .catch(error => console.log(error));

}

document.querySelectorAll(".card-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});