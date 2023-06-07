window.addEventListener("load", async () => await loadData());

async function loadData(){

    await fetch("http://localhost:3000/api/classroom/")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => error);

}

function dataTable(data){

    const tbody = document.querySelector("tbody");
    const statusData = {
        "-1": "Deleted",
        "0": "Unavailable",
        "1": "Available"
    };

    const button = document.createElement("button");
    button.className = "view-button";
    button.innerText = "View";

    for (const element of data) {
        
        const row = tbody.insertRow(-1);
        
        const name = row.insertCell(0);
        name.textContent = element.name ?? "";

        const datetimeStart = row.insertCell(1);
        datetimeStart.textContent = element.datetime_start ?? "";

        const datetimeEnd = row.insertCell(2);
        name.textContent = element.datetime_end ?? "";

        const status = row.insertCell(3);
        status.textContent = statusData[element.id_status] ?? "";

        const view = row.insertCell(4);
        view.appendChild(button.cloneNode(true));

    }

    addEvents();
}

function addEvents(){
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async (event) => await detail(event)));
}

async function detail(event) {

    const row = event.target.closest("tr");
    const id = row.cells[0];

    await fetch(`https://localhost:3000/api/classroom/${id}`)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

}

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
    img.src = "source/classroom2.jpeg";
    modalContent.appendChild(img);
    
    // Id
    var spanId = document.createElement("span");
    spanId.innerText = "ID";
    spanId.className = "id";
    var inputId = document.createElement("input");
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

    cardContent.appendChild(spanName);
    cardContent.appendChild(inputName);

    // datetimeStart
    var spanDatetimeStart = document.createElement("span");
    spanDatetimeStart.innerHTML = "Datetime end";
    var inputDatetimeStart = document.createElement("input");
    inputDatetimeStart.type = "date";
    inputDatetimeStart.value = data?.datetime_end ?? "";

    cardContent.appendChild(spanDatetimeStart);
    cardContent.appendChild(inputDatetimeStart);
    
    // datetimeEnd
    var spanDatetimeEnd = document.createElement("span");
    spanDatetimeEnd.innerHTML = "Datetime end";
    var inputDatetimeEnd = document.createElement("input");
    inputDatetimeEnd.type = "date";
    inputDatetimeEnd.value = data?.datetime_end ?? "";

    cardContent.appendChild(spanDatetimeEnd);
    cardContent.appendChild(inputDatetimeEnd);
    
    // Status
    var spanStatus = document.createElement("span");
    spanStatus.innerText = "Status";
    var selectStatus = document.createElement("select");
    var options = [
        {value: -1, label: "Deleted"},
        {value: 0, label: "Unavailable"},
        {value: 1, label: "Available"}
    ];
    for (var option of options) {
        selectStatus.add(new Option(option.label, option.value));
    }
    selectStatus.value = data?.id_status ?? "";

    cardContent.appendChild(spanStatus);
    cardContent.appendChild(selectStatus);

    // Save
    var inputSubmit = document.createElement("input");
    inputSubmit.id = "save";
    inputSubmit.type = "submit";
    inputSubmit.value = "Save";
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

async function save(){

    const id  = document.getElementById("id");
    const name  = document.getElementById("name");
    const datetime_start  = document.getElementById("datetime_start");
    const datetime_end  = document.getElementById("datetime_end");
    const status  = document.getElementById("status");

    const method = id ? "PUT" : "POST";
    var jsonData = {
        name:name, 
        datetime_start:datetime_start, 
        datetime_end:datetime_end,
        id_status:status
    };

    await fetch("http://localhost:3000/api/classroom", {
        method: "method",
        headers: {"content-type": "application/json"},
        body: JSON.stringify()
    })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error);

}