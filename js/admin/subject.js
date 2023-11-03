//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

// Al cargar el archivo, obtener todos los registros de la tabla subject
window.addEventListener("load", async () => await loadSubject());

// Obtener todos los registros de la tabla
async function loadSubject(){
    await fetch(`${API_URL}/subject/`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => console.log("Error de conexión, intente nuevamente en algunos segundos."));
}

// Al hacer click en search, obtener el elemento name y llamar a la funcion search
document.getElementById("search-filter-btn").addEventListener("click", async () => await search());

// Funcion para buscar un registro en la tabla search
async function search(){

    // Obtener de los elementos de busqueda su contenido
    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = new Object;
    for(const element of elements) {
        data[element.id.replace("filter-","")] = element.value;
    }

    const validateData = Object.values(data).every(value => !value);
    if(validateData){
        await loadSubject();
        return;
    }

    // Obtener los datos de la busqueda
    await fetch(`${API_URL}/subject/?id=${data["id"]}&name=${data["name"]}&description=${data["description"]}&id_status=${data["status"]}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);
}

// Funcion para llenar la tabla
function dataTable(data) {

    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

    if(!data){
        const section = document.querySelector("container section");
        const h1 = document.createElement("h1");
        h1.innerHTML = "Sin datos.";

        section.appendChild(h1);
        return;
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

    // Crear boton de view
    const button = document.createElement('button');
    button.innerHTML = "Ver más";
    button.className = "view-button";

    data.forEach(element => {
        // Insertar en la ultima posicion
        const row = tableBody.insertRow(-1);

        const id = row.insertCell(0);
        id.innerHTML = element.id;

        const name = row.insertCell(1);
        name.innerHTML = element.name;

        const description = row.insertCell(2);
        description.innerHTML = element.description;

        const status = row.insertCell(3);
        const statusSpan = document.createElement('span');
        statusSpan.innerHTML = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        status.appendChild(statusSpan);

        const action = row.insertCell(4);
        action.appendChild(button.cloneNode(true));
        //action.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';
    });

    addEvents();
}

// Agregar evento de click a todos los botones de view
function addEvents(){
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async(event) => await detail(event)));
}

// Obtener todos los datos de un elemento
async function detail(event){

    const row = event.target.closest('tr');
    const id = row.cells[0].textContent;

    await fetch(`${API_URL}/subject/?id=${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(err => console.error(err));

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
    img.src = "../../source/subject-icon.png";
    var buttonClose = document.createElement("button");
    buttonClose.className = "close-btn";
    buttonClose.innerHTML = "&times;"

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

    var section = document.createElement("section");
    var form = document.createElement("form");

    var labelName = document.createElement("label");
    labelName.for = "name";
    labelName.innerHTML = "Nombre:";
    var inputName = document.createElement("input");
    inputName.type = "text";
    inputName.id = "name";
    inputName.placeholder = "Nombre";
    inputName.value = data?.name ?? "";
    
    var labelDescription = document.createElement("label");
    labelDescription.for = "description";
    labelDescription.innerHTML = "Descripcion:";
    var inputDescription = document.createElement("input");
    inputDescription.type = "text";
    inputDescription.id = "description";
    inputDescription.placeholder = "Descripción";
    inputDescription.value = data?.description ?? "";
    
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
    h3.innerHTML += "Asignatura";

    header.appendChild(h3);
    header.appendChild(buttonClose);
    
    form.appendChild(labelId);
    form.appendChild(inputId);

    form.appendChild(labelName);
    form.appendChild(inputName);

    form.appendChild(labelDescription);
    form.appendChild(inputDescription);

    form.appendChild(labelStatus);
    form.appendChild(selectStatus);

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
async function save (){
    // Obtener datos para crear o actualizar el registro.
    const id = document.getElementById("id").value;
    const jsonData = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        id_status: document.getElementById("status").value,
    };

    // Datos para el fetch
    const method = id ? "PUT" : "POST";
    if(id) jsonData.id = id;
    
    // Gardar o actualizar los elementos en la base de datos
    await fetch(`${API_URL}/subject/`, {
        method: method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => search())
    .catch(error => console.error('Ha ocurrido un error: ', error));

    // Comentado puede que temporalmente
    //document.getElementById("modal-box").remove();
};

// Exportar a PDF
document.getElementById("export-pdf").addEventListener("click", () => exportPDF());

function exportPDF() {
    // const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    // const data = new Object;
    // for(const element of elements) {
        // data[element.id.replace("filter-","")] = element.value;
    // }
    // window.open("../TABLE-TO-PDF.html");

    const ElementToPDF = document.querySelector(".container");
    const dateNow = new Date();
    const dateString = `${dateNow.getFullYear()}-${dateNow.getMonth()+1}-${dateNow.getDate()}`;

    const setOptions = {
        margin: 1,
        filename: `Asignaturas-${dateString}.pdf`,
        image: { type: 'jpeg', quality: 0.98},
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a3", orientation: 'portrait' }
    };
    html2pdf().from(ElementToPDF).set(setOptions).save();
}