//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

document.querySelectorAll(".table-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});

// Agregar evento de click para mostrar una lista con todas las secciones activas.
document.getElementById("classroom").addEventListener("click", async () => await createModalList());

// Crear modal box con el nombre de las secciones activas.
async function createModalList(){

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
    const classroom = document.getElementById("classroom");
    classroom.value = id;

    await fetch(`${API_URL}/program/?idClassroom=${id}`)
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

        const subject = row.insertCell(1);
        subject.innerText = element?.subject.name;

        const professor = row.insertCell(2);
        professor.innerText = element?.professor.person.name + " " + element?.professor.person.lastName;

        const classroom = row.insertCell(3);
        classroom.innerText = element?.classroom.name;

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

async function search() {

    const classroom = document.getElementById("classroom").value;
    if(!classroom){
        return;
    }

    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = {};
    for (const element of elements) {
        data[element.id.replace("filter-", "")] = element.value;
    }

    await fetch(`${API_URL}/program/?idClassroom=${classroom}&subjectName=${data["subject"]}&personName=${data["name"]}&personLastName=${data["lastname"]}&personCedule=${data["cedule"]}&idStatus=${data["status"]}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => console.log(error));
}

// Obtener todos los datos de un elemento
async function detail(event) {

    const row = event.target.closest('tr');
    const id = row.cells[0].textContent;

    await fetch(`${API_URL}/program/?id=${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(err => console.error(err));

}

document.getElementById('search-filter-btn').addEventListener('click', async () => await search());

document.getElementById("new").addEventListener("click", () => createModalBox(null));

function createModalBox(data) {
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
    img.src = "../../source/professor2-icon.png";
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

    // PERSON
    const labelIdPerson = document.createElement("label");
    labelIdPerson.for = "idPerson";
    labelIdPerson.innerHTML = "Person ID:";
    labelIdPerson.style.display = "none";
    const inputIdPerson = document.createElement("input");
    inputIdPerson.type = "text";
    inputIdPerson.id = "idPerson";
    inputIdPerson.placeholder = "ID";
    inputIdPerson.value = data?.professor.person.id ?? "";
    inputIdPerson.style.display = "none";

    form.appendChild(labelIdPerson);
    form.appendChild(inputIdPerson);

    const labelPerson = document.createElement("label");
    labelPerson.for = "person";
    labelPerson.innerHTML = "Docente:";
    const inputPerson = document.createElement("input");
    inputPerson.type = "text";
    inputPerson.id = "person";
    inputPerson.placeholder = "Docente";
    inputPerson.value = data?.professor.person.id ? data?.professor.person.name + " " + data?.professor.person.lastName : "";
    inputPerson.addEventListener("click", () => createModalBoxTable(data?.person?.id));

    form.appendChild(labelPerson);
    form.appendChild(inputPerson);
    // PERSON

    // SUBJECT
    const labelIdSubject = document.createElement("label");
    labelIdSubject.for = "idSubject";
    labelIdSubject.innerHTML = "Subject ID:";
    labelIdSubject.style.display = "none";
    const inputIdSubject = document.createElement("input");
    inputIdSubject.type = "text";
    inputIdSubject.id = "idSubject";
    inputIdSubject.placeholder = "ID";
    inputIdSubject.value = data?.subject.id ?? "";
    inputIdSubject.style.display = "none";

    form.appendChild(labelIdSubject);
    form.appendChild(inputIdSubject);

    const labelSubject = document.createElement("label");
    labelSubject.for = "subject";
    labelSubject.innerHTML = "Materia:";
    const inputSubject = document.createElement("input");
    inputSubject.type = "text";
    inputSubject.id = "subject";
    inputSubject.placeholder = "Materia";
    inputSubject.value = data?.subject.name ?? "";
    inputSubject.addEventListener("click", () => createModalBoxTable(data.subject.id));

    form.appendChild(labelSubject);
    form.appendChild(inputSubject);
    // SUBJECT

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

    const personFilter = {
        id:text,
        name:text,
        lastName:text,
        cedule:text,
    };

    const subjectFilter = {
        id: text,
        name: text,
    };

    for (const value of personFilter) {
        const input = document.createElement("input");
        input.id = "filter-" + value;
    }

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

    const inputName = document.createElement("input");
    inputName.id = "filter-name";
    inputName.type = "text";
    inputName.placeholder = "Filtrar por nombre";
    form.appendChild(inputName);

    const inputLastname = document.createElement("input");
    inputLastname.id = "filter-lastname";
    inputLastname.type = "text";
    inputLastname.placeholder = "Filtrar por apellido";
    form.appendChild(inputLastname);

    const inputCedule = document.createElement("input");
    inputCedule.id = "filter-cedule";
    inputCedule.type = "text";
    inputCedule.placeholder = "Filtrar por cedula";
    form.appendChild(inputCedule);

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

    const thName = document.createElement("th");
    thName.innerHTML = "Nombres"
    trHead.appendChild(thName);

    const thLastname = document.createElement("th");
    thLastname.innerHTML = "Apellidos"
    trHead.appendChild(thLastname);

    const thCedule = document.createElement("th");
    thCedule.innerHTML = "Cedula"
    trHead.appendChild(thCedule);

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

    await fetch(`${API_URL}/person/?id=${idPerson}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const row = tbody.insertRow(-1);

            const id = row.insertCell(0);
            id.innerText = element.id;

            const name = row.insertCell(1);
            name.innerText = element.name;

            const lastname = row.insertCell(2);
            lastname.innerText = element.lastName ?? "";

            const cedule = row.insertCell(3);
            cedule.innerText = element.cedule;

            const status = row.insertCell(4);
            const statusSpan = document.createElement('span');
            statusSpan.innerHTML = statusData[element.id_status];
            statusSpan.classList.add("status", statusClass[element.id_status]);
            status.appendChild(statusSpan);

            const action = row.insertCell(5);
            action.append(createButtonAssign(element.id, element.name + " " + element.lastName));
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
    const closeButton = document.createElement("button");
    closeButton.id = "close";
    closeButton.className = "change-button";
    closeButton.innerHTML = "Salir";

    //
    footer.appendChild(closeButton);
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

function createButtonAssign(id, name) {
    const button = document.createElement("button");
    button.innerHTML = "Asignar";
    button.className = "new";
    button.addEventListener("click", () => {
        const imputIdPerson = document.getElementById("idPerson");
        imputIdPerson.value = id;

        const imputPerson = document.getElementById("person");
        imputPerson.value = name;

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
    
    // Obtener los elementos "name" y "description"
    const id = document.getElementById("id").value;
    const jsonData = {
        id_status: document.getElementById("id_status").value
    }

    const method = id ? "PUT" : "POST";
    if (id) jsonData.id = id;

    // Gardar los elementos en la base de datos
    await fetch(`${API_URL}/program`, {
        method: method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => search())
    .catch(error => console.error('Ha ocurrido un error: ', error));
};