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
            const option = new Option(element.subject.name, element.subject.id);
            select.add(option);
        });
    })
    .catch(err => console.log(err))
}

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

    await fetch(`${API_URL}/enrollment/`,{
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(element => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.innerHTML = element.classroom.name;
            a.addEventListener("click", () => loadClassroomEvents(element.id, element.classroom.name))

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

    await fetch(`${API_URL}/evaluation/?idEnrollment=${id}`,{
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

    const statusData = {
        "-1": {
            text:"Eliminado",
            class:"deleted",
        },
        "0": {
            text:"No disponible",
            class:"unavailable",
        },
        "1": {
            text:"Disponible",
            class:"available",
        }
    };

    data.forEach(element => {

        const row = tbody.insertRow(-1);
        row.insertCell(0).innerText = element.id;
        row.insertCell(1).innerText = element.assignment_entry.assignment.subject.name
        row.insertCell(2).innerText = element.assignment_entry.assignment.title
        row.insertCell(3).innerText = element.grade

        const statusSpan = document.createElement('span');
        statusSpan.innerText = statusData[element.id_status].text;
        statusSpan.classList.add("status", (statusData[element.id_status].class));
        row.insertCell(4).appendChild(statusSpan);

        const cellAction = row.insertCell(5);
        const btnDetail = createButtons("Ver mas", "view-button", `btn-detail-${element.assignment_entry.id}`, detail)
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
    await fetch(`${API_URL}/assignment_entry/?id=${id}`)
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

    // Crear elementos del DOM
    const h3 = document.createElement("h3");

    const img = document.createElement("img");
    img.src = "../../source/subject-icon.png";
    const buttonClose = document.createElement("button");
    buttonClose.className = "close-btn";
    buttonClose.innerHTML = "&times;"

    h3.appendChild(img);
    h3.innerHTML += "Calificaciones:";

    const header = document.createElement("header");
    header.appendChild(h3);
    header.appendChild(buttonClose);

    const section = document.createElement("section");
    const form = document.createElement("form");

    const assignmentData = [
        {
            id: "title",
            placeholder: "Titulo",
            value: data?.assignment.title ?? ""
        },
        {
            id: "description",
            placeholder: "Descripcion",
            value: data?.assignment.description ?? ""
        },
        {
            id: "base",
            placeholder: "Base",
            value: data?.base ?? ""
        },
        {
            id: "percentage",
            placeholder: "Porcentaje",
            value: data?.percentage ?? ""
        },
        {
            id: "datetimeStart",
            type: "date",
            placeholder: "Fecha de inicio",
            value: data?.assignment.datetime_start ?? ""
        },
        {
            id: "datetimeEnd",
            type: "date",
            placeholder: "Fecha de final",
            value: data?.assignment.datetime_end ?? ""
        }
    ];

    for (const value of assignmentData) {
        const label = document.createElement("label");
        label.for = value.id;
        label.innerHTML = value.placeholder + ":";
        const input = document.createElement("input");
        Object.assign(input, value);
        input.disabled = true;
        form.appendChild(label);
        form.appendChild(input);
    }

    const labelSubject = document.createElement("label");
    labelSubject.for = "subject";
    labelSubject.innerHTML = "Materia:";
    const selectSubject = document.getElementById("filter-subject").cloneNode(true);
    selectSubject.disabled = true;
    selectSubject.id = "idSubject";
    selectSubject.value = data?.assignment?.subject.id ?? "";

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
    selectStatus.disabled = true;

    form.appendChild(labelStatus);
    form.appendChild(selectStatus);
    section.appendChild(form);

    const closebBtn = document.createElement("button");
    closebBtn.addEventListener("click", () => closeModal());
    closebBtn.type = "button";
    closebBtn.id = "close";
    closebBtn.innerHTML = "Cerrar";

    var footer = document.createElement("footer");
    footer.appendChild(closebBtn);
    
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