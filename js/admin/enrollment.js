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

    await fetch(`${API_URL}/classroom/`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.innerHTML = element?.name;
            a.addEventListener("click", () => loadClassroomEvents(element.id, element?.name))

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

    await fetch(`${API_URL}/enrollment/?idClassroom=${id}`,{
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
        row.insertCell(1).innerText = element?.student.person.name ?? "No name";
        row.insertCell(2).innerText = element?.student.person.lastName ?? "No last name";
        row.insertCell(3).innerText = element?.student.person.cedule;

        const statusSpan = document.createElement('span');
        statusSpan.innerText = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        
        row.insertCell(4).appendChild(statusSpan);
        row.insertCell(5).appendChild(button.cloneNode(true));
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

    await fetch(`${API_URL}/enrollment/?idClassroom=${classroom}&personName=${data["name"]}&personLastName=${data["lastname"]}&personCedule=${data["cedule"]}&idStatus=${data["status"]}`, {
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

    await fetch(`${API_URL}/enrollment/?id=${id}`, {
        method: 'GET',
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(error => console.log(error));
}

// 
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
        inputName.value = data?.student.person.name ?? "";
        inputLastname.value = data?.student.person.lastName ?? "";
        inputCedule.value = data?.student.person.cedule ?? "";
        inputPhone.value = data?.student.person.phone ?? "";
        inputEmail.value = data?.student.person.email ?? "";
        selectStatus.value = data?.student.id_status ?? 1;
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

// Obtener el elemento "save" y agregarle un evento
async function save() {

    const jsonData = {
        id : document.getElementById("id").value,
        id_status: document.getElementById("id_status").value,
    }

    // Gardar los elementos en la base de datos
    await fetch(`${API_URL}/enrollment`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => search())
    .catch(error => console.error('Ha ocurrido un error: ', error));

};

var newStudentList = [];

document.getElementById("new").addEventListener("click", async () => await createModalBoxTable());
async function createModalBoxTable(){

    if(!document.getElementById("classroom").value){
        return;
    }

    // Crear divs contenedores
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal";

    const container = document.createElement("div");
    container.className = "container";

    const tableContainer = document.createElement("div");
    tableContainer.className = "table-container fixed";

    //
    const header = document.createElement("header");
    header.className = "filter-container";
    const form = document.createElement("form");

    const filterFields = [
        { 
            id: "id",
            type: "text",
            placeholder: "Filtrar por id",
        },
        { 
            id: "name",
            type: "text",
            placeholder: "Filtrar por nombre",
        },
        { 
            id: "lastname",
            type: "text",
            placeholder: "Filtrar por apellido",
        },
        { 
            id: "cedule",
            type: "text",
            placeholder: "Filtrar por cedula",
        },
    ];

    for (const value of filterFields) {
        const input = document.createElement("input");
        Object.assign(input, value);
        form.appendChild(input);
    }

    const buttonSearch = document.createElement("button");
    buttonSearch.id = "search";
    buttonSearch.className = "filter-button active";
    buttonSearch.innerHTML = "Filter";
    
    const filterButtonContainer = document.createElement("div");
    filterButtonContainer.className = "filter-btn-container";

    const search = document.createElement("button");
    search.type = "button";
    search.id = "modal-search-filter-btn";
    search.innerHTML = "Filtrar";
    const reset = document.createElement("button");
    reset.type = "reset";
    reset.id = "reset-filter-btn";
    reset.innerHTML = "Borrar";

    //
    filterButtonContainer.appendChild(search);
    filterButtonContainer.appendChild(reset);

    //
    header.appendChild(form);

    //
    tableContainer.appendChild(header);

    const section = document.createElement("section");
    section.className = "table-overflow";

    // Crear un elemento <table>, un elemento <thead> y un elemento <tbody>
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const tbody = document.createElement("tbody");

    const dataTh = ["id", "Nombres", "Apellidos", "Cedula", "Estado", "Acción"];
    for (const value of dataTh) {
        const th = document.createElement("th");
        th.innerHTML = value;
        trHead.appendChild(th);
    }

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

    const dataBD = await fetch(`${API_URL}/enrollment/studentNoClassroom/`)
    .then(response => response.json())
    .then(data => data)
    .catch(error => error);

    dataBD.forEach(element => {

        const row = tbody.insertRow(-1);
        row.insertCell(0).innerText = element.id;
        row.insertCell(1).innerText = element.person.name ?? "No posee.";
        row.insertCell(2).innerText = element.person.lastName ?? "No posee.";
        row.insertCell(3).innerText = element.person.cedule;

        const status = row.insertCell(4);
        const statusSpan = document.createElement('span');
        statusSpan.innerHTML = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        status.appendChild(statusSpan);

        const action = row.insertCell(5);
        action.append(createCheck(element.id));

    });

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
    const loadButton = document.createElement("button");
    loadButton.id = "load";
    loadButton.addEventListener("click", async () => await loadEnrollment());
    loadButton.innerHTML = "Cargar";
    footer.appendChild(loadButton);

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

function createCheck(id){
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id + "-checkbox";
    checkbox.value = id;
    checkbox.addEventListener("change", (event) => addStudent(event))

    // const label = document.createElement("label");
    // label.for = checkbox.id;
    return checkbox;
}

function addStudent(event){
    event.target.checked ? newStudentList[newStudentList.length] = event.target.value : newStudentList.splice(newStudentList.indexOf(event.target.value), 1);
    console.log(event.target);
    console.log(newStudentList);
}

async function loadEnrollment(){

    for (const value of newStudentList) {
        await fetch(`${API_URL}/enrollment`, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({
                "student": value,
                "classroom": document.getElementById("classroom").value
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