//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = 'http://localhost:3000/api';

document.querySelectorAll(".table-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});

window.addEventListener('load', async () => await search());
document.getElementById('search-filter-btn').addEventListener('click', async () => await search());

async function search() {
    const elements = document.querySelectorAll(".filter-container input, select");
    const data = new Object;
    for(const element of elements) {
        data[element.id.replace("filter-","")] = element.value;
    }

    await fetch(`${API_URL}/student/?personName=${data.name}&personLastName=${data.lastName}&personCedule=${data.cedule}&id_status=${data.status}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);
}

function dataTable(data) {

    const table = document.getElementById('tbody');
    table.innerHTML = "";
    
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

    data.forEach(element => {
        const row = table.insertRow(-1);

        const id = row.insertCell(0);
        id.innerText = element.id;

        const name = row.insertCell(1);
        name.innerText = element.person.name;

        const lastname = row.insertCell(2);
        lastname.innerText = element.person.lastName ?? "";

        const cedule = row.insertCell(3);
        cedule.innerText = element.person.cedule;

        const status = row.insertCell(3);
        const statusSpan = document.createElement('span');
        statusSpan.innerHTML = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        status.appendChild(statusSpan);
        
        const action = row.insertCell(5);
        action.appendChild(button.cloneNode(true));
    });

    addEvents();
}

function addEvents(){
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async (event) => await detail(event)));
}

async function detail(event){
    const row = event.target.closest("tr");
    const id = row.cells[0].textContent;

    await fetch(`${API_URL}/student/?id=${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(error => console.log(error));
}

document.getElementById("new").addEventListener("click", () => createModalBox(null));

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
    img.src = "../source/student-icon.png";
    var buttonClose = document.createElement("button");
    buttonClose.className = "close-btn";
    buttonClose.innerHTML = "&times;"

    //
    // var spanId = document.createElement("span");
    // var inputId = document.createElement("input");
    // spanId.textContent = "id";
    // spanId.className = "id";
    // inputId.type = "text";
    // inputId.id = "id";
    // inputId.className = "id";
    // inputId.placeholder = "id";
    // inputId.value = data?.id ?? "";

    var section = document.createElement("section");
    var form = document.createElement("form");

    // Name
    var labelName = document.createElement("label");
    labelName.for = "name";
    labelName.innerHTML = "Nombre:";
    var inputName = document.createElement("input");
    inputName.type = "text";
    inputName.id = "name";
    inputName.placeholder = "Nombre";
    inputName.value = data?.person.name ?? "";
    
    // Last name
    var labelLastname = document.createElement("label");
    labelLastname.for = "lastname";
    labelLastname.innerHTML = "Apellido:";
    var inputLastname = document.createElement("input");
    inputLastname.type = "text";
    inputLastname.id = "lastname";
    inputLastname.placeholder = "Apellido";
    inputLastname.value = data?.person.lastName ?? "";

    // Cedule
    var labelCedule = document.createElement("label");
    labelCedule.for = "cedule";
    labelCedule.innerHTML = "Cedula:";
    var inputCedule = document.createElement("input");
    inputCedule.type = "text";
    inputCedule.id = "cedule";
    inputCedule.placeholder = "Cedula";
    inputCedule.value = data?.person.cedule ?? "";
    
    // Email
    var labelEmail = document.createElement("label");
    labelEmail.for = "email";
    labelEmail.innerHTML = "Email:";
    var inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.id = "email";
    inputEmail.placeholder = "Email";
    inputEmail.value = data?.person.email ?? "";

    // Phone
    var labelPhone = document.createElement("label");
    labelPhone.for = "phone";
    labelPhone.innerHTML = "Telefono:";
    var inputPhone = document.createElement("input");
    inputPhone.type = "text";
    inputPhone.id = "phone";
    inputPhone.placeholder = "Telefono";
    inputPhone.value = data?.person.phone ?? "";

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
    h3.innerHTML += "Estudiante";

    header.appendChild(h3);
    header.appendChild(buttonClose);
    
    form.appendChild(labelName);
    form.appendChild(inputName);

    form.appendChild(labelLastname);
    form.appendChild(inputLastname);

    form.appendChild(labelCedule);
    form.appendChild(inputCedule);

    form.appendChild(labelPhone);
    form.appendChild(inputPhone);

    form.appendChild(labelEmail);
    form.appendChild(inputEmail);

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

async function save() {

    const id = document.getElementById("id").value;
    const jsonData = {
        person: {
            name: document.getElementById("name").value,
            lastName: document.getElementById("lastname").value,
            cedule: document.getElementById("cedule").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            status: document.getElementById("status").value
        },
        representative1: {},
        representative2: {},
    }
    if(id) jsonData.id = id;
    const method = id ? "PUT" : "POST";

    await fetch(`${API_URL}/student`, {
        method: method,
        headers: {"content-type": "application/json"},
        body: JSON.stringify(jsonData)
    })
    .then(response => search())
    .then(data => data)
    .catch(err => err);
}