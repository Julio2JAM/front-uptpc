// Al cargar el archivo, obtener todos los registros de la tabla subject
window.addEventListener("load", async () => await loadSubject());

// Obtener todos los registros de la tabla
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

    // Obtener de los elementos de busqueda su contenido
    const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
    const data = new Object;
    for(const element of elements) {
        data[element.id.replace("filter-","")] = element.value;
    }

    const validateData = Object.values(data).every(value => !value);
    if(validateData){
        await loadSubject();
        return;
    }

    // En caso de no enviar algun dato, remplazar // por /
    var url = `http://localhost:3000/api/subject/name/${data["name"]}/description/${data["description"]}/status/${data["status"]}`;
    url = url.replace(/\/\//g, "/");

    console.log(url);
    // Obtener los datos de la busqueda
    await fetch(url)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);
}

// Funcion para llenar la tabla
function dataTable(data) {

    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

    const statusData = {
        "-1": "Deleted",
        "0": "Unavailable",
        "1": "Available"
    };

    // Crear boton de view
    const button = document.createElement('button');
    button.innerHTML = "View";
    button.className = "view-button";

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
        status.innerHTML = statusData[element.id_status];

        const action = row.insertCell(4);
        action.appendChild(button.cloneNode(true));
    });

    addEvents();
}

// Agregar evento de click a todos los botones de view
function addEvents(){
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async (event) => await detail(event)));
}

// Obtener todos los datos de un elemento
async function detail(event){

    const row = event.target.closest('tr');
    const id = row.cells[0].textContent;

    await fetch(`http://localhost:3000/api/subject/${id}`)
    .then(response => response.json())
    .then(data => createModalBox(data))
    .catch(err => console.error(err));

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
    img.src = "source/subject2.jpeg";
    
    var spanId = document.createElement("span");
    var inputId = document.createElement("input");

    var spanName = document.createElement("span");
    var inputName = document.createElement("input");
    
    var spanDescription = document.createElement("span");
    var inputDescription = document.createElement("input");
    
    var spanStatus = document.createElement("span");
    var selectStatus = document.createElement("select");
    var options = [
        {value: -1, label: "Deleted"},
        {value: 0, label: "Unavailable"},
        {value: 1, label: "Available"}
    ];

    var inputSubmit = document.createElement("input");
    inputSubmit.addEventListener("click", async () => await save());

    // Configurar los elementos
    spanId.textContent = "id";
    spanId.className = "id";
    inputId.type = "text";
    inputId.id = "id";
    inputId.className = "id";
    inputId.placeholder = "id";
    inputId.value = data?.id ?? "";
    
    spanName.textContent = "Name";
    inputName.type = "text";
    inputName.id = "name";
    inputName.placeholder = "name";
    inputName.value = data?.name ?? "";
    
    spanDescription.textContent = "Description";
    inputDescription.type = "text";
    inputDescription.id = "description";
    inputDescription.placeholder = "Description";
    inputDescription.value = data?.description ?? "";
    
    spanStatus.textContent = "Status";
    selectStatus.id = "status";
    for (var option of options) {
        selectStatus.add(new Option(option.label, option.value));
    }
    selectStatus.value = data?.id_status ?? 1;

    inputSubmit.type = "submit";
    inputSubmit.id = "save";
    inputSubmit.value = "save";
    
    // Agregar los elementos al DOM
    modalContent.appendChild(img);

    cardContent.appendChild(spanId);
    cardContent.appendChild(inputId);
    
    cardContent.appendChild(spanName);
    cardContent.appendChild(inputName);

    cardContent.appendChild(spanDescription);
    cardContent.appendChild(inputDescription);

    cardContent.appendChild(spanStatus);
    cardContent.appendChild(selectStatus);

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

// Obtener el elemento "save" y agregarle un evento
async function save (){
    // Obtener los elementos "name" y "description"
    let id = document.getElementById("id").value;
    let name = document.getElementById("name").value;
    let description = document.getElementById("description").value;
    let id_status = document.getElementById("status").value;

    // Actulizar tabla dinamicamente, no terminado.
    let updateRow = "";
    if(id){
        const method = "PUT";

        let tableBody = document.querySelector("tbody");
        for (const row of tableBody.rows) {
            if(row.cells[0].innerText === id){
                updateRow = row;
                break;
            }
        }

        const jsonData = {
            id:id,
            name:name, 
            description:description, 
            id_status:id_status
        };

    }else{
        const method = "POST";
        const jsonData = {
            name:name, 
            description:description, 
            id_status:id_status
        };
    }

    // Gardar los elementos en la base de datos
    await fetch("http://localhost:3000/api/subject", {
        method: method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Datos guardados: ', data);
        loadSubject();
    })
    .catch(error => console.error('Ha ocurrido un error: ', error));
    
};