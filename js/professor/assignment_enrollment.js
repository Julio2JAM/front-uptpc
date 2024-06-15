//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"
const token = sessionStorage.getItem('token');
var printData = [];

// Cambiar de pagina.
document.querySelectorAll(".table-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});

window.addEventListener("load", async () => await subject());

async function subject() {
    const select = document.getElementById("filter-subject");
    select.innerHTML = "";

    const startOption = new Option("Seleccione una materia", "");
    select.add(startOption);
    
    await fetch(`${API_URL}/program/`,{
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const option = new Option(element.subject.name, element.id);
            select.add(option);
        });
    })
    .catch(err => console.log(err))
}

// Agregar evento de click para mostrar una lista con todas las secciones activas.
document.getElementById("classroom").addEventListener("click", async () => await createModalList());

// Crear modal box con el nombre de las secciones activas.
async function createModalList(){

    // const validateModalMenu = document.getElementById("modal-menu");

    const div = document.createElement("div");
    div.id = "modal-menu";
    div.className = "modal-menu";

    const ul = document.createElement("ul");
    ul.id = "classList";

    await fetch(`${API_URL}/program/`,{
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.innerHTML = element.classroom.name;
            a.addEventListener("click", () => loadClassroomEvents(element.classroom.id, element.classroom.name))

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
async function loadClassroomEvents(id, name){
    const classroom = document.getElementById("classroom");
    // classroom.value = name;
    classroom.value = id;

    await fetch(`${API_URL}/assignment_enrollment/?idClassroom=${id}`,{
        method: 'GET',
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);

}

// Cargar registros en la tabla HTML
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
        
        row.insertCell(0).innerText = element.id;
        row.insertCell(1).innerText = element?.assignment.title ?? "Sin titulo";
        row.insertCell(2).innerText = element?.assignment.description ?? "Sin descripcion";
        row.insertCell(3).innerText = element?.base ?? "Sin descripcion";
        row.insertCell(4).innerText = element?.percentage ?? "Sin descripcion";
        row.insertCell(5).innerText = element?.assignment.datetime_start ?? "Sin fecha inicial";
        row.insertCell(6).innerText = element?.assignment.datetime_end ?? "Sin fecha final";

        const statusSpan = document.createElement('span');
        statusSpan.innerText = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        
        row.insertCell(7).appendChild(statusSpan);
        row.insertCell(8).appendChild(button.cloneNode(true));
    });

    addEvents();
}

// Filtrar registros segun parametros enviados
document.getElementById('search-filter-btn').addEventListener('click', async () => await search());
async function search() {

    const classroom = document.getElementById("classroom").value;
    if(!classroom){
        return;
    }

    const elements = document.querySelectorAll(".filter-container input, select");
    const data = new Object;
    for(const element of elements) {
        const name = element.id.replace("filter-","");
        data[name] = element.value;
        printData[name] = element.value;
    }

    await fetch(`${API_URL}/assignment_enrollment/?idClassroom=${classroom}&title=${data["title"]}&datatimeStart=${data["datatime_start"]}&datetimeEnd=${data["datetime_end"]}&idStatus=${data["status"]}`, {
        method: 'GET',
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);

}

// Boton para ver detalles.
function addEvents(){
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async (event) => await detail(event)));
}

// Get a API para obtener los detalles del estudiante por su registro en enrollment
async function detail(event){
    const row = event.target.closest("tr");
    const id = row.cells[0].textContent;

    await fetch(`${API_URL}/assignment_enrollment/?id=${id}`, {
        method: 'GET',
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(error => console.log(error));
}

var newAssignmentList = [];

document.getElementById("new").addEventListener("click", async () => createModalBox());
function createModalBox(data) {

    if(!document.getElementById("classroom").value){
        return;
    }

    // Crear divs contenedores
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const header = document.createElement("header");
    const section = document.createElement("section");
    const form = document.createElement("form");

    // Crear elementos del DOM
    const h3 = document.createElement("h3");

    const img = document.createElement("img");
    img.src = "../../source/user-icon.png";
    const buttonClose = document.createElement("button");
    buttonClose.className = "close-btn";
    buttonClose.innerHTML = "&times;"

    h3.appendChild(img);
    h3.innerHTML += "User:";
    header.appendChild(h3);
    header.appendChild(buttonClose);

    const labelId = document.createElement("label");
    labelId.for = "id";
    labelId.innerHTML = "ID:";
    labelId.style.display = "none";
    const inputId = document.createElement("input");
    inputId.type = "text";
    inputId.id = "id";
    inputId.placeholder = "ID";
    inputId.value = data?.id ?? "";
    inputId.style.display = "none";

    form.appendChild(labelId);
    form.appendChild(inputId);

    const labelBase = document.createElement("label");
    labelBase.for = "base";
    labelBase.innerHTML = "Base:";
    const inputBase = document.createElement("input");
    inputBase.type = "text";
    inputBase.id = "base";
    inputBase.placeholder = "Base";
    inputBase.value = data?.base ?? "";

    form.appendChild(labelBase);
    form.appendChild(inputBase);

    const labelPercentage = document.createElement("label");
    labelPercentage.for = "percentage";
    labelPercentage.innerHTML = "Porcentaje:";
    const inputPercentage = document.createElement("input");
    inputPercentage.type = "text";
    inputPercentage.id = "percentage";
    inputPercentage.placeholder = "Porcentaje";
    inputPercentage.value = data?.percentage ?? "";

    form.appendChild(labelPercentage);
    form.appendChild(inputPercentage);

    const labelIdAssignment = document.createElement("label");
    labelIdAssignment.for = "idAssignment";
    labelIdAssignment.innerHTML = "Assignment ID:";
    labelIdAssignment.style.display = "none";
    const inputIdAssignment = document.createElement("input");
    inputIdAssignment.type = "text";
    inputIdAssignment.id = "idAssignment";
    inputIdAssignment.placeholder = "ID";
    inputIdAssignment.value = data?.assignment.id ?? "";
    inputIdAssignment.style.display = "none";

    form.appendChild(labelIdAssignment);
    form.appendChild(inputIdAssignment);

    const labelAssignment = document.createElement("label");
    labelAssignment.for = "assignment";
    labelAssignment.innerHTML = "Actividad:";
    const inputAssignment = document.createElement("input");
    inputAssignment.type = "text";
    inputAssignment.id = "assignment";
    inputAssignment.placeholder = "Actividad";
    inputAssignment.value = data?.assignment.id ? data?.assignment.title : "";
    inputAssignment.disabled = data?.assignment.id ? true : false;
    inputAssignment.addEventListener("click", () => createModalBoxTable(data?.person?.id));

    form.appendChild(labelAssignment);
    form.appendChild(inputAssignment);

    const labelSubject = document.createElement("label");
    labelSubject.for = "subject";
    labelSubject.innerHTML = "Materia:";
    const inputSubject = document.createElement("input");
    inputSubject.type = "text";
    inputSubject.id = "subject";
    inputSubject.placeholder = "Materia";
    inputSubject.value = data?.assignment.subject.name ?? "";
    inputSubject.disabled = true;

    form.appendChild(labelSubject);
    form.appendChild(inputSubject);

    const labelStatus = document.createElement("label");
    const selectStatus = document.createElement("select");
    const options = [
        { value: -1, label: "Eliminado" },
        { value: 0, label: "No disponible" },
        { value: 1, label: "Disponible" }
    ];
    labelStatus.textContent = "Estado";
    selectStatus.id = "id_status";
    for (const option of options) {
        selectStatus.add(new Option(option.label, option.value));
    }
    selectStatus.value = data?.id_status ?? 1;

    form.appendChild(labelStatus);
    form.appendChild(selectStatus);

    const buttonSubmit = document.createElement("button");
    buttonSubmit.addEventListener("click", async () => {
        await save();
        closeModal();
    });
    buttonSubmit.type = "submit";
    buttonSubmit.id = "save";
    buttonSubmit.innerHTML = data?.id ? "Actualizar" : "Crear";

    const buttonReset = document.createElement("button");
    buttonReset.type = "reset";
    buttonReset.id = "reset";
    buttonReset.innerHTML = "Borrar";
    buttonReset.addEventListener("click", () => {
        inputId.value = data?.id ?? "";
        inputUser.value = data?.username ?? "";
        inputPerson.value = data?.person?.id ? data?.person?.name + " " + data?.person?.lastName : "";
        selectRole.value = data?.level?.id ?? "";
        selectStatus.value = data?.id_status ?? 1;
    });

    section.appendChild(form);

    const footer = document.createElement("footer");
    footer.appendChild(buttonSubmit);
    footer.appendChild(buttonReset);

    modalContent.appendChild(header);
    modalContent.appendChild(section);
    modalContent.appendChild(footer);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    buttonClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
        if (event.target.id == "modal") {
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

async function createModalBoxTable(idPerson = "") {

    // Crear divs contenedores
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal-table";

    const container = document.createElement("div");
    container.className = "container";

    const tableContainer = document.createElement("div");
    tableContainer.className = "table-container fixed";

    //
    const header = document.createElement("header");
    header.className = "filter-container";
    const form = document.createElement("form");

    const inputId = document.createElement("input");
    inputId.id = "filter-id";
    inputId.type = "text";
    inputId.placeholder = "Filtrar por id";
    inputId.value = idPerson;
    form.appendChild(inputId);
    
    const selectSubject = document.getElementById("filter-subject").cloneNode(true);
    selectSubject.id = "filter-subject";
    selectSubject.value = "";
    form.appendChild(selectSubject);

    const inputName = document.createElement("input");
    inputName.id = "filter-title";
    inputName.type = "text";
    inputName.placeholder = "Filtrar por titulo";
    form.appendChild(inputName);

    const inputLastname = document.createElement("input");
    inputLastname.id = "filter-description";
    inputLastname.type = "text";
    inputLastname.placeholder = "Filtrar por descripcion";
    form.appendChild(inputLastname);

    const inputDatetimeStart = document.createElement("input");
    inputDatetimeStart.id = "filter-datetime-start";
    inputDatetimeStart.type = "date";
    inputDatetimeStart.placeholder = "Filtrar por fecha de inicio";
    form.appendChild(inputDatetimeStart);

    const inputDatetimeEnd = document.createElement("input");
    inputDatetimeStart.id = "filter-datetime-end";
    inputDatetimeEnd.type = "date";
    inputDatetimeStart.placeholder = "Filtrar por fecha de fin";
    form.appendChild(inputDatetimeEnd);

    const filterButtonContainer = document.createElement("div");
    filterButtonContainer.className = "filter-btn-container";

    const search = document.createElement("button");
    search.type = "button";
    search.id = "search-filter-btn";
    search.innerHTML = "Filtrar";
    filterButtonContainer.appendChild(search);

    const reset = document.createElement("button");
    reset.type = "reset";
    reset.id = "reset-filter-btn";
    reset.innerHTML = "Borrar";
    filterButtonContainer.appendChild(reset);

    // Agregar elementos al contenedor
    form.appendChild(filterButtonContainer);
    header.appendChild(form);
    tableContainer.appendChild(header);

    const section = document.createElement("section");
    section.className = "table-overflow";

    // Crear un elemento <table>, un elemento <thead> y un elemento <tbody>
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const tbody = document.createElement("tbody");

    const thID = document.createElement("th");
    thID.innerHTML = "ID"
    trHead.appendChild(thID);

    const thSubject = document.createElement("th");
    thSubject.innerHTML = "Materia"
    trHead.appendChild(thSubject);

    const thTitle = document.createElement("th");
    thTitle.innerHTML = "Titulo"
    trHead.appendChild(thTitle);

    const thLastname = document.createElement("th");
    thLastname.innerHTML = "Descripción"
    trHead.appendChild(thLastname);

    const thDatetimeStart = document.createElement("th");
    thDatetimeStart.innerHTML = "Fecha de inicio"
    trHead.appendChild(thDatetimeStart);

    const thDatetimeEnd = document.createElement("th");
    thDatetimeEnd.innerHTML = "Fecha de fin"
    trHead.appendChild(thDatetimeEnd);

    const thStatus = document.createElement("th");
    thStatus.innerHTML = "Estado"
    trHead.appendChild(thStatus);

    const thAction = document.createElement("th");
    thAction.innerHTML = "Acción"
    trHead.appendChild(thAction);

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

    await fetch(`${API_URL}/assignment/?id=${idPerson}`, {
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const row = tbody.insertRow(-1);

            row.insertCell(0).innerText = element.id;
            row.insertCell(1).innerHTML = element.subject.name
            row.insertCell(2).innerText = element.title;
            row.insertCell(3).innerText = element.description ?? "";
            row.insertCell(4).innerText = element.datetime_start ?? "";
            row.insertCell(5).innerText = element.datetime_end ?? "";

            const statusSpan = document.createElement('span');
            statusSpan.innerHTML = statusData[element.id_status];
            statusSpan.classList.add("status", statusClass[element.id_status]);
            
            row.insertCell(6).appendChild(statusSpan);
            row.insertCell(7).append(createButtonAssign(element.id, element.title, element.subject.name));
            // row.insertCell(7).append(createCheck(element.id));

        });
    })
    .catch(error => error);

    // Agregar la fila de encabezado al elemento <thead>
    thead.appendChild(trHead);

    // Agregar el elemento <thead> y <tbody> a la tabla
    table.appendChild(thead);
    table.appendChild(tbody);

    //
    section.appendChild(table);
    tableContainer.appendChild(section);

    //
    const footer = document.createElement("footer");
    
    //
    /*const loadButton = document.createElement("button");
    loadButton.id = "load";
    loadButton.className = "change-button";
    loadButton.innerHTML = "Cargar actividades";
    loadButton.addEventListener("click", async () => await loadAssignment());
    footer.appendChild(loadButton);*/

    //
    const closeButton = document.createElement("button");
    closeButton.id = "close";
    closeButton.className = "change-button";
    closeButton.innerHTML = "Salir";
    footer.appendChild(closeButton);

    //
    tableContainer.appendChild(footer);

    container.appendChild(tableContainer);
    modal.appendChild(container);

    document.body.appendChild(modal);

    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
        if (event.target.id == "modal") {
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

function createButtonAssign(id, title, subject) {
    const button = document.createElement("button");
    button.innerHTML = "Asignar";
    button.className = "new";
    button.addEventListener("click", () => {
        const imputidAssignment = document.getElementById("idAssignment");
        imputidAssignment.value = id;

        const imputAssignment = document.getElementById("assignment");
        imputAssignment.value = title;

        const imputSubject = document.getElementById("subject");
        imputSubject.value = subject;

        const modalTable = document.getElementById("modal-table");
        modalTable.classList.add("close-modal");
        setTimeout(() => {
            modalTable.style.display = "none";
            modalTable.classList.remove("close-modal");
            modalTable.remove();
        }, 260);

    });
    return button;
}

// Obtener el elemento "save" y agregarle un evento
async function save() {

    const id = document.getElementById("id").value;
    const jsonData = {
        base            : document.getElementById("base").value,
        percentage      : document.getElementById("percentage").value,
        idAssignment    : document.getElementById("idAssignment").value,
        idClassroom     : document.getElementById("classroom").value,
        id_status       : document.getElementById("id_status").value,
    }

    console.log("2");
    const method = id ? "PUT" : "POST";
    if(id) jsonData.id = id;

    // Gardar los elementos en la base de datos
    await fetch(`${API_URL}/assignment_enrollment`, {
        method: method,
        headers: { 
            "content-type": "application/json",
            "authorization": "Bearer " + token
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => search())
    .catch(error => console.error('Ha ocurrido un error: ', error));

};

/*
function createCheck(id){
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id + "-checkbox";
    checkbox.value = id;
    checkbox.addEventListener("change", (event) => addAssignment(event))

    // const label = document.createElement("label");
    // label.for = checkbox.id;
    return checkbox;
}
function addAssignment(event){
    event.target.checked ? newAssignmentList[newAssignmentList.length] = event.target.value : newAssignmentList.splice(newAssignmentList.indexOf(event.target.value), 1);
    document.getElementById('load').className = newAssignmentList.length == 0 ? "change-button" : "change-button active";
}

async function loadAssignment(){

    for (const value of newAssignmentList) {
        await fetch(`${API_URL}/assignment_enrollment`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + token
            },
            body: JSON.stringify({
                "idAssigment": value,
                "idClassroom": document.getElementById("classroom").value
            })
        })
        .then(response => response.json())
        .then(data => search())
        .catch(error => console.error('Ha ocurrido un error: ', error));
    }

    modal.classList.add("close-modal");
    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("close-modal");
        modal.remove();
    }, 260);

}
*/