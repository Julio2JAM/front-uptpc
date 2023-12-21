const API_URL = "http://localhost:3000/api";

const fields = [ 
    {
        field       : "id",
        translate   : "id",
        priority    : 1
    },
    {
        field       : "description",
        translate   : "Descripción",
        priority    : 2
    },
    {
        field       : "name",
        translate   : "Nombre",
        priority    : 2
    },
    {
        field       : "lastName",
        translate   : "Apellido",
        priority    : 3
    },
    {
        field       : "phone",
        translate   : "Telefono",
        priority    : 4
    },
    {
        field       : "email",
        translate   : "Correo electrónico",
        priority    : 5
    },
    {
        field       : "id_status",
        translate   : "Estado",
        priority    : 6
    },
    {
        field       : "datetime_start",
        translate   : "fecha de inicio",
        priority    : 7
    },
    {
        field       : "datetime_end",
        translate   : "fecha de cierre",
        priority    : 8
    },
    {
        field       : "datetime",
        translate   : "fecha de registro",
        priority    : 98
    },
    {
        field       : "datetime_update",
        translate   : "fecha de actualización",
        priority    : 99
    },
];


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

    fields.sort((a, b) => a.priority - b.priority);
    for (const value of fields) {
        if(!data[0][value.field]){
            continue;
        }
        const th = document.createElement("th");
        th.innerHTML = data[0][value.field];
        tr.appendChild(th);
    }
    thead.appendChild(tr);

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
        var cont = 0;
        for (const key in element) {
            const value = row.insertCell(cont);
            cont++;
            if(key == "id_status"){
                const statusSpan = document.createElement('span');
                statusSpan.innerHTML = statusData[element[key]];
                statusSpan.classList.add("status", statusClass[element[key]]);
                value.appendChild(statusSpan);
                continue;
            }else if(key == "datetime" || key == "datetime_update"){
                value.innerHTML = new Date(element[key]).toLocaleString();
                continue;
            }
            value.innerHTML = element[key];
        }
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
    // await html2pdf().from(ElementToPDF).set(setOptions).save();
    // window.close();
}