//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

// Al cargar el archivo, obtener todos los registros de la tabla professor
window.addEventListener("load", async () => await loadData());

// Funcion para obtener los datos de la tabla de la BD
async function loadData() {
    await fetch(`${API_URL}/professor`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error)
}

// Funcion para llenar la tabla de la web
function dataTable(data) {

    // Limpiar la tabla
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    // Estados para los registros de la tabla
    const status = {
        "-1":"Eliminado",
        "0":"No disponible",
        "1":"Disponible",
    };

    // Buton de ver mas
    const actionButton = document.createElement("button");
    actionButton.className = "view-button";
    actionButton.innerText = "Ver más";

    // Iterar todos los datos, para colocarlos en la tabla
    data.array.forEach(element => {
        
        // Crear fila
        const row = tbody.insertRow(-1);

        // Crear columnas
        const cellName = tbody.insertCell(0);
        cellName.innerText = element.person.name;
        
        const cellLastName = tbody.insertCell(1);
        cellLastName.innerText = element.person.lastName;

        const cellCedule = tbody.insertCell(2);
        cellCedule.innerText = element.person.cedule;

        const cellProfession = tbody.insertCell(3);
        cellProfession.innerText = element.person.profession;

        const cellStatus = tbody.insertCell(4);
        cellStatus.innerText = element.person.id_status;

        const cellAction = tbody.insertCell(5);
        cellAction.appendChild(actionButton.cloneNode(true));

    });

    // Agregar eventos
    addEvents();
}

// Funcion para agregar el evento de click a todos los votones view
function addEvents() {
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async (event) => await detail(event)));
}

// Funcion para mostrar los detalles de cada registro
async function detail(event) {
    
    const row = event.target.closest("tr");
    const id = row.cells[0].textContent;

    await fetch(`${API_URL}/professor/${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data))
    .catch(error => error)
}

// Agregar evento para el boton new
document.getElementById("new").addEventListener("click", () => createModalBox(null));

// Funcion para crear el modal box
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
    img.src = "../source/students.jpeg";
    modalContent.appendChild(img);
    
    // Id
    var spanId = document.createElement("span");
    spanId.innerText = "ID";
    spanId.className = "id";
    var inputId = document.createElement("input");
    inputId.id = "id";
    inputId.type = "text";
    inputId.className = "id";
    inputId.value = data?.person.id ?? "";

    cardContent.appendChild(spanId);
    cardContent.appendChild(inputId);

    // Name
    var spanName = document.createElement("span");
    spanName.innerText = "Nombre";
    var inputName = document.createElement("input");
    inputName.id = "name";
    inputName.type = "text";
    inputName.placeholder = "Nombre";
    inputName.value = data?.person.name ?? "";

    cardContent.appendChild(spanName);
    cardContent.appendChild(inputName);
    
    // Lastname
    var spanLastname = document.createElement("span");
    spanLastname.innerHTML = "Apellido";
    var inputLastname = document.createElement("input");
    inputLastname.id = "lastname";
    inputLastname.type = "text";
    inputLastname.placeholder = "Apellido";
    inputLastname.value = data?.person.lastName ?? "";

    cardContent.appendChild(spanLastname);
    cardContent.appendChild(inputLastname);

    // Cedule
    var spanCedule = document.createElement("span");
    spanCedule.innerText = "Cedula";
    var inputCedule = document.createElement("input");
    inputCedule.id = "cedule";
    inputCedule.type = "text";
    inputCedule.placeholder = "Cedula";
    inputCedule.value = data?.person.cedule ?? "";

    cardContent.appendChild(spanCedule);
    cardContent.appendChild(inputCedule);
    
    // Email
    var spanEmail = document.createElement("span");
    spanEmail.innerText = "Email";
    var inputEmail = document.createElement("input");
    inputEmail.id = "email";
    inputEmail.type = "email";
    inputEmail.placeholder = "Email";
    inputEmail.value = data?.person.email ?? "";

    cardContent.appendChild(spanEmail);
    cardContent.appendChild(inputEmail);

    // Phone
    var spanPhone = document.createElement("span");
    spanPhone.innerText = "Telefono";
    var inputPhone = document.createElement("input");
    inputPhone.id = "phone";
    inputPhone.type = "text";
    inputPhone.placeholder = "Telefono";
    inputPhone.value = data?.person.phone ?? "";

    cardContent.appendChild(spanPhone);
    cardContent.appendChild(inputPhone);
    
    // Status
    var spanStatus = document.createElement("span");
    spanStatus.innerText = "Status";
    var selectStatus = document.createElement("select");
    selectStatus.id = "status";
    var options = [
        {value: -1, label: "Eliminado"},
        {value: 0, label: "No disponible"},
        {value: 1, label: "Disponible"}
    ];
    options.forEach(element => selectStatus.add(new Option(element.label, element.value)));
    selectStatus.value = data?.person.id_status ?? 1;

    cardContent.appendChild(spanStatus);
    cardContent.appendChild(selectStatus);

    // Save
    var inputSubmit = document.createElement("input");
    inputSubmit.id = "save";
    inputSubmit.type = "submit";
    inputSubmit.value = data?.person.id ? "Actualizar" : "Crear";
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

    // Obtener datos para crear o actualizar el registro.
    const id  = document.getElementById("id");
    const jsonData = {
        name: document.getElementById("name").value,
        datetime_start: document.getElementById("datetime_start").value,
        datetime_end: document.getElementById("datetime_end").value,
        id_status: document.getElementById("status").value,
    };
    
    // Datos para el fetch
    const method = id ? "PUT" : "POST";
    var tableBody = document.getElementById("tbody");

    if(id){
        for (const row of tableBody.rows) {
            if(row.cells[0].innerText == id.value){
                var updateRow = row;
                break;
            }
        }
        jsonData.id = id.value;
    }

    // Gardar o actualizar los elementos en la base de datos
    await fetch(`${API_URL}/professor/`, {
        method: method,
        headers: {"content-type": "application/json"},
        body: jsonData
    })
    .then(response => response.json())
    .then(data => search() /*NO EXISTE FUNCION SEACH TODAVIA PARA ESTE MODULO*/)
    .catch(error => console.log(error));

    // Comentado puede que temporalmente
    //document.getElementById("modal-box").remove();
}

document.querySelectorAll(".card-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});