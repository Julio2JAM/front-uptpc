//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

// Al cargar el archivo, obtener todos los registros de la tabla professor
window.addEventListener("load", async () => await search());

//
document.getElementById('search-filter-btn').addEventListener('click', async () => await search());

async function search() {

    // Obtener de los elementos de busqueda su contenido
    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = new Object;
    for(const element of elements) {
        data[element.id.replace("filter-","")] = element.value;
    }

    await fetch(`${API_URL}/professor/?id=${data["id"]}&name=${data["name"]}&lastName=${data["lastName"]}&cedule=${data["cedule"]}&id_status=${data["status"]}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error)
}

// Funcion para llenar la tabla de la web
function dataTable(data) {

    // Limpiar la tabla
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    // Estados para los registros de la tabla
    const statusData = {
        "-1":"Eliminado",
        "0":"No disponible",
        "1":"Disponible",
    };

    const statusClass = {
      "-1": "deleted",
      "0": "unavailable",
      "1": "available"
    };

    // Buton de ver mas
    const actionButton = document.createElement("button");
    actionButton.className = "view-button";
    actionButton.innerText = "Ver más";

    // Iterar todos los datos, para colocarlos en la tabla
    data.forEach(element => {
        
        // Crear fila
        const row = tbody.insertRow(-1);

        // Crear columnas
        const cellId = row.insertCell(0);
        cellId.innerText = element.id;
        
        const cellName = row.insertCell(1);
        cellName.innerText = element.person.name ?? "";
        
        const cellLastName = row.insertCell(2);
        cellLastName.innerText = element.person.lastName ?? "";

        const cellCedule = row.insertCell(3);
        cellCedule.innerText = element.person.cedule ?? "";

        const cellProfession = row.insertCell(4);
        cellProfession.innerText = element.person.profession ?? "";

        const cellStatus = row.insertCell(5);
        const statusSpan = document.createElement('span');
        statusSpan.innerHTML = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        cellStatus.appendChild(statusSpan);

        const cellAction = row.insertCell(6);
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

    await fetch(`${API_URL}/professor/?id=${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(error => error)
}

// Agregar evento para el boton new
document.getElementById("new").addEventListener("click", () => createModalBox(null));

// Funcion para crear el modal box
function createModalBox(data){

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
    img.src = "../../source/professor2-icon.png";

    h3.appendChild(img);
    h3.innerHTML += "Docente";

    var buttonClose = document.createElement("button");
    buttonClose.className = "close-btn";
    buttonClose.innerHTML = "&times;"

    header.appendChild(h3);
    header.appendChild(buttonClose);

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
    inputName.value = data?.person.name ?? "";

    form.appendChild(labelName);
    form.appendChild(inputName);

    // Last name
    var labelLastname = document.createElement("label");
    labelLastname.for = "lastname";
    labelLastname.innerHTML = "Apellido:";
    var inputLastname = document.createElement("input");
    inputLastname.type = "text";
    inputLastname.id = "lastname";
    inputLastname.placeholder = "Apellido";
    inputLastname.value = data?.person.lastName ?? "";

    form.appendChild(labelLastname);
    form.appendChild(inputLastname);

    // Cedule
    var labelCedule = document.createElement("label");
    labelCedule.for = "cedule";
    labelCedule.innerHTML = "Cedula:";
    var inputCedule = document.createElement("input");
    inputCedule.type = "text";
    inputCedule.id = "cedule";
    inputCedule.placeholder = "Cedula";
    inputCedule.value = data?.person.cedule ?? "";

    form.appendChild(labelCedule);
    form.appendChild(inputCedule);

    // Phone
    var labelPhone = document.createElement("label");
    labelPhone.for = "phone";
    labelPhone.innerHTML = "Telefono:";
    var inputPhone = document.createElement("input");
    inputPhone.type = "text";
    inputPhone.id = "phone";
    inputPhone.placeholder = "Telefono";
    inputPhone.value = data?.person.phone ?? "";
    
    form.appendChild(labelPhone);
    form.appendChild(inputPhone);

    // Email
    var labelEmail = document.createElement("label");
    labelEmail.for = "email";
    labelEmail.innerHTML = "Email:";
    var inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.id = "email";
    inputEmail.placeholder = "Email";
    inputEmail.value = data?.person.email ?? "";

    form.appendChild(labelEmail);
    form.appendChild(inputEmail);

    // Status
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
    buttonReset.addEventListener("click", () => {
        inputId.value = data?.id ?? "";
        inputName.value = data?.person.name ?? "";
        inputLastname.value = data?.person.lastName ?? "";
        inputCedule.value = data?.person.cedule ?? "";
        inputPhone.value = data?.person.phone ?? "";
        inputEmail.value = data?.person.email ?? "";
        selectStatus.value = data?.id_status ?? 1;
    });
    
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
            modal.remove();
        }, 260);
    }
}

// Agregar o actualizar registros de la BD
async function save(){

    // Obtener datos para crear o actualizar el registro.
    const id  = document.getElementById("id").value;
    const jsonData = {
        person: {
            name: document.getElementById("name").value,
            lastName: document.getElementById("lastname").value,
            cedule: document.getElementById("cedule").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
        },
        id_status: document.getElementById("status").value,
    };
    
    // Datos para el fetch
    const method = id ? "PUT" : "POST";
    if(id) jsonData.id = id;
    
    // Gardar o actualizar los elementos en la base de datos
    await fetch(`${API_URL}/professor/`, {
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