const API_URL = "http://localhost:3000/api";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

for (const [value, key] of urlParams) {
    console.log(value, key);
}


if(!urlParams.has("model")){

}

getData();
async function getData(){
    await fetch(`${API_URL}/${urlParams.get("model")}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(err => err);
}

function dataTable(data) {

    // console.log(Object.keys(data[0]));
    // return
    console.log(data[0]);

    const thead = document.querySelector("thead");
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
  
    data.forEach( element => {
  
        const row = tbody.insertRow(-1);

        const id = row.insertCell(0);
        id.innerHTML = element.id;

        const name = row.insertCell(1);
        name.innerHTML = element.name;

        const description = row.insertCell(2);
        description.innerHTML = element.description;

        const status = row.insertCell(3);
        const statusSpan = document.createElement('span');
        statusSpan.innerHTML = statusData[element.id_status];
        statusSpan.classList.add("status", statusClass[element.id_status]);
        status.appendChild(statusSpan);

        const datetime = row.insertCell(4);
        datetime.innerHTML = new Date(element.datetime).toLocaleString();

        const datetime_update = row.insertCell(5);
        datetime_update.innerHTML = new Date(element.datetime_update).toLocaleString();
    });
  
    savePDF()
}

function savePDF(){
    const ElementToPDF = document.body;
    const dateNow = new Date();
    const dateString = `${dateNow.getFullYear()}-${dateNow.getMonth()+1}-${dateNow.getDate()}`;

    const setOptions = {
        margin: 1,
        filename: `Asignaturas-${dateString}.pdf`,
        image: { type: 'jpeg', quality: 0.98},
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: "in", format: "a3", orientation: 'portrait' }
    };
    html2pdf().from(ElementToPDF).set(setOptions).save();
}