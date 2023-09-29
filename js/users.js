//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

// Al cargar el archivo, obtener todos los registros de la tabla subject
window.addEventListener("load", async () => await loadData());

async function loadData(){
  await fetch(`${API_URL}/user`)
  .then(response => response.json())
  .then(data => dataTable(data))
  .catch(err => err);
}

async function levels(){

  const select = document.getElementById("filter-permission");
  select.innerHTML = "";

  const startOption = new Option("Select a permission", "");
  select.add(startOption);

  await fetch(`${API_URL}/level`)
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

document.getElementById('search').addEventListener('click', async () => await search());

async function search() {
  const elements = document.querySelectorAll(".filter-container input, select");
  const data = {};
  for (const element of elements) {
    data[element.id.replace("filter-", "")] = element.value;
  }

  await fetch(`${API_URL}/user/?username=${data["username"]}&role=${data["role"]}&id_status=${data["status"]}`)
  .then(response => response.json())
  .then(data => dataTable(data))
  .catch(error => console.log(error));
}

async function dataTable(data) {

  const table = document.querySelector("tbody");
  table.innerHTML = "";
  const selectLevel = document.getElementById("filter-permission");
  const dataLevel = new Object();
  for (const option of selectLevel.options) {
    dataLevel[option.value] = option.innerText;
  }

  // Crear boton de view
  const button = document.createElement('button');
  button.innerHTML = "Ver más";
  button.className = "view-button";

  const dataStatus = {
    "-1": "Eliminado",
    "0": "No disponible",
    "1": "Disponible"
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
    level.innerHTML = dataLevel[element.level?.id] ?? "No select";
  
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

  await fetch(`${API_URL}/user/?id=${id}`)
  .then(response => response.json())
  .then(data => createModalBox(data[0]))
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
  img.src = "../source/users.jpeg";
  
  var spanId = document.createElement("span");
  spanId.textContent = "id";
  spanId.className = "id";

  var inputId = document.createElement("input");
  inputId.type = "text";
  inputId.id = "id";
  inputId.className = "id";
  inputId.placeholder = "id";
  inputId.value = data?.id ?? "";

  var spanUsername = document.createElement("span");
  spanUsername.textContent = "Username";

  var inputUsername = document.createElement("input");
  inputUsername.type = "text";
  inputUsername.id = "username";
  inputUsername.placeholder = "username";
  inputUsername.value = data?.username ?? "";
  
  var spanRole = document.createElement("span");
  spanRole.textContent = "Role";

  var selectRole = document.getElementById("filter-permission");
  selectRole = selectRole.cloneNode(true);
  selectRole.remove(0);
  selectRole.id = "level";
  selectRole.value = data?.level?.id ?? "";
  
  if(!data?.password){
    var spanPassword = document.createElement("span");
    spanPassword.textContent = "password";

    var inputPassword = document.createElement("input");
    inputPassword.type = "text";
    inputPassword.id = "password";
    inputPassword.placeholder = "password";
  }

  var spanStatus = document.createElement("span");
  spanStatus.textContent = "Status";

  var selectStatus = document.createElement("select");
  selectStatus.id = "status";
  var options = [
      {value: -1, label: "Eliminado"},
      {value: 0, label: "No disponible"},
      {value: 1, label: "Disponible"}
  ];

  // Configurar los elementos
  for (var option of options) {
      selectStatus.add(new Option(option.label, option.value));
  }
  selectStatus.value = data?.id_status ?? 1;

  var inputSubmit = document.createElement("input");
  inputSubmit.addEventListener("click", async () => await save());
  inputSubmit.type = "submit";
  inputSubmit.id = "save";
  inputSubmit.value = "Actualizar";
  
  // Agregar los elementos al DOM
  modalContent.appendChild(img);

  cardContent.appendChild(spanId);
  cardContent.appendChild(inputId);
  
  cardContent.appendChild(spanUsername);
  cardContent.appendChild(inputUsername);

  cardContent.appendChild(spanRole);
  cardContent.appendChild(selectRole);

  if(!data?.password){
    cardContent.appendChild(spanPassword);
    cardContent.appendChild(inputPassword);
  }

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
  const id = document.getElementById("id").value;
  const dataUser = {
    username: document.getElementById("username").value,
    level: document.getElementById("level").value,
    id_status: document.getElementById("status").value,
  }

  const method = id ? "PUT" : "POST";
  if(id) jsonData.id = id;

  // Gardar los elementos en la base de datos
  await fetch(`${API_URL}/user`, {
      method: method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dataUser)
  })
  .then(response => response.json())
  .then(data => search())
  .catch(error => console.error('Ha ocurrido un error: ', error));
};