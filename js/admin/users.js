//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"
const token = sessionStorage.getItem('token');

if(!token){
    location.href = "../index.html";
}
document.getElementById("logout").addEventListener("click", logout);
function logout(){
    sessionStorage.removeItem('token');
    location.href = "../index.html";
}

// Al cargar el archivo, obtener todos los registros de la tabla subject
window.addEventListener("load", async () => {
    await role();
    await search();
});

async function role() {
    const select = document.getElementById("filter-role");
    select.innerHTML = "";

    const startOption = new Option("Seleccione un permiso", "");
    select.add(startOption);

    await fetch(`${API_URL}/role`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const option = new Option(element.name, element.id);
            select.add(option);
        });
    })
    .catch(err => err);
}

document.getElementById('search-filter-btn').addEventListener('click', async () => await search());

async function search() {
    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = {};
    for (const element of elements) {
        data[element.id.replace("filter-", "")] = element.value;
    }

    await fetch(`${API_URL}/user/?username=${data["username"]}&idRole=${data["role"]}&id_status=${data["status"]}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => console.log(error));
}

async function dataTable(data) {

    const table = document.querySelector("tbody");
    table.innerHTML = "";
    const selectRole = document.getElementById("filter-role");
    const dataRole = new Object();
    for (const option of selectRole.options) {
        dataRole[option.value] = option.innerText;
    }

    // Crear boton de view
    const button = document.createElement('button');
    button.innerHTML = "Ver más";
    button.className = "view-button";

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

        // Insertar en la ultima posicion
        const row = table.insertRow(-1);
        row.className = "filter-item";//+element.id_level;

        // Crear columnas
        const id = row.insertCell(0);
        id.innerHTML = element.id;

        const username = row.insertCell(1);
        username.innerHTML = element.username;

        const role = row.insertCell(2);
        role.innerHTML = dataRole[element.role?.id] ?? "No posee";

        const status = row.insertCell(3);
        const statusSpan = document.createElement('span');
        statusSpan.innerHTML = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        status.appendChild(statusSpan);

        const view = row.insertCell(4);
        view.appendChild(button.cloneNode(true));

    });

    addEvents();
}

// Agregar evento de click a todos los botones de view
function addEvents() {
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", event => detail(event)));
}

// Obtener todos los datos de un elemento
async function detail(event) {

    const row = event.target.closest('tr');
    const id = row.cells[0].textContent;

    await fetch(`${API_URL}/user/?id=${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(err => console.error(err));

}

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
    img.src = "../../source/user-icon.png";
    const buttonClose = document.createElement("button");
    buttonClose.className = "close-btn";
    buttonClose.innerHTML = "&times;"

    h3.appendChild(img);
    h3.innerHTML += "Usuario:";
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

    const labelIdPerson = document.createElement("label");
    labelIdPerson.for = "idPerson";
    labelIdPerson.innerHTML = "Person ID:";
    labelIdPerson.style.display = "none";
    const inputIdPerson = document.createElement("input");
    inputIdPerson.type = "text";
    inputIdPerson.id = "idPerson";
    inputIdPerson.placeholder = "ID";
    inputIdPerson.value = data?.person?.id ?? "";
    inputIdPerson.style.display = "none";

    form.appendChild(labelIdPerson);
    form.appendChild(inputIdPerson);

    const labelUser = document.createElement("label");
    labelUser.for = "username";
    labelUser.innerHTML = "Usuario:";
    const inputUser = document.createElement("input");
    inputUser.type = "text";
    inputUser.id = "username";
    inputUser.placeholder = "Usuario";
    inputUser.value = data?.username ?? "";
    inputUser.readOnly = data ? true : false;

    form.appendChild(labelUser);
    form.appendChild(inputUser);

    //* ESTA VALIDACION PERMITE QUE SOLO SE LE MUESTRE EL CAMPO DE PASSWORD AL MOMENTO DE CREAR UN USUARIO NUEVO,
    //* SE PUEDE ELIMINAR ESTA VALIDACION PARA QUE SE PUEDA ACTUALIZAR LA CLAVE DE LOS USUARIOS YA EXISTETNE
    if(!data){
        var labelPassword = document.createElement("label");
        labelPassword.for = "password";
        labelPassword.innerHTML = "Contraseña:";
        var inputPassword = document.createElement("input");
        inputPassword.type = "text";
        inputPassword.id = "password";
        inputPassword.placeholder = "Contraseña";
        inputPassword.value = data?.password ?? "";

        form.appendChild(labelPassword);
        form.appendChild(inputPassword);
    }

    const labelPerson = document.createElement("label");
    labelPerson.for = "person";
    labelPerson.innerHTML = "Propietario:";
    const inputPerson = document.createElement("input");
    inputPerson.type = "text";
    inputPerson.id = "person";
    inputPerson.placeholder = "Propietario";
    inputPerson.value = data?.person?.id ? data?.person?.name + " " + data?.person?.lastName : "";
    inputPerson.addEventListener("click", () => createModalBoxTable(data?.person?.id));

    form.appendChild(labelPerson);
    form.appendChild(inputPerson);

    const labelRole = document.createElement("label");
    labelRole.for = "role";
    labelRole.innerHTML = "Permisos:";
    var selectRole = document.getElementById("filter-role");
    selectRole = selectRole.cloneNode(true);
    selectRole.id = "idRole";
    selectRole.value = data?.role?.id ?? "";

    form.appendChild(labelRole);
    form.appendChild(selectRole);

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

    const inputName = document.createElement("input");
    inputName.id = "filter-nombre";
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

            row.insertCell(0).innerText = element.id;
            row.insertCell(1).innerText = element.name;
            row.insertCell(2).innerText = element.lastName ?? "";
            row.insertCell(3).innerText = element.cedule;

            const statusSpan = document.createElement('span');
            statusSpan.innerHTML = statusData[element.id_status];
            statusSpan.classList.add("status", statusClass[element.id_status]);
            
            row.insertCell(4).appendChild(statusSpan);
            row.insertCell(5).append(createButtonAssign(element.id, element.name + " " + element.lastName));
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
        username: document.getElementById("username").value,
        idRole: document.getElementById("idRole").value,
        id_status: Number(document.getElementById("id_status").value),
        idPerson: document.getElementById("idPerson").value,
    }

    const method = id ? "PUT" : "POST";

    if (id){
        jsonData.id = id;
    }else {
        jsonData.password = document.getElementById("password").value;
    }

    // Gardar los elementos en la base de datos
    await fetch(`${API_URL}/user`, {
        method: method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => search())
    .catch(error => console.error('Ha ocurrido un error: ', error));
};

// Exportar a PDF
document.getElementById("export-pdf").addEventListener("click", async () => await exportPDF());

async function exportPDF() {

    // Obtener de los elementos de busqueda su contenido
    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = {};
    for(const element of elements) {
        const name = element.id.replace("filter-","");
        data[name] = element.value;
    }

    await fetch(`${API_URL}/user/pdf/?username=${data["username"]}&idRole=${data["role"]}&id_status=${data["status"]}`)
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'file.pdf'; // Nombre del archivo
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error al descargar el PDF:', error));
}