API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');


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
document.getElementById("select-classroon").addEventListener("click", async () => await createModalList());

// Crear modal box con el nombre de las secciones activas.
async function createModalList(){

    const div = document.createElement("div");
    div.id = "modal-menu";
    div.className = "modal-menu";

    const ul = document.createElement("ul");
    ul.id = "classList";

    //const ul = document.createElement("ul");
    await fetch(`${API_URL}/enrollment/`, {
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.innerHTML = element?.classroom.name;
            a.addEventListener("click", () => loadClassroomEvents(element.classroom.id))

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

function dataTable(data){

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

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

    data.forEach( (element) => {
        const row = tbody.insertRow(-1);

        row.insertCell(0).innerHTML = element.id;
        row.insertCell(1).innerHTML = element.assignment.subject.name;
        row.insertCell(2).innerHTML = element.assignment.title;
        row.insertCell(3).innerHTML = element.assignment.description;
        row.insertCell(4).innerHTML = element.assignment.datetime_start;
        row.insertCell(5).innerHTML = element.assignment.datetime_end;

        const status = row.insertCell(6);
        const statusSpan = document.createElement('span');
        statusSpan.innerText = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        status.appendChild(statusSpan);
        
        const cellAction = row.insertCell(7);
        const btnDetail = createButtons("Ver mas", "view-button", `btn-detail-${element.id}`, detail)
        cellAction.appendChild(btnDetail);
    });
}

function createButtons(innerText, className, id, clickCb){
    const btn = document.createElement("button");
    btn.innerText = innerText;
    btn.className = className;
    btn.id = id;
    const idReplace = id.split('-').pop();
    btn.addEventListener("click", () => clickCb(idReplace))
    return btn;
}

async function detail(id) {
    await fetch(`${API_URL}/assignment_enrollment/?id=${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(err => console.error(err))
}

// Funcion para crear el modal box
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

    const closebBtn = document.createElement("button");
    closebBtn.addEventListener("click", () => closeModal());
    closebBtn.type = "button";
    closebBtn.id = "close";
    closebBtn.innerHTML = "Cerrar";

    var footer = document.createElement("footer");
    footer.appendChild(closebBtn);
    
    section.appendChild(form);
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

document.getElementById('search-filter-btn').addEventListener('click', async () => await search());
async function search() {

    const classroom = document.getElementById("classroom").value;
    if(!classroom){
        return;
    }

    const filters = document.querySelectorAll('.filter-container input, select');
    const data = new Object();
    for (const element of filters) {
        data[element.id.replace("filter-","")] = element.value;
    }

    await fetch(`${API_URL}/assignment_enrollment/?idClassroom=${classroom}&idSubject=${data?.subject}&professorName=${data.professor}&status=${data.status}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(err => console.error(err))

}