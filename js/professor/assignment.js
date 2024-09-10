API_URL = 'http://localhost:3000/api'
const token = sessionStorage.getItem('token');

if(!token){
    location.href = "../index.html";
}
document.getElementById("logout").addEventListener("click", logout);
function logout(){
    sessionStorage.removeItem('token');
    location.href = "../index.html";
}

// Cambiar de pagina.
document.querySelectorAll(".table-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});

//
window.addEventListener("load", async () => {
    await subject();
    await search();
});

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

document.getElementById("search-filter-btn").addEventListener("click", async () => await search());

//
async function search() {
    const filters = document.querySelectorAll('.filter-container input, select');
    const data = {};
    for (const element of filters) {
        data[element.id.replace("filter-","")] = element.value;
    }

    await fetch(`${API_URL}/assignment/?id=${data["id"]}&title=${data["title"]}&datetime_start=${data["datetime_start"]}&datetime_end=${data["datetime_end"]}&id_status=${data["status"]}`,{
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(err => console.log(err))
}

function dataTable(data){

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

    const dataFields = {
        id: null,
        title: "Sin nombre.",
        description: "Descripción vacia.",
        // base:"No asignado.",
        datetime_start:"No asignado.",
        datetime_end:"No asignado.",
    };

    data.forEach((element) => {
        const row = tbody.insertRow(-1);

        var iterator = 0;
        for (const key in dataFields){
            const cell = row.insertCell(iterator);
            cell.innerHTML = element[key] ?? dataFields[key];
            iterator++;
        }
        
        const cell = row.insertCell(1);
        cell.innerHTML = element.subject.name
        iterator++

        const status = row.insertCell(iterator);
        const statusSpan = document.createElement('span');
        statusSpan.innerText = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        status.appendChild(statusSpan);
        
        const action = row.insertCell(++iterator);
        action.appendChild(button.cloneNode(true));
    });

    addEvents();
}

// Agregar evento de click a todos los botones de view
function addEvents(){
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async(event) => await detail(event)));
}

async function detail(event) {
    const row = event.target.closest("tr");
    const id = row.cells[0].innerHTML;

    await fetch(`${API_URL}/assignment/?id=${id}`,{
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(err => console.error(err))
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
    
    // Crear titulo h3 e icono
    var h3 = document.createElement("h3");
    var img = document.createElement("img");
    img.src = "../../source/student-icon.png";

    h3.appendChild(img);
    h3.innerHTML += "Actividad";
    
    var buttonClose = document.createElement("button");
    buttonClose.className = "close-btn";
    buttonClose.innerHTML = "&times;"

    header.appendChild(h3);
    header.appendChild(buttonClose);

    var section = document.createElement("section");
    var form = document.createElement("form");

    const assignmentData = [
        {
            id: "id",
            placeholder: "ID",
            value: data?.id ?? "",
        },
        {
            id: "title",
            placeholder: "Titulo",
            value: data?.title ?? ""
        },
        {
            id: "description",
            placeholder: "Descripcion",
            value: data?.description ?? ""
        },
        /*{
            id: "porcentage",
            placeholder: "Porcentaje",
            value: data?.porcentage ?? ""
        },
        {
            id: "base",
            placeholder: "Base",
            value: data?.base ?? ""
        },*/
        {
            id: "datetimeStart",
            type: "date",
            placeholder: "Fecha de inicio",
            value: data?.datetime_start ?? ""
        },
        {
            id: "datetimeEnd",
            type: "date",
            placeholder: "Fecha de final",
            value: data?.datetime_end ?? ""
        }
    ];

    for (const value of assignmentData) {
        const label = document.createElement("label");
        label.for = value.id;
        label.innerHTML = value.placeholder + ":";
        const input = document.createElement("input");
        Object.assign(input, value);
        form.appendChild(label);
        form.appendChild(input);
    }
    form.querySelector('label').style.display = "none";
    form.querySelector('input').style.display = "none";

    const labelSubject = document.createElement("label");
    labelSubject.for = "subject";
    labelSubject.innerHTML = "Materia:";
    const selectSubject = document.getElementById("filter-subject").cloneNode(true);
    selectSubject.id = "idSubject";
    selectSubject.value = data?.subject?.id ?? "";

    form.appendChild(labelSubject);
    form.appendChild(selectSubject);
    
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
    section.appendChild(form);

    var footer = document.createElement("footer");

    var buttonSubmit = document.createElement("button");
    buttonSubmit.addEventListener("click", async () => {
        await save();
        closeModal();
    });
    buttonSubmit.type = "submit";
    buttonSubmit.id = "save";
    buttonSubmit.innerHTML = data?.id ? "Actualizar" : "Crear";
    footer.appendChild(buttonSubmit);

    var buttonReset = document.createElement("button");
    buttonReset.type = "reset";
    buttonReset.id = "reset";
    buttonReset.innerHTML = "Borrar";
    buttonReset.addEventListener("click", () => {
        inputTitle.value = data?.id ?? "";
        inputDescription.value = data?.person.name ?? "";
        inputPorcentage.value = data?.person.lastName ?? "";
        inputBase.value = data?.person.cedule ?? "";
        inputDatetimeStart.value = data?.person.phone ?? "";
        inputDatetimeEnd.value = data?.person.email ?? "";
        selectStatus.value = data?.id_status ?? 1;
    });
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
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        idSubject: document.getElementById("idSubject").value,
        // base: document.getElementById("description").value,
        datetime_start: !document.getElementById("datetimeStart").value ? null : document.getElementById("datetimeStart").value , 
        datetime_end: !document.getElementById("datetimeEnd").value ? null : document.getElementById("datetimeEnd").value,
        id_status: Number(document.getElementById("status").value),
    };

    // Datos para el fetch
    const method = id ? "PUT" : "POST";
    if(id) jsonData.id = id;
    
    // Gardar o actualizar los elementos en la base de datos
    await fetch(`${API_URL}/assignment/`, {
        method: method,
        headers: { 
            "content-type": "application/json",
            "authorization": "Bearer " + token,
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => search())
    .catch(error => console.error('Ha ocurrido un error: ', error));

    // Comentado puede que temporalmente
    //document.getElementById("modal-box").remove();
};