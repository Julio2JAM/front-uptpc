API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');


document.getElementById("select-classroon").addEventListener("click", async () => await classroom());
async function classroom(){
    
    const div = document.createElement("div");
    div.id = "modal-menu";
    div.className = "modal-menu";

    const ul = document.createElement("ul");

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
            a.addEventListener("click", async () => await loadData(element.id))
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

async function loadData(idEnrollment){
    await fetch(`${API_URL}/enrollment/program/?enrollment=${idEnrollment}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(err => err)
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

    // Crear boton de view
    const button = document.createElement('button');
    button.innerHTML = "Ver más";
    button.className = "view-button";
    data.forEach(element => {
        const row = tbody.insertRow(-1);

        const id = row.insertCell(0);
        id.innerHTML = element.id;

        const profressor = row.insertCell(1);
        profressor.innerHTML = element.professor.person.name + ' ' + element.professor.person.lastName;

        const subject = row.insertCell(2);
        subject.innerHTML = element.subject.name;

        const status = row.insertCell(3);
        const statusSpan = document.createElement('span');
        statusSpan.innerHTML = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        status.appendChild(statusSpan);

        const action = row.insertCell(4);
        action.appendChild(button.cloneNode(true));
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

    await fetch(`${API_URL}/program/?id=${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data[0]))
    .catch(err => console.error(err));

}

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
    img.src = "../../source/professor2-icon.png";
    var buttonClose = document.createElement("button");
    buttonClose.className = "close-btn";
    buttonClose.innerHTML = "&times;"

    var section = document.createElement("section");
    var form = document.createElement("form");
    form.id = "modal-form";

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

    var labelProfessor = document.createElement("label");
    labelProfessor.for = "professor";
    labelProfessor.innerHTML = "Docente:";
    var inputProfessor = document.createElement("input");
    inputProfessor.type = "text";
    inputProfessor.id = "professor";
    inputProfessor.placeholder = "Docente";
    inputProfessor.value = data.professor.person?.name + " " + data.professor.person?.lastName;
    
    var labelSubject = document.createElement("label");
    labelSubject.for = "subject";
    labelSubject.innerHTML = "Asignatura:";
    var inputSubject = document.createElement("input");
    inputSubject.type = "text";
    inputSubject.id = "subject";
    inputSubject.placeholder = "Asignatura";
    inputSubject.value = data.subject.name;
    
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

    var footer = document.createElement("footer");

    /*
    var buttonSubmit = document.createElement("button");
    buttonSubmit.addEventListener("click", async () => {});
    buttonSubmit.type = "submit";
    buttonSubmit.id = "save";
    buttonSubmit.innerHTML = data?.id ? "Actualizar" : "Crear";

    var buttonReset = document.createElement("button");
    buttonReset.type = "reset";
    buttonReset.id = "reset";
    buttonReset.innerHTML = "Borrar";
    buttonReset.addEventListener("click", () => {
        inputId.value = data?.id ?? "";
        inputName.value = data?.name ?? "";
        inputDescription.value = data?.description ?? "";
        selectStatus.value = data?.id_status ?? 1;
    });
    */

    h3.appendChild(img);
    h3.innerHTML += "Asignatura";

    header.appendChild(h3);
    header.appendChild(buttonClose);
    
    form.appendChild(labelId);
    form.appendChild(inputId);

    form.appendChild(labelProfessor);
    form.appendChild(inputProfessor);

    form.appendChild(labelSubject);
    form.appendChild(inputSubject);

    form.appendChild(labelStatus);
    form.appendChild(selectStatus);

    section.appendChild(form);
    
    // footer.appendChild(buttonSubmit);
    // footer.appendChild(buttonReset);
    
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