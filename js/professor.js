//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"
window.addEventListener("load", async () => await loadData());

async function loadData() {
    await fetch(`${API_URL}/professor`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error)
}

function dataTable(data) {

    if(!data){
        return;
    }

    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    const status = {
        "-1":"Eliminado",
        "0":"No disponible",
        "1":"Disponible",
    };

    const actionButton = document.createElement("button");
    actionButton.className = "view-button";
    actionButton.innerText = "Ver más";

    data.array.forEach(element => {
        
        const row = tbody.insertRow(-1);

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

    addEvents();
}

function addEvents() {
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async (event) => await detail(event)));
}

async function detail(event) {
    
    const row = event.target.closest("tr");
    const id = row.cells[0].textContent;

    await fetch(`${API_URL}/professor/${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data))
    .catch(error => error)
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
    inputId.type = "text";
    inputId.className = "id";
    inputId.value = data?.id ?? "";

    cardContent.appendChild(spanId);
    cardContent.appendChild(inputId);

    // Name
    var spanName = document.createElement("span");
    spanName.innerText = "Name";
    var inputName = document.createElement("input");
    inputName.type = "text";
    inputName.value = data?.name ?? "";

    cardContent.appendChild(spanName);
    cardContent.appendChild(inputName);
    
    // Lastname
    var spanLastname = document.createElement("span");
    spanLastname.innerHTML = "Last name";
    var inputLastname = document.createElement("input");
    inputLastname.type = "text";
    inputLastname.value = data?.lastname ?? "";

    cardContent.appendChild(spanLastname);
    cardContent.appendChild(inputLastname);

    // Cedule
    var spanCedule = document.createElement("span");
    spanCedule.innerText = "Cedule";
    var inputCedule = document.createElement("input");
    inputCedule.type = "text";
    inputCedule.value = data?.cedule ?? "";

    cardContent.appendChild(spanCedule);
    cardContent.appendChild(inputCedule);
    
    // Email
    var spanEmail = document.createElement("span");
    spanEmail.innerText = "Email";
    var inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.value = data?.email ?? "";

    cardContent.appendChild(spanEmail);
    cardContent.appendChild(inputEmail);

    // Phone
    var spanPhone = document.createElement("span");
    spanPhone.innerText = "Phone";
    var inputPhone = document.createElement("input");
    inputPhone.type = "text";
    inputPhone.value = data?.phone ?? "";

    cardContent.appendChild(spanPhone);
    cardContent.appendChild(inputPhone);
    
    // Status
    var spanStatus = document.createElement("span");
    spanStatus.innerText = "Status";
    var selectStatus = document.createElement("select");
    var options = [
        {value: -1, label: "Eliminado"},
        {value: 0, label: "No disponible"},
        {value: 1, label: "Disponible"}
    ];
    for (var option of options) {
        selectStatus.add(new Option(option.label, option.value));
    }
    selectStatus.value = data?.id_status ?? "";

    cardContent.appendChild(spanStatus);
    cardContent.appendChild(selectStatus);

    // Save
    var inputSubmit = document.createElement("input");
    inputSubmit.id = "save";
    inputSubmit.type = "submit";
    inputSubmit.value = "Actualizar";
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

async function save(){

    const id  = document.getElementById("id");
    const name  = document.getElementById("name");
    const datetime_start  = document.getElementById("datetime_start");
    const datetime_end  = document.getElementById("datetime_end");
    const status  = document.getElementById("status");

    const method = id ? "PUT" : "POST";
    const jsonData = {
        name:name.value, 
        datetime_start:datetime_start.value, 
        datetime_end:datetime_end.value,
        id_status:status.value
    };

    if(id){

        let tableBody = document.getElementById("tbody");
        for (const row of tableBody.rows) {
            if(row.cells[0].innerText == id.value){
                let updateRow = row;
                break;
            }
        }

        jsonData.id = id.value;
    }

    await fetch(`${API_URL}/professor/`, {
        method: method,
        headers: {"content-type": "application/json"},
        body: jsonData
    })
    .then(response => response.json())
    .then(data => {

        const dataStatus = {
            "-1": "Eliminado",
            "0": "No disponible",
            "1": "Disponible"
        };

    })
    .catch(error => console.log(error));

}

document.querySelectorAll(".card-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});