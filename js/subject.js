// Al cargar el archivo, obtener todos los registros de la tabla subject
window.addEventListener("load", async () => await loadSubject());

async function loadSubject(){
    await fetch(`http://localhost:3000/api/subject/`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => console.log("Conexion failed, try in some seconds"));
}

// Al hacer click en search, obtener el elemento name y llamar a la funcion search
document.getElementById("search").addEventListener("click", async () => await search());

// Funcion para buscar un registro en la tabla search
async function search(){

    // Obtener los de los elementos de busqueda su contenido
    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = new Object;
    for(const element of elements) {
        console.log(element);
        data[element.id] = element.value;
    }

    var url = `http://localhost:3000/api/subject/name/${data["name"]}/description/${data["description"]}/status/${data["status"]}`;
    url = url.replace(/\/\//g, "/");

    await fetch(url)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);
}

function dataTable(data) {

    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

    const selectStatus = document.createElement("select");
    const options = [
        {value: -1, label: "Deleted"},
        {value: 0, label: "Unavailable"},
        {value: 1, label: "Available"}
    ];

    for (const option of options) {
        selectStatus.add(new Option(option.label, option.value));
    }

    data.forEach(element => {
        // Insertar en la ultima posicion
        const row = tableBody.insertRow(-1);

        const id = row.insertCell(0);
        id.innerHTML = element.id;

        const name = row.insertCell(1);
        name.innerHTML = element.name;

        const description = row.insertCell(2);
        description.innerHTML = element.description;

        const status = row.insertCell(3);
        const clonedSelect = selectStatus.cloneNode(true);
        clonedSelect.value = element.id_status;
        status.appendChild(clonedSelect);

        const action = row.insertCell(4);
    });
}

document.getElementById("new").addEventListener("click", () => {

    // Crear divs contenedores
    var modal = document.createElement("div");
    modal.className = "modal-box";
    modal.id = "modal-box";

    var modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.id = "modal-content";

    var cardContent = document.createElement("div");
    cardContent.className = "card-content";
    cardContent.id = "card-content";

    // Crear elementos del DOM
    var img = document.createElement("img");
    img.src = "source/subject2.jpeg";

    var fieldset1 = document.createElement("fieldset");
    var legend1 = document.createElement("legend");
    var select1 = document.createElement("select");
    var span11 = document.createElement("span");
    var span12 = document.createElement("span");
    var span13 = document.createElement("span");
    var input11 = document.createElement("input");
    var input12 = document.createElement("input");
    var option = document.createElement("option");

    var fieldset2 = document.createElement("fieldset");
    var legend2 = document.createElement("legend");
    var select2 = document.createElement("select");
    var option2_1 = document.createElement("option");
    var input2 = document.createElement("input");
    
    // Configurar los elementos
    legend1.textContent = "Data subject";
    span11.textContent = "Name";
    input11.type = "text";
    input11.id = "name";
    input11.placeholder = "name";
    
    span13.textContent = "Status";
    option.value = "";
    option.text = "Select a status";


    span12.textContent = "Description";
    input12.type = "text";
    input12.id = "Description";
    input12.placeholder = "Description";
    
    legend2.textContent = "Search subject";
    option2_1.value = "0";
    option2_1.textContent = "Selecciona un tema";
    select2.appendChild(option2_1);
    input2.type = "submit";
    input2.id = "search";
    input2.value = "search";
    
    // Agregar los elementos al DOM
    select1.appendChild(option);
    modalContent.appendChild(img);

    fieldset1.appendChild(legend1);

    fieldset1.appendChild(span11);
    fieldset1.appendChild(input11);

    fieldset1.appendChild(span12);
    fieldset1.appendChild(input12);

    fieldset1.appendChild(span13);
    fieldset1.appendChild(select1);
    
    cardContent.appendChild(fieldset1);

    fieldset2.appendChild(legend2);
    fieldset2.appendChild(select2);
    fieldset2.appendChild(input2);
    cardContent.appendChild(fieldset2);

    modalContent.appendChild(cardContent);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
});

/*
// Obtener el elemento "save" y agregarle un evento
document.getElementById("save").addEventListener("click", async () => {
    // Obtener los elementos "name" y "description"
    let name = document.getElementById("name");
    let description = document.getElementById("description");
    let id_status = document.getElementById("status");

    // Gardar los elementos en la base de datos
    await fetch("http://localhost:3000/api/subject/postOrUpdate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({name:name.value, description: description.value, id_status: id_status.value})
    })
    .then(response => response.json())
    .then(data => {
        console.log('Datos guardados: ', data);
        loadSubject();
    })
    .catch(error => console.error('Ha ocurrido un error: ', error));
    
});
*/