//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

// Agregar evento de click para mostrar una lista con todas las secciones activas.
document.getElementById("classroom").addEventListener("click", async () => await createModalList());

// Crear modal box con el nombre de las secciones activas.
async function createModalList(data){

    const validateModalMenu = document.getElementById("modal-menu");

    const div = document.createElement("div");
    div.id = "modal-menu";
    div.className = "modal-menu";

    const ul = document.createElement("ul");
    ul.id = "classList";

    await fetch(`${API_URL}/classroom/`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.innerHTML = element?.name;
            a.addEventListener("click", () => loadClassroomEvents(element.id))

            li.appendChild(a);
            ul.appendChild(li);
        });
    })
    .catch(error => error);
    
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

// Agregar eventos de click para a la lista de secciones, para obtener datos de la seccion seleccionada.
async function loadClassroomEvents(id){
    await fetch(`${API_URL}/enrollment/?idClassroom=${id}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);
}

function dataTable(data) {

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    const button = document.createElement("button");
    button.className = "view-button";
    button.innerText = "Ver mas";

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

    data.forEach(element => {
        const row = tbody.insertRow(-1);

        const id = row.insertCell(0);
        id.innerText = element.id;

        const name = row.insertCell(1);
        name.innerText = element?.student.person.name ?? "No name";

        const lastname = row.insertCell(2);
        lastname.innerText = element?.student.person.lastName ?? "No last name";

        const cedule = row.insertCell(3);
        cedule.innerText = element?.student.person.cedule;

        const status = row.insertCell(4);
        const statusSpan = document.createElement('span');
        statusSpan.innerText = statusData[element.id_status];
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

    await fetch(`${API_URL}/enrollment/?idStudent=${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(error => console.log(error));
}

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
    inputName.value = data?.student.person.name ?? "";

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
    inputLastname.value = data?.student.person.lastName ?? "";

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
    inputCedule.value = data?.student.person.cedule ?? "";
    
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
    inputPhone.value = data?.student.person.phone ?? "";

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
    inputEmail.value = data?.student.person.email ?? "";

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

document.querySelectorAll(".table-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});

document.getElementById("new").addEventListener("click", async () => await createModalBoxTable());
async function createModalBoxTable(){

    // Crear divs contenedores
    var modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal";

    var modalContent = document.createElement("div");
    modalContent.className = "horizontal-card with-table";
    modalContent.id = "modal-content";

    var cardContent = document.createElement("div");
    cardContent.className = "card-content";
    cardContent.id = "card-content";
    
    // Crear elementos para filtrar
    var filterContent = document.createElement("div");
    filterContent.className = "filter-container";

    var inputName = document.createElement("input");
    inputName.id = "filter-name";
    inputName.type = "text";
    inputName.placeholder = "Filter by Name";

    var inputLastname = document.createElement("input");
    inputLastname.id = "filter-lastname";
    inputLastname.type = "text";
    inputLastname.placeholder = "Filter by Last name";

    var inputCedule = document.createElement("input");
    inputCedule.id = "filter-cedule";
    inputCedule.type = "text";
    inputCedule.placeholder = "Filter by Cedule";

    var buttonSearch = document.createElement("button");
    buttonSearch.id = "search";
    buttonSearch.className = "filter-button active";
    buttonSearch.innerHTML = "Filter";
    
    // Agregar elementos al contenedor
    filterContent.appendChild(inputName);
    filterContent.appendChild(inputLastname);
    filterContent.appendChild(inputCedule);
    filterContent.appendChild(buttonSearch);

    // Crear un elemento <table>, un elemento <thead> y un elemento <tbody>
    var colorTable = document.createElement("div");
    colorTable.className = "color-table";
    var tabla = document.createElement("table");
    tabla.className = "table"
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    tbody.className = "tbody-modal-box";

    // Crear una fila de encabezado <tr> y tres celdas de encabezado <th>
    var encabezado = document.createElement("tr");
    var celda0 = document.createElement("th");
    var celda1 = document.createElement("th");
    var celda2 = document.createElement("th");
    var celda3 = document.createElement("th");
    var celda4 = document.createElement("th");

    // Agregar texto a las celdas de encabezado
    celda0.innerHTML = "ID";
    celda1.innerHTML = "Nombres";
    celda2.innerHTML = "Apellidos";
    celda3.innerHTML = "Cedula";
    celda4.innerHTML = "Agregar";

    // Agregar las celdas de encabezado a la fila de encabezado
    encabezado.appendChild(celda0);
    encabezado.appendChild(celda1);
    encabezado.appendChild(celda2);
    encabezado.appendChild(celda3);
    encabezado.appendChild(celda4);

    // Agregar la fila de encabezado al elemento <thead>
    thead.appendChild(encabezado);

    // Agregar el elemento <thead> y <tbody> a la tabla
    tabla.appendChild(thead);
    tabla.appendChild(tbody);

    // Agregar todo
    colorTable.appendChild(tabla);
    cardContent.appendChild(filterContent);
    cardContent.appendChild(colorTable);

    //checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    await fetch(`${API_URL}/enrollment/studentNoClassroom`)
    .then(response => response.json())
    .then(data => data.forEach(element => {
        const row = tbody.insertRow(-1);

        const id = row.insertCell(0);
        id.innerText = element.id;

        const name = row.insertCell(1);
        name.innerText = element.person?.name ?? "No name";

        const lastname = row.insertCell(2);
        lastname.innerText = element.person?.lastName ?? "No last name";

        const cedule = row.insertCell(3);
        cedule.innerText = element.person?.cedule;

        const check = row.insertCell(4);
        check.appendChild(checkbox.cloneNode(true));

        check.firstChild.addEventListener('click', (event) => {
            event.stopPropagation();
            row.style.background = check.firstChild.checked ? "#e8e8e8" : ""
        });

        row.addEventListener("click", (event) => {
            event.stopPropagation();
            check.firstChild.checked = check.firstChild.checked ? false : true
            row.style.background = check.firstChild.checked ? "#e8e8e8" : "";
        });
        
    }))
    .catch(error => error);

    modalContent.appendChild(cardContent);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener('click', (event) => {
        if(event.target.id === "modal-box"){
            event.target.remove();
        }
    })
}