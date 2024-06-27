const API_URL = "http://localhost:3000/api"
const token = sessionStorage.getItem('token');
var printData = [];

// Agregar evento de click para mostrar una lista con todas las secciones activas.
document.getElementById("select-classroon").addEventListener("click", async () => await createModalList("classroom"));

// Crear modal box con el nombre de las secciones activas.
async function createModalList(type){

    // const validateModalMenu = document.getElementById("modal-menu");
    const div = document.createElement("div");
    div.id = "modal-menu";
    div.className = "modal-menu";

    const ul = document.createElement("ul");
    ul.id = "classList";

    let url = `${API_URL}/program/`;

    if(type != "classroom"){
        const classroom = document.getElementById("classroom").value;
        url = `${API_URL}/program/?idClassroom=${classroom}`;
    }

    await fetch(url,{
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const li = document.createElement("li");
            const a = document.createElement("a");

            if(type == "classroom"){
                a.innerHTML = element.classroom.name;
                a.addEventListener("click", () => createModalList("subject"))
            }else{
                a.innerHTML = element.subject.name;
                a.addEventListener("click", () => loadClassroomEvents(element.classroom.id, element.classroom.name))
            }

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

    await fetch(`${API_URL}/assignment_entry/assignment_students/?idClassroom=${id}`,{
        method: 'GET',
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);

}

document.getElementById('search-filter-btn').addEventListener('click', async () => await search());
async function search() {

    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = {};
    for (const element of elements) {
        data[element.id.replace("filter-", "")] = element.value;
    }

    const idClassroom = document.getElementById("classroom").value;
    await fetch(`${API_URL}/enrollment/?idClassroom=${idClassroom}&id=${data["id"]}&personName=${data["name"]}&personLastName=${data["lastName"]}&personCedule=${data["cedule"]}&idStatus=${data["status"]}`, {
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => console.log(error));

}

// Cargar registros en la tabla HTML
function dataTable(data) {

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    const thead = document.querySelector("thead").querySelector('tr');

    const arrayInputs = [];
    data.assignment_entry.forEach(element => {

        const th = document.createElement("th");
        th.innerHTML = element?.assignment.title;
        thead.appendChild(th);

        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = element?.base;
        input.id = element?.id;

        arrayInputs.push(input);

    });

    data.student.forEach(element => {
        const row = tbody.insertRow(-1);
        row.insertCell(0).innerText = element?.cedule;      //1
        row.insertCell(1).innerText = element?.fullName;    //2

        for (const key in arrayInputs) {
            const inputCloned = arrayInputs[key].cloneNode(true);
            inputCloned.id = `S${element?.id}-A${inputCloned.id}`
            row.insertCell(key+2).appendChild(inputCloned);
        }
    });

    const loadBtn = document.getElementById('new');
    loadBtn.addEventListener("click", async () => await load());
}

async function load(){

    const tbody = document.querySelector("tbody");
    const trArray = tbody.querySelectorAll("tr");

    if(trArray.length == 0){
        return;
    }

    const califications = [];
    for (const tr of trArray) {

        const inputs = tr.querySelectorAll("input");
        if(inputs.length == 0){
            continue;
        }

        for (const input of inputs) {
            
            if(!input.id || !input.id.includes('S') || !input.id.includes('A')){
                continue;
            }

            const [idStudent, idAssignmentEntry] = input.id.split('-');
            
            if(!idStudent || !idAssignmentEntry){
                continue;
            }
            if(input.id.startsWith('A')){
                [idStudent, idAssignmentEntry] = [idAssignmentEntry, idStudent];
            }

            const data = {
                idStudent: idStudent.slice(1),
                idAssignmentEntry: idAssignmentEntry.slice(1),
                value: input.value,
            }
            califications.push(data);

        }

    }
    
    await fetch(`${API_URL}/evaluation/all`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
            "data": califications,
        })
    })
    .then(response => response.json())
    .then(data => search())
    .catch(error => console.error('Ha ocurrido un error: ', error));
}
