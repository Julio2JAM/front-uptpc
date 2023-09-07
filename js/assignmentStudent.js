API_URL = 'https://localhost:3000/api/'

windows.addEventListener('load', async () => await loadData());

async function loadData() {
    const filters = document.querySelectorAll('.filter-container input, select');
    const data = new Object();
    for (const element of filters) {
        data[element.id.replace("filter-","")] = element.value;
    }

    await fetch(`${API_URL}/enrollment/program/?enrollment=1&subjectName=${subject}&professorName=${professor}`)
        .then(response => response.json())
        .then(data => console.log(data))
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

    const button = document.createElement("button");
    button.className = "view-button";
    button.innerText = "Ver más";

    data.array.forEach(element => {
        const row = tbody.insertRow(-1);

        const cellID = row.insertRow(0);
        cellID.innerHTML = element.id;

        const cellProfessor = row.insertCell(1);
        cellProfessor.innerHTML = element.professor.person.name + " " + element.professor.person.lastName;

        const cellSubject = row.insertCell(2);
        cellSubject.innerHTML = element.subject.name;

        const cellStatus = row.insertCell(3);
        cellStatus.innerHTML = status[element.status_id];

        const cellAction = row.insertCell(4);
        cellAction.appendChild(button.cloneNode(true));
    });
}

function addEvents(){
    const buttons = document.querySelectorAll('tbody button');
    buttons.forEach(button => button.addEventListener("click", async (event) => await detail(event)));
}

async function detail(event) {

    await fetch(`${API_URL}/enrollment/?id=${event.target.id}`)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.error(err))

}

// Funcion para crear el modal box
function createModalBox(data) {

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
    img.src = "../source/classroom2.jpeg";
    modalContent.appendChild(img);
    
    // Id
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
    inputName.id = "name";
    inputName.type = "text";
    inputName.value = data?.name ?? "";
    inputName.placeholder = "Name";

    cardContent.appendChild(spanName);
    cardContent.appendChild(inputName);

    // datetimeStart
    var spanDatetimeStart = document.createElement("span");
    spanDatetimeStart.innerHTML = "Datetime start";
    var inputDatetimeStart = document.createElement("input");
    inputDatetimeStart.id = "datetime_start";
    inputDatetimeStart.type = "date";
    inputDatetimeStart.value = data?.datetime_start ?? "";

    cardContent.appendChild(spanDatetimeStart);
    cardContent.appendChild(inputDatetimeStart);
    
    // datetimeEnd
    var spanDatetimeEnd = document.createElement("span");
    spanDatetimeEnd.innerHTML = "Datetime end";
    var inputDatetimeEnd = document.createElement("input");
    inputDatetimeEnd.id = "datetime_end";
    inputDatetimeEnd.type = "date";
    inputDatetimeEnd.value = data?.datetime_end ?? "";

    cardContent.appendChild(spanDatetimeEnd);
    cardContent.appendChild(inputDatetimeEnd);
    
    // Status
    var spanStatus = document.createElement("span");
    spanStatus.innerText = "Status";
    var selectStatus = document.createElement("select");
    var options = [
        {value: "", label: "Select a status"},
        {value: -1, label: "Eliminado"},
        {value: 0, label: "No disponible"},
        {value: 1, label: "Disponible"}
    ];
    for (var option of options) {
        selectStatus.add(new Option(option.label, option.value));
    }
    selectStatus.id = "status";
    selectStatus.value = data?.id_status ?? "";

    cardContent.appendChild(spanStatus);
    cardContent.appendChild(selectStatus);

    // Save
    var inputSubmit = document.createElement("input");
    inputSubmit.id = "save";
    inputSubmit.type = "submit";
    inputSubmit.value = !data?.id ? "Crear" : "Actualizar";
    inputSubmit.addEventListener("click", async () => await save());

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
