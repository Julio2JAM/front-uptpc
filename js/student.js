//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = 'http://localhost:3000/api';

document.querySelectorAll(".card-content button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});

window.addEventListener('load', async () => await loadData());

async function loadData() {
    await fetch(`${API_URL}/student/`)
        .then(response => response.json())
        .then(data => dataTable(data))
        .catch(error => error);
}

document.getElementById('search').addEventListener('click', async () => await search())

async function search() {
    
}

function dataTable(data) {

    const table = document.getElementById('tbody');
    table.innerHTML = "";
    
    const statusData = {
        "-1": "Eliminado",
        "0": "No disponible",
        "1": "Disponible"
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

        const status = row.insertCell(4);
        status.innerText = statusData[element.id_status];
        
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

    await fetch(`${API_URL}/student/${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data))
    .catch(error => console.log(error));
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
    inputSubmit.value = !data?.person.id ? "Crear" : "Actualizar";
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
    .then(response => response.json())
    .then(data => data)
    .catch(err => err);
}