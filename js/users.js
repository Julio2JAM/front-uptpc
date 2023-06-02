window.addEventListener("load", async () => await loadData());

async function levels(){

  const select = document.getElementById("filter-permission");
  select.innerHTML = "";

  const startOption = new Option("Select a permission", "");
  select.add(startOption);

  await fetch(`http://localhost:3000/api/level`)
  .then(response => response.json())
  .then(data => {
    data.forEach(element => {
      const option = new Option(element.name, element.id);
      select.add(option);
    });
  })
  .catch(err => err);

  return select;
}

async function loadData(){

  const selectLevel = await levels();
  const table = document.querySelector("tbody");

  var dataLevel = {};
  for (const option of selectLevel) {
    dataLevel[option.value] = option.textContent;
  }

  await fetch(`http://localhost:3000/api/user`)
  .then(response => response.json())
  .then(data => dataTable(data))
  .catch(err => err);

}

document.getElementById('search').addEventListener('click', async () => await search());

async function search() {

  const elements = document.querySelectorAll(".filter-container input, select");
  const data = {};
  for (const element of elements) {
    data[element.id.replace("filter-", "")] = element.value;
  }
  
  const url = `http://localhost/api/user/username/${data["username"]}/level/${data["level"]}/status/${data["status"]}`;
  url = url.replace(/\/\//g, "/");

  fetch(url)
  .then(response => response.json())
  .then(data => dataTable(data))
  .catch(error => console.log(error));
}

async function dataTable(data) {

  const table = document.querySelector("tbody");
  const selectLevel = document.getElementById("filter-permission");
  const dataLevel = new Object();
  for (const option of selectLevel.options) {
    dataLevel[option.value] = option.innerText;
  }

  // Crear boton de view
  const button = document.createElement('button');
  button.innerHTML = "View";
  button.className = "view-button";

  const dataStatus = {
    "-1": "Deleted",
    "0": "Unavailable",
    "1": "Available"
  };
  
  data.forEach( element => {

    // Insertar en la ultima posicion
    const row = table.insertRow(-1);
    row.className = "filter-item";//+element.id_level;
    
    // Crear columnas
    const id = row.insertCell(0);
    id.innerHTML = element.id;
  
    const username = row.insertCell(1);
    username.innerHTML = element.username;
  
    const level = row.insertCell(2);
    level.innerHTML = dataLevel[element.id_level] ?? "No select";
  
    const status = row.insertCell(3);
    status.innerHTML = dataStatus[element.id_status];
  
    const view = row.insertCell(4);
    view.appendChild(button.cloneNode(true));
    
  });

  addEvents();
}

// Agregar evento de click a todos los botones de view
function addEvents(){
  const buttons = document.querySelectorAll("tbody button");
  buttons.forEach(button => button.addEventListener("click", event => detail(event)));
}

// Obtener todos los datos de un elemento
async function detail(event){

  const row = event.target.closest('tr');
  const id = row.cells[0].textContent;

  await fetch(`http://localhost:3000/api/user/${id}`)
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
  img.src = "source/users.jpeg";
  
  var spanId = document.createElement("span");
  var inputId = document.createElement("input");

  var spanUsername = document.createElement("span");
  var inputUsername = document.createElement("input");
  
  var spanLevel = document.createElement("span");
  var selectLevel = document.getElementById("filter-permission");
  selectLevel = selectLevel.cloneNode(true);

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
  
  spanUsername.textContent = "Username";
  inputUsername.type = "text";
  inputUsername.id = "username";
  inputUsername.placeholder = "username";
  inputUsername.value = data?.username ?? "";
  
  spanLevel.textContent = "Level";
  selectLevel.id = "level";
  selectLevel.value = data?.id_level ?? "";

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
  
  cardContent.appendChild(spanUsername);
  cardContent.appendChild(inputUsername);

  cardContent.appendChild(spanLevel);
  cardContent.appendChild(selectLevel);

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
  let name = document.getElementById("username").value;
  let description = document.getElementById("level").value;
  let id_status = document.getElementById("status").value;

  // Actulizar tabla dinamicamente, no terminado.
  let updateRow = "";
  if(id){
      let tableBody = document.querySelector("tbody");
      for (const row of tableBody.rows) {
          if(row.cells[0].innerText === id){
              updateRow = row;
              break;
          }
      }
  }

  // Gardar los elementos en la base de datos
  await fetch("http://localhost:3000/api/user", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
          id:id,
          name:name, 
          description:description, 
          id_status:id_status
      })
  })
  .then(response => response.json())
  .then(data => {
      console.log('Datos guardados: ', data);

      if(updateRow){
      }else{
        loadSubject();
      }

  })
  .catch(error => console.error('Ha ocurrido un error: ', error));
  
};