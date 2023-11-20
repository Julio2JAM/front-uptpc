const API_URL = "http://localhost:3000/api";

const field = {
    id              :   "id",
    name            :   "Nombre",
    lastName        :   "Apellido",
    phone           :   "Numero de telefono",
    email           :   "Correo electrónico",
    description     :   "Descripción",
    datetime_start  :   "fecha de inicio",
    datetime_end    :   "fecha de cierre",
    datetime        :   "fecha de registro",
    datetime_update :   "fecha de actualización",
    id_status       :   "Estado",
};

// const urlParams = new URLSearchParams(window.location.search);
// let query = Array.from(urlParams)
//     .filter(([key]) => key !== 'model')
//     .map(([key, value]) => `${key}=${value}`)
//     .join('&');

// query = "?" + query;

const urlParams = new URLSearchParams(window.location.search);
if(!urlParams.has("model")){
    window.close();
}
const model = urlParams.get("model"); 
urlParams.delete("model");
const query = urlParams.toString();

getData();
async function getData(){
    await fetch(`${API_URL}/${model}/?${query}`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(err => err);
}

function dataTable(data) {

    const thead = document.querySelector("thead");
    // const tr = document.createElement("tr");
    // for (const key in data[0]) {
    //     if(!field.hasOwnProperty(key)){
    //         continue;
    //     }

    // }

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

async function savePDF(){
    const ElementToPDF = document.body;
    const dateNow = new Date();
    const dateString = `${dateNow.getFullYear()}-${dateNow.getMonth()+1}-${dateNow.getDate()}`;

    const setOptions = {
        margin: 1,
        filename: `Asignaturas-${dateString}.pdf`,
        image: { type: 'jpeg', quality: 0.98},
        html2canvas: { scale: 3, letterRendering: true },
        jsPDF: { unit: "in", format: "a3", orientation: 'portrait' }
    };
    await html2pdf().from(ElementToPDF).set(setOptions).save();
    window.close();
}