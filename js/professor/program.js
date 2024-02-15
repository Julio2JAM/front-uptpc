//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"
const token = sessionStorage.getItem('token');

window.addEventListener("load", async () => await search());
document.getElementById('search-filter-btn').addEventListener('click', async () => await search());
async function search() {

    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = {};
    for (const element of elements) {
        data[element.id.replace("filter-", "")] = element.value;
    }

    await fetch(`${API_URL}/program/?subjectName=${data["subjectName"]}&subjectDescripcion=${data["subjectDescripcion"]}&classroomName=${data["classroomName"]}&idStatus=${data["status"]}`, {
        method: "GET",
        headers: {authorization: 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => console.log(error));

}

function dataTable(data) {

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    const button = document.createElement("button");
    button.className = "view-button";
    button.innerText = "Ver mas";

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

    data.forEach(element => {
        const row = tbody.insertRow(-1);

        const id = row.insertCell(0);
        id.innerText = element.id;

        const subject = row.insertCell(1);
        subject.innerText = element?.subject.name;

        const description = row.insertCell(2);
        description.innerText = element?.subject.description ?? "No posee descripcion.";

        const classroom = row.insertCell(3);
        classroom.innerText = element?.classroom.name;

        const status = row.insertCell(4);
        const statusSpan = document.createElement('span');
        statusSpan.innerText = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        status.appendChild(statusSpan);

        const datetime = row.insertCell(5);
        datetime.innerText = element?.datetime;
    });

}