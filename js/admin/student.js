//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
var printData = new Object;

if(!token){
    location.href = "../index.html";
}
document.getElementById("logout").addEventListener("click", logout);
function logout(){
    sessionStorage.removeItem('token');
    location.href = "../index.html";
}

document.querySelectorAll(".table-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});

window.addEventListener('load', async () => await search());
document.getElementById('search-filter-btn').addEventListener('click', async () => await search());

async function search() {
    
    const elements = document.querySelectorAll(".filter-container input, select");
    // console.log(elements);
    const data = {};
    for(const element of elements) {
        const name = element.id.replace("filter-","");
        data[name] = element.value;
        printData[name] = element.value;
    }

    await fetch(`${API_URL}/student/?id=${data["id"]}&personName=${data["name"]}&personLastName=${data["lastName"]}&personCedule=${data["cedule"]}&id_status=${data["status"]}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);
}

function dataTable(data) {
    
    console.log(data);
    const table = document.querySelector('tbody');
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
        
        row.insertCell(0).innerText = element.id;
        row.insertCell(1).innerText = element.person.name;
        row.insertCell(2).innerText = element.person.lastName ?? "";
        row.insertCell(3).innerText = element.person.cedule;
        row.insertCell(4).innerText = element.person.email ?? "No posee";

        const statusSpan = document.createElement('span');
        statusSpan.innerHTML = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        
        row.insertCell(5).appendChild(statusSpan);
        row.insertCell(6).appendChild(button.cloneNode(true));
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
    img.src = "../../source/student-icon.png";

    h3.appendChild(img);
    h3.innerHTML += "Estudiante";
    
    var buttonClose = document.createElement("button");
    buttonClose.className = "close-btn";
    buttonClose.innerHTML = "&times;"

    header.appendChild(h3);
    header.appendChild(buttonClose);

    var section = document.createElement("section");
    var form = document.createElement("form");

    const personData = [
        {
            id: "id",
            placeholder: "id",
            value: data?.id ?? "",
        },
        {
            id: "name",
            placeholder: "Nombre",
            value: data?.person.name ?? ""
        },
        {
            id: "lastname",
            placeholder: "Apellido",
            value: data?.person.lastname ?? ""
        },
        {
            id: "cedule",
            placeholder: "Cedula",
            value: data?.person.cedule ?? ""
        },
        {
            id: "phone",
            placeholder: "Phone",
            value: data?.person.phone ?? ""
        },
        {
            id: "email",
            placeholder: "Email",
            value: data?.person.email ?? ""
        }
    ];

    for (const value of personData) {
        const label = document.createElement("label");
        label.for = value.id;
        label.innerHTML = value.placeholder + ":";
        // label.style.display = "none";
        const input = document.createElement("input");
        Object.assign(input, value);
        // input.style.display = "none";
        form.appendChild(label);
        form.appendChild(input);
    }
    form.querySelector('label').style.display = "none";
    form.querySelector('input').style.display = "none";

    // Status
    var labelStatus = document.createElement("label");
    var selectStatus = document.createElement("select");
    var options = [
        {value: -1, label: "Eliminado"},
        {value: 0, label: "No disponible"},
        {value: 1, label: "Disponible"}
    ];
    labelStatus.textContent = "Estado";
    selectStatus.id = "id_status";
    for (var option of options) {
        selectStatus.add(new Option(option.label, option.value));
    }
    selectStatus.value = data?.id_status ?? 1;

    form.appendChild(labelStatus);
    form.appendChild(selectStatus);

    var footer = document.createElement("footer");

    var buttonSubmit = document.createElement("button");
    buttonSubmit.addEventListener("click", async () => {
        await save();
        closeModal();
    });
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

async function save() {

    const id = document.getElementById("id").value;
    const jsonData = {
        person: {
            name: document.getElementById("name").value,
            lastName: document.getElementById("lastname").value,
            cedule: document.getElementById("cedule").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
        },
        representative1: {},
        representative2: {},
        id_status: document.getElementById("id_status").value
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

// Exportar a PDF
document.getElementById("export-pdf").addEventListener("click", () => exportPDF());

function exportPDF() {
    // En la página A
    const queryString = new URLSearchParams(printData).toString();
    const url = `../TABLE-TO-PDF.html?${queryString}`;
    window.open(url, "_blank");
}