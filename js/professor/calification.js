const API_URL = "http://localhost:3000/api"
const token = sessionStorage.getItem('token');
var printData = [];

if(!token){
    location.href = "../index.html";
}
document.getElementById("logout").addEventListener("click", logout);
function logout(){
    sessionStorage.removeItem('token');
    location.href = "../index.html";
}

// Agregar evento de click para mostrar una lista con todas las secciones activas.
document.getElementById("select-classroon").addEventListener("click", async () => await createModalList("classroom", null));

// Crear modal box con el nombre de las secciones activas.
async function createModalList(type, classroom){

    // const validateModalMenu = document.getElementById("modal-menu");
    const div = document.createElement("div");
    div.id = "modal-menu";
    div.className = "modal-menu";

    const ul = document.createElement("ul");
    ul.id = "classList";

    let url = `${API_URL}/program/`;

    if(type != "classroom"){
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
                a.addEventListener("click", () => createModalList("subject", element.classroom.id))
            }else{
                a.innerHTML = element.subject.name;
                a.addEventListener("click", () => loadClassroomEvents(element.subject.id, classroom, element.classroom.name))
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
async function loadClassroomEvents(subject, classroom, name){

    await fetch(`${API_URL}/assignment_entry/assignment_students/?idClassroom=${classroom}&idSubject=${subject}`,{
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
    .then(data => async () => await dataTable(data))
    .catch(error => console.log(error));

}

// Cargar registros en la tabla HTML
async function dataTable(data) {

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    const thead = document.querySelector("thead").querySelector('tr');

    const thList = thead.querySelectorAll("th");
    thList.forEach(th => th.remove());

    // Cedula 
    const thCI = document.createElement("th");
    thCI.innerHTML = "CEDULA";
    thead.appendChild(thCI);

    // Nombre
    const thName = document.createElement("th");
    thName.innerHTML = "NOMBRE";
    thead.appendChild(thName);

    const arrayInputs = [];
    const arrayAssignmentEntries = [];
    data.assignment_entry.forEach(element => {

        const th = document.createElement("th");
        th.innerHTML = element?.title;
        thead.appendChild(th);

        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = element?.base;
        input.id = element?.id;

        arrayAssignmentEntries.push(element?.id);
        arrayInputs.push(input);

    });

    const arrayEnrollment = [];
    data.student.forEach(element => {
        const row = tbody.insertRow(-1);
        row.insertCell(0).innerText = element?.cedule;      //1
        row.insertCell(1).innerText = element?.fullName;    //2

        for (const key in arrayInputs) {
            const inputCloned = arrayInputs[key].cloneNode(true);
            inputCloned.id = `S${element?.id}-A${inputCloned.id}`
            row.insertCell(key+2).appendChild(inputCloned);
        }
        arrayEnrollment.push(element.id);
    });

    const evaluations = await fetch(`${API_URL}/evaluation/assignmentEntries/?assignmentEntries=${arrayAssignmentEntries.join()}&enrollments=${arrayEnrollment.join()}`, {
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error));

    const loadBtn = document.getElementById('new');
    loadBtn.addEventListener("click", async () => await load());

    if(!evaluations || !Array.isArray(evaluations)){
        return;
    }

    for (const value of evaluations) {
        const input = document.getElementById(`S${value?.enrollment}-A${value.assignment_entry}`);
        input.value = value.grade;
    }

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

            if(!input.value && !input.value !== "0"){
                continue;
            }

            const [idEnrollment, idAssignmentEntry] = input.id.split('-');
            
            if(!idEnrollment || !idAssignmentEntry){
                continue;
            }
            if(input.id.startsWith('A')){
                [idEnrollment, idAssignmentEntry] = [idAssignmentEntry, idStudent];
            }

            const data = {
                idEnrollment: idEnrollment.slice(1),
                idAssignmentEntry: idAssignmentEntry.slice(1),
                grade: input.value,
            }
            califications.push(data);

        }

    }

    await fetch(`${API_URL}/evaluation/all`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
            "data": JSON.stringify(califications),
        })
    })
    .then(response => response.json())
    .then(data => search())
    .catch(error => console.error('Ha ocurrido un error: ', error));
}
