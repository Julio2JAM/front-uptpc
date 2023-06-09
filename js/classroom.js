window.addEventListener("load", async () => await loadData());

async function loadData(){

    await fetch("http://localhost:3000/api/classroom/")
    .then(response => response.json())
    .then(data => dataTable(data))
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
        
        const id = row.insertCell(0);
        id.innerHTML = element.id ?? "";

        const name = row.insertCell(1);
        name.innerHTML = element.name ?? "test";

        const datetimeStart = row.insertCell(2);
        datetimeStart.textContent = element.datetime_start ?? "No datetime start";

        const datetimeEnd = row.insertCell(3);
        datetimeEnd.textContent = element.datetime_end ?? "No datetime end";

        const status = row.insertCell(4);
        status.textContent = statusData[element.id_status] ?? "";

        const view = row.insertCell(5);
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
    const id = row.cells[0].innerHTML;

    await fetch(`http://localhost:3000/api/classroom/${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data))
    .catch(error => console.error(error));

}

document.getElementById("new").addEventListener("click", () => createModalBox(null));

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
        {value: -1, label: "Deleted"},
        {value: 0, label: "Unavailable"},
        {value: 1, label: "Available"}
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
    const jsonData = {
        name:name.value, 
        datetime_start:datetime_start.value, 
        datetime_end:datetime_end.value,
        id_status:status.value
    };

    if(id){

        let tableBody = document.querySelector("tbody");
        for (const row of tableBody.rows) {
            if(row.cells[0].innerText == id.value){
                let updateRow = row;
                break;
            }
        }

        jsonData.id = id.value;
    }

    await fetch("http://localhost:3000/api/classroom", {
        method: method,
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
            id:id.value,
            name:name.value, 
            datetime_start:datetime_start.value, 
            datetime_end:datetime_end.value,
            id_status:status.value
        })
    })
    .then(response => response.json())
    .then(data => {

        const dataStatus = {
            "-1": "Deleted",
            "0": "Unavailable",
            "1": "Available"
        };
    
        updateRow.cells[1].innerText = data.name;
        updateRow.cells[2].innerText = data.datetime_start ?? "No datetime available";
        updateRow.cells[3].innerText = data.datetime_end ?? "No datetime available";
        updateRow.cells[4].innerText = dataStatus[data.datetime_end];

    })
    .catch(error => console.log(error));

}