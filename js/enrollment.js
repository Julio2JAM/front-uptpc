//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

// Agregar evento de click para mostrar una lista con todas las secciones activas.
document.getElementById("classroom").addEventListener("click", async () => await createModalList());

// Crear modal box con el nombre de las secciones activas.
async function createModalList(data){

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

    //
    const title = document.createElement("h3");
    title.innerHTML = "Seleccione una seccion.";
    cardContent.appendChild(title);

    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerHTML = "Classrooms";

    fieldset.appendChild(legend);
    cardContent.appendChild(fieldset);

    modalContent.appendChild(cardContent);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
        if(event.target.id === "modal-box"){
            event.target.remove();
        }
    });

    //const ul = document.createElement("ul");
    await fetch(`${API_URL}/classroom/`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {

            //const li = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            //li.appendChild(checkbox);

            const text = document.createElement("a");
            text.innerHTML = element.name;
            text.id = element.id;
            //li.appendChild(text);

            //const hr = document.createElement("hr");

            //ul.appendChild(li);
            fieldset.appendChild(text);
        });
        loadClassroomEvents();
        //fieldset.appendChild(ul);
    })
    .catch(error => error);

}

// Agregar eventos de click para a la lista de secciones, para obtener datos de la seccion seleccionada.
function loadClassroomEvents(){
    const a = document.querySelectorAll("fieldset a");
    a.forEach(a => a.addEventListener("click", async (event) => await loadData(event)));
}

// Cargar estudiantes de la seccion seleccionada
async function loadData(data) {
    document.getElementById("modal-box").remove();

    await fetch(`${API_URL}/enrollment/classroom/${data.target.id}/student`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);

}

function dataTable(data) {

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    const button = document.createElement("button");
    button.className = "view-button";
    button.innerText = "view";

    data.forEach(element => {
        const row = tbody.insertRow(-1);

        const id = row.insertCell(0);
        id.innerText = element.student.id;

        console.log(element);
        const name = row.insertCell(1);
        name.innerText = element.student.name ?? "No name";

        const lastname = row.insertCell(2);
        lastname.innerText = element.student.lastname ?? "No last name";

        const cedule = row.insertCell(3);
        cedule.innerText = element.student.cedule;
        
        const action = row.insertCell(4);
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

    await fetch(`http://localhost:3000/api/student/${id}`)
    .then(response => response.json())
    .then(data => {
        data.delete = true;
        createModalBox(data)
    })
    .catch(error => console.log(error));

}

document.getElementById("new").addEventListener("click", async () => await createModalBoxTable());

async function createModalBoxTable(){

    // Crear divs contenedores
    var modal = document.createElement("div");
    modal.className = "modal-box";
    modal.id = "modal-box";

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

    await fetch("http://localhost:3000/api/student/")
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
    

    var spanId = document.createElement("span");
    spanId.innerText = "ID";
    spanId.className = "id";
    var inputId = document.createElement("input");
    
    inputId.id = "id";
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
    inputName.disabled = true;

    cardContent.appendChild(spanName);
    cardContent.appendChild(inputName);
    
    // Lastname
    var spanLastname = document.createElement("span");
    spanLastname.innerHTML = "Last name";
    var inputLastname = document.createElement("input");
    inputLastname.type = "text";
    inputLastname.value = data?.lastname ?? "";
    inputLastname.disabled = true;

    cardContent.appendChild(spanLastname);
    cardContent.appendChild(inputLastname);

    // Cedule
    var spanCedule = document.createElement("span");
    spanCedule.innerText = "Cedule";
    var inputCedule = document.createElement("input");
    inputCedule.type = "text";
    inputCedule.value = data?.cedule ?? "";
    inputCedule.disabled = true;

    cardContent.appendChild(spanCedule);
    cardContent.appendChild(inputCedule);

    // Email
    var spanEmail = document.createElement("span");
    spanEmail.innerText = "Email";
    var inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.value = data?.email ?? "";
    inputEmail.disabled = true;

    cardContent.appendChild(spanEmail);
    cardContent.appendChild(inputEmail);

    // Phone
    var spanPhone = document.createElement("span");
    spanPhone.innerText = "Phone";
    var inputPhone = document.createElement("input");
    inputPhone.type = "text";
    inputPhone.value = data?.phone ?? "";
    inputPhone.disabled = true;


    cardContent.appendChild(spanPhone);
    cardContent.appendChild(inputPhone);

    // Save
    var inputSubmit = document.createElement("input");
    inputSubmit.id = (data.delete) ? "delete" : "save";
    inputSubmit.type = "submit";
    inputSubmit.value = (data.delete) ? "Delete from this classroom" : "Save";
    inputSubmit.addEventListener("click", async () => await enrollmentData((data.delete) ? "delete" : "save"));

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

async function enrollmentData (action){

    if(action === "delete"){

        var method = "PUT";
        var data = {
            id:document.getElementById("id").value,
            status_id:0
        };

    }else{

        var method = "POST";
        var data = {
            id_classroom:document.getElementById("id-classroom").value,
            id_student:document.getElementById("id-student").value,
        };

    }

    await fetch(`http://localhost:3000/enrollment/`, {
        method: method,
        headers: {"Content-type": "application/json"},
        body: data
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => error);

}

document.querySelectorAll(".card-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});