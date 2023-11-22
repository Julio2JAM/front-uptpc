API_URL = 'http://localhost:3000/api'


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
    await fetch(`${API_URL}/enrollment/?idStudent=${1}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            const text = document.createElement("span");
            text.innerHTML = element.classroom.name;
            text.id = element.id;

            fieldset.appendChild(text);
        });
        searchByClassroom();
    })
    .catch(error => error);

}

//
window.addEventListener('load', async () => await loadData(null));

//
async function loadData(enrollment) {
    const filters = document.querySelectorAll('.filter-container input, select');
    const data = new Object();
    for (const element of filters) {
        data[element.id.replace("filter-","")] = element.value;
    }

    await fetch(`${API_URL}/enrollment/program/?enrollment=${enrollment ?? 2}&subjectName=${data.subject}&professorName=${data.professor}&status=${data.status}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(err => console.error(err))
}

function dataTable(data){
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = "";

    const status = {
        "-1": "Eliminado",
        "0" : "No disponible",
        "1" : "Disponible"
    };

    data.forEach( (element) => {
        const row = tbody.insertRow(-1);

        const cellID = row.insertCell(0);
        cellID.innerHTML = element.id;

        const cellProfessor = row.insertCell(1);
        cellProfessor.innerHTML = element.professor.person.name + " " + element.professor.person.lastName;

        const cellSubject = row.insertCell(2);
        cellSubject.innerHTML = element.subject.name;

        const cellStatus = row.insertCell(3);
        cellStatus.innerHTML = status[element.id_status];

        const cellAction = row.insertCell(4);
        const btnDetail = createButtons("Ver mas", "view-button", `btn-detail-${element.id}`, detail)
        const btnActivity = createButtons("Actividades", "view-button", `btn-activity-${element.id}`, detail)

        cellAction.appendChild(btnDetail);
        cellAction.appendChild(btnActivity);
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
    await fetch(`${API_URL}/program/?id=${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data))
    .catch(err => console.error(err))
}

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

    // Title
    var labelTitle = document.createElement("label");
    labelTitle.for = "title";
    labelTitle.innerHTML = "Titulo:";
    var inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.id = "title";
    inputTitle.placeholder = "Titulo";
    // inputTitle.value = data?.person.name ?? "";

    form.appendChild(labelTitle);
    form.appendChild(inputTitle);
    
    // Description
    var labelDescription = document.createElement("label");
    labelDescription.for = "description";
    labelDescription.innerHTML = "Descripcion:";
    var inputDescription = document.createElement("input");
    inputDescription.type = "text";
    inputDescription.id = "description";
    inputDescription.placeholder = "Descripcion";
    // inputDescription.value = data?.person.lastName ?? "";

    form.appendChild(labelDescription);
    form.appendChild(inputDescription);

    // Porcentage
    var labelPorcentage = document.createElement("label");
    labelPorcentage.for = "porcentage";
    labelPorcentage.innerHTML = "Porcentaje:";
    var inputPorcentage = document.createElement("input");
    inputPorcentage.type = "text";
    inputPorcentage.id = "porcentage";
    inputPorcentage.placeholder = "porcentaje";
    // inputPorcentage.value = data?.person.cedule ?? "";
    
    form.appendChild(labelPorcentage);
    form.appendChild(inputPorcentage);

    // Base
    var labelBase = document.createElement("label");
    labelBase.for = "Base";
    labelBase.innerHTML = "Base:";
    var inputBase = document.createElement("input");
    inputBase.type = "text";
    inputBase.id = "base";
    inputBase.placeholder = "Base";
    // inputBase.value = data?.person.phone ?? "";

    form.appendChild(labelBase);
    form.appendChild(inputBase);

    // datetimeStart
    var labelDatetimeStart = document.createElement("label");
    labelDatetimeStart.for = "datetimestart";
    labelDatetimeStart.innerHTML = "Fecha de inicio:";
    var inputDatetimeStart = document.createElement("input");
    inputDatetimeStart.type = "date";
    inputDatetimeStart.id = "datetime_start";
    inputDatetimeStart.value = data?.datetime_start ?? "";

    form.appendChild(labelDatetimeStart);
    form.appendChild(inputDatetimeStart);

    // datetimeEnd
    var labelDatetimeEnd = document.createElement("label");
    labelDatetimeEnd.for = "datetimesend";
    labelDatetimeEnd.innerHTML = "Fecha de cierre:";
    var inputDatetimeEnd = document.createElement("input");
    inputDatetimeEnd.type = "date";
    inputDatetimeEnd.id = "datetime_end";
    inputDatetimeEnd.value = data?.datetime_end ?? "";

    form.appendChild(labelDatetimeEnd);
    form.appendChild(inputDatetimeEnd);

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
    buttonReset.addEventListener("click", () => {
        inputId.value = data?.id ?? "";
        inputName.value = data?.person.name ?? "";
        inputLastname.value = data?.person.lastName ?? "";
        inputCedule.value = data?.person.cedule ?? "";
        inputPhone.value = data?.person.phone ?? "";
        inputEmail.value = data?.person.email ?? "";
        selectStatus.value = data?.id_status ?? 1;
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
