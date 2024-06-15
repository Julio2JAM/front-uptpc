const API_URL = "http://localhost:3000/api"
const token = sessionStorage.getItem('token');
var printData = [];

// Agregar evento de click para mostrar una lista con todas las secciones activas.
document.getElementById("select-classroon").addEventListener("click", async () => await createModalList());

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

    await fetch(`${API_URL}/enrollment/?idClassroom=${id}`,{
        method: 'GET',
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);

}

document.getElementById('search-filter-btn').addEventListener('click', async () => await search());
async function search() {

    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = {};
    for (const element of elements) {
        data[element.id.replace("filter-", "")] = element.value;
    }

    const idClassroom = document.getElementById("classroom").value;
    await fetch(`${API_URL}/enrollment/?idClassroom=${idClassroom}&id=${data["id"]}&personName=${data["name"]}&personLastName=${data["lastName"]}&personCedule=${data["cedule"]}&idStatus=${data["status"]}`, {
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => console.log(error));

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

// Agregar evento de click a todos los botones de view
function addEvents(){
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async(event) => await detail(event)));
}

// Obtener todos los datos de un elemento
async function detail(event){

    const row = event.target.closest('tr');
    const id = row.cells[0].textContent;

    await fetch(`${API_URL}/enrollment/?id=${id}`,{
        method: 'GET',
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(err => console.log(err));

}

function createModalBox(data){
    console.log(data);
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

    var form = document.createElement("form");

    const personData = [
        {
            id: "name",
            placeholder: "Nombre",
            value: data?.student?.person.name ?? "",
            disabled: true
        },
        {
            id: "lastname",
            placeholder: "Apellido",
            value: data?.student?.person.lastname ?? "",
            disabled: true
        },
        {
            id: "cedule",
            placeholder: "Cedula",
            value: data?.student?.person.cedule ?? "",
            disabled: true
        },
        {
            id: "phone",
            placeholder: "Phone",
            value: data?.student?.person.phone ?? "",
            disabled: true
        },
        {
            id: "email",
            placeholder: "Email",
            value: data?.student?.person.email ?? "",
            disabled: true
        }
    ];

    for (const value of personData) {
        const label = document.createElement("label");
        label.for = value.id;
        label.innerHTML = value.placeholder + ":";
        const input = document.createElement("input");
        Object.assign(input, value);
        form.appendChild(label);
        form.appendChild(input);
    }

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
    selectStatus.disabled = true;

    form.appendChild(labelStatus);
    form.appendChild(selectStatus);

    var section = document.createElement("section");
    section.appendChild(form);

    var buttonSubmit = document.createElement("button");
    buttonSubmit.addEventListener("click", async () => await closeModal());
    buttonSubmit.type = "button";
    buttonSubmit.id = "close";
    buttonSubmit.innerHTML = "Cerrar";

    var footer = document.createElement("footer");
    footer.appendChild(buttonSubmit);
    
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
