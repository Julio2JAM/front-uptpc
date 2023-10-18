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
document.getElementById("search-filter-btn").addEventListener("click", async () => await search());

// Funcion para buscar un registro en la tabla search
async function search(){

    // Obtener de los elementos de busqueda su contenido
    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = new Object;
    for(const element of elements) {
        data[element.id.replace("filter-","")] = element.value;
    }

    // Obtener los datos de la busqueda
    await fetch(`${API_URL}/classroom/?name=${data["name"]}&datetime_start=${data["datetime_start"]}&datetime_end=${data["datetime_end"]}&id_status=${data["status"]}`)
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

    const statusClass = {
      "-1": "deleted",
      "0": "unavailable",
      "1": "available"
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
        const statusSpan = document.createElement('span');
        statusSpan.innerHTML = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        status.appendChild(statusSpan);

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

    await fetch(`${API_URL}/classroom/?id=${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(error => console.error(error));

}

// Agregar evento para el boton new
document.getElementById("new").addEventListener("click", () => createModalBox(null));

// Funcion para crear el modal box
function createModalBox(data) {

    // Crear divs contenedores
    var modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal";

    var modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    var header = document.createElement("header");
    
    // Crear elementos del DOM
    var h3 = document.createElement("h3");
    var img = document.createElement("img");
    img.src = "../../source/classroom-icon.png";
    var buttonClose = document.createElement("button");
    buttonClose.className = "close-btn";
    buttonClose.innerHTML = "&times;"

    var section = document.createElement("section");
    var form = document.createElement("form");

    // ID
    var labelId = document.createElement("label");
    labelId.for = "id";
    labelId.innerHTML = "ID:";
    labelId.style.display = "none";
    var inputId = document.createElement("input");
    inputId.type = "text";
    inputId.id = "id";
    inputId.placeholder = "ID";
    inputId.value = data?.id ?? "";
    inputId.style.display = "none";

    form.appendChild(labelId);
    form.appendChild(inputId);

    // Name
    var labelName = document.createElement("label");
    labelName.for = "name";
    labelName.innerHTML = "Nombre:";
    var inputName = document.createElement("input");
    inputName.type = "text";
    inputName.id = "name";
    inputName.placeholder = "Nombre";
    inputName.value = data?.name ?? "";

    form.appendChild(labelName);
    form.appendChild(inputName);

    // datetimeStart
    var labelDatetimeStart = document.createElement("label");
    labelDatetimeStart.for = "datetimestart";
    labelDatetimeStart.innerHTML = "Fecha de inicio:";
    var inputDatetimeStart = document.createElement("input");
    inputDatetimeStart.type = "date";
    inputDatetimeStart.id = "datetime_start";
    inputDatetimeStart.value = data?.datetime_start ?? "";

    form.appendChild(labelDatetimeStart);
    form.appendChild(inputDatetimeStart);

    // datetimeEnd
    var labelDatetimeEnd = document.createElement("label");
    labelDatetimeEnd.for = "datetimesend";
    labelDatetimeEnd.innerHTML = "Fecha de cierre:";
    var inputDatetimeEnd = document.createElement("input");
    inputDatetimeEnd.type = "date";
    inputDatetimeEnd.id = "datetime_end";
    inputDatetimeEnd.value = data?.datetime_end ?? "";

    form.appendChild(labelDatetimeEnd);
    form.appendChild(inputDatetimeEnd);
    
    var labelStatus = document.createElement("label");
    var selectStatus = document.createElement("select");
    var options = [
        {value: -1, label: "Eliminado"},
        {value: 0, label: "No disponible"},
        {value: 1, label: "Disponible"}
    ];
    labelStatus.textContent = "Estado";
    selectStatus.id = "status";
    for (var option of options) {
        selectStatus.add(new Option(option.label, option.value));
    }
    selectStatus.value = data?.id_status ?? 1;

    form.appendChild(labelStatus);
    form.appendChild(selectStatus);

    var footer = document.createElement("footer");

    var buttonSubmit = document.createElement("button");
    buttonSubmit.addEventListener("click", async () => await save());
    buttonSubmit.type = "submit";
    buttonSubmit.id = "save";
    buttonSubmit.innerHTML = data?.id ? "Actualizar" : "Crear";

    var buttonReset = document.createElement("button");
    buttonReset.type = "reset";
    buttonReset.id = "reset";
    buttonReset.innerHTML = "Borrar";

    h3.appendChild(img);
    h3.innerHTML += "Seccion";

    header.appendChild(h3);
    header.appendChild(buttonClose);

    section.appendChild(form);
    
    footer.appendChild(buttonSubmit);
    footer.appendChild(buttonReset);
    
    modalContent.appendChild(header);
    modalContent.appendChild(section);
    modalContent.appendChild(footer);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    buttonClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
        if(event.target.id == "modal"){
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.add("close-modal");
        setTimeout(() => {
            modal.style.display = "none";
            modal.classList.remove("close-modal");
        }, 260);
    }

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

document.querySelectorAll(".table-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});