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

document.getElementById('search-filter-btn').addEventListener('click', async () => await search());

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
    const statusSpan = document.createElement('span');
    statusSpan.innerHTML = statusData[element.id_status];
    statusSpan.classList.add("status", statusClass[element.id_status]);
    status.appendChild(statusSpan);

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
  modal.className = "modal";
  modal.id = "modal";

  var modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  var header = document.createElement("header");
  
  // Crear elementos del DOM
  var h3 = document.createElement("h3");
  var img = document.createElement("img");
  img.src = "../../source/user-icon.png";
  var buttonClose = document.createElement("button");
  buttonClose.className = "close-btn";
  buttonClose.innerHTML = "&times;"

  //
  // var spanId = document.createElement("span");
  // var inputId = document.createElement("input");
  // spanId.textContent = "id";
  // spanId.className = "id";
  // inputId.type = "text";
  // inputId.id = "id";
  // inputId.className = "id";
  // inputId.placeholder = "id";
  // inputId.value = data?.id ?? "";

  var section = document.createElement("section");
  var form = document.createElement("form");

  var labelUser = document.createElement("label");
  labelUser.for = "user";
  labelUser.innerHTML = "Usuario:";
  var inputUser = document.createElement("input");
  inputUser.type = "text";
  inputUser.id = "user";
  inputUser.placeholder = "Usuario";
  inputUser.value = data?.username ?? "";
  
  var labelPassword = document.createElement("label");
  labelPassword.for = "password";
  labelPassword.innerHTML = "Contraseña:";
  var inputPassword = document.createElement("input");
  inputPassword.type = "text";
  inputPassword.id = "password";
  inputPassword.placeholder = "Contraseña";
  inputPassword.value = data?.password ?? "";
  
  var labelPerson = document.createElement("label");
  labelPerson.for = "person";
  labelPerson.innerHTML = "Propietario:";
  var inputPerson = document.createElement("input");
  inputPerson.type = "text";
  inputPerson.id = "person";
  inputPerson.placeholder = "Propietario";
  inputPerson.value = data?.person?.id ?? "";

  var labelRole = document.createElement("label");
  labelRole.for = "role";
  labelRole.innerHTML = "Permisos:";
  var selectRole = document.getElementById("filter-permission");
  selectRole = selectRole.cloneNode(true);
  selectRole.remove(0);
  selectRole.id = "level";
  selectRole.value = data?.level?.id ?? "";

  var labelStatus = document.createElement("label");
  var selectStatus = document.createElement("select");
  var options = [
      {value: -1, label: "Eliminado"},
      {value: 0, label: "No disponible"},
      {value: 1, label: "Disponible"}
  ];
  labelStatus.textContent = "Estado";
  selectStatus.id = "status";
  for (var option of options) {
      selectStatus.add(new Option(option.label, option.value));
  }
  selectStatus.value = data?.id_status ?? 1;

  var footer = document.createElement("footer");

  var buttonSubmit = document.createElement("button");
  buttonSubmit.addEventListener("click", async () => await save());
  buttonSubmit.type = "submit";
  buttonSubmit.id = "save";
  buttonSubmit.innerHTML = data?.id ? "Actualizar" : "Crear";

  var buttonReset = document.createElement("button");
  buttonReset.type = "reset";
  buttonReset.id = "reset";
  buttonReset.innerHTML = "Borrar";

  h3.appendChild(img);
  h3.innerHTML += "User:";

  header.appendChild(h3);
  header.appendChild(buttonClose);
  
  form.appendChild(labelUser);
  form.appendChild(inputUser);

  form.appendChild(labelPassword);
  form.appendChild(inputPassword);

  form.appendChild(labelPerson);
  form.appendChild(inputPerson);

  form.appendChild(labelRole);
  form.appendChild(selectRole);

  form.appendChild(labelStatus);
  form.appendChild(selectStatus);

  section.appendChild(form);
  
  footer.appendChild(buttonSubmit);
  footer.appendChild(buttonReset);
  
  modalContent.appendChild(header);
  modalContent.appendChild(section);
  modalContent.appendChild(footer);

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  buttonClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
      if(event.target.id == "modal"){
          closeModal();
      }
  });

  function closeModal() {
      modal.classList.add("close-modal");
      setTimeout(() => {
          modal.style.display = "none";
          modal.classList.remove("close-modal");
          modal.remove();
      }, 260);
  }
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