document.querySelectorAll(".card-content button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});

window.addEventListener('load', async () => await loadData());

async function loadData() {

    await fetch("http://localhost:3000/api/student/")
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);

}

function dataTable(data) {

    const table = document.getElementById('tbody');
    table.innerHTML = "";
    
    const statusData = {
        "-1": "Eliminado",
        "0": "No disponible",
        "1": "Disponible"
    };

    const button = document.createElement("button");
    button.className = "view-button";
    button.innerText = "Ver más";

    data.forEach(element => {
        const row = table.insertRow(-1);

        const id = row.insertCell(0);
        id.innerText = element.id;

        const name = row.insertCell(1);
        name.innerText = element.person.name;

        const lastname = row.insertCell(2);
        lastname.innerText = element.person.lastname ?? "";

        const cedule = row.insertCell(3);
        cedule.innerText = element.person.cedule;

        const status = row.insertCell(4);
        status.innerText = statusData[element.id_status];
        
        const action = row.insertCell(5);
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
    .then(data => createModalBox(data))
    .catch(error => console.log(error));

}

document.getElementById("new").addEventListener("click", () => createModalBox(null));

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
    img.src = "source/students.jpeg";
    modalContent.appendChild(img);
    
    // Id
    var spanId = document.createElement("span");
    spanId.innerText = "ID";
    spanId.className = "id";
    var inputId = document.createElement("input");
    inputId.type = "text";
    inputId.className = "id";
    inputId.value = data?.person.id ?? "";

    cardContent.appendChild(spanId);
    cardContent.appendChild(inputId);

    // Name
    var spanName = document.createElement("span");
    spanName.innerText = "Name";
    var inputName = document.createElement("input");
    inputName.type = "text";
    inputName.placeholder = "name";
    inputName.value = data?.person.name ?? "";

    cardContent.appendChild(spanName);
    cardContent.appendChild(inputName);
    
    // Lastname
    var spanLastname = document.createElement("span");
    spanLastname.innerHTML = "Last name";
    var inputLastname = document.createElement("input");
    inputLastname.type = "text";
    inputLastname.placeholder = "Last name";
    inputLastname.value = data?.person.lastname ?? "";

    cardContent.appendChild(spanLastname);
    cardContent.appendChild(inputLastname);

    // Cedule
    var spanCedule = document.createElement("span");
    spanCedule.innerText = "Cedule";
    var inputCedule = document.createElement("input");
    inputCedule.type = "text";
    inputCedule.placeholder = "Cedule";
    inputCedule.value = data?.person.cedule ?? "";

    cardContent.appendChild(spanCedule);
    cardContent.appendChild(inputCedule);
    
    // Email
    var spanEmail = document.createElement("span");
    spanEmail.innerText = "Email";
    var inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.placeholder = "email";
    inputEmail.value = data?.person.email ?? "";

    cardContent.appendChild(spanEmail);
    cardContent.appendChild(inputEmail);

    // Phone
    var spanPhone = document.createElement("span");
    spanPhone.innerText = "Phone";
    var inputPhone = document.createElement("input");
    inputPhone.type = "text";
    inputPhone.placeholder = "Phone number";
    inputPhone.value = data?.person.phone ?? "";

    cardContent.appendChild(spanPhone);
    cardContent.appendChild(inputPhone);
    
    // Status
    var spanStatus = document.createElement("span");
    spanStatus.innerText = "Status";
    var selectStatus = document.createElement("select");
    var options = [
        {value: -1, label: "Eliminado"},
        {value: 0, label: "No disponible"},
        {value: 1, label: "Disponible"}
    ];
    for (var option of options) {
        selectStatus.add(new Option(option.label, option.value));
    }
    selectStatus.value = data?.person.id_status ?? "";

    cardContent.appendChild(spanStatus);
    cardContent.appendChild(selectStatus);

    // Save
    var inputSubmit = document.createElement("input");
    inputSubmit.id = "save";
    inputSubmit.type = "submit";
    inputSubmit.value = "Actualizar";
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
