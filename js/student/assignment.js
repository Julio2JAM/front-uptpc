API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');

// Agregar evento de click para mostrar una lista con todas las secciones activas.
document.getElementById("classroom").addEventListener("click", async () => await createModalList());

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
            a.innerHTML = element?.name;
            a.addEventListener("click", () => loadData(element.id))

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

//
window.addEventListener('load', async () => await loadData(null));

//
async function loadData(enrollment) {
    const filters = document.querySelectorAll('.filter-container input, select');
    const data = new Object();
    for (const element of filters) {
        data[element.id.replace("filter-","")] = element.value;
    }

    await fetch(`${API_URL}/enrollment/program/?enrollment=${enrollment}&subjectName=${data.subject}&professorName=${data.professor}&status=${data.status}`)
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

// Funcion para crear el modal box
function createModalBox(data) {

    // Crear divs contenedores
    const modal = document.createElement("div");
    modal.className = "modal-box";
    modal.id = "modal-box";

    const modalContent = document.createElement("div");
    modalContent.className = "horizontal-card";
    modalContent.id = "modal-content";

    const cardContent = document.createElement("div");
    cardContent.className = "card-content";
    cardContent.id = "card-content";

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    data.forEach(element => {

        const rowPName = tbody.insertRow(0);
        const pNameTitle = rowPName.insertCell(0);
        pNameTitle.innerHTML = "Nombre:";
        const pName = rowPName.insertCell(1);
        pName.innerHTML = element.professor.person.name;

        const rowPPhone = tbody.insertRow(1);
        const pPhoneTitle = rowPPhone.insertCell(0);
        pPhoneTitle.innerHTML = "Telefono:";
        const pPhone = rowPPhone.insertCell(1);
        pPhone.innerHTML = element.professor.person.phone;

        const rowPEmail = tbody.insertRow(2);
        const pEmailTitle = rowPEmail.insertCell(0);
        pEmailTitle.innerHTML = "Email:";
        const pEmail = rowPEmail.insertCell(1);
        pEmail.innerHTML = element.professor.person.email;
        
        const rowSName = tbody.insertRow(3);
        const sNameTitle = rowSName.insertCell(0);
        sNameTitle.innerHTML = "Materia:";
        const sName = rowSName.insertCell(1);
        sName.innerHTML = element.subject.name;
    });

    table.appendChild(tbody);
    cardContent.appendChild(table);
    modalContent.appendChild(cardContent);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
        if(event.target.id === "modal-box"){
            event.target.remove();
        }
    });

}
