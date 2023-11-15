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
  const elements = document.querySelector(".filter-container").querySelectorAll("input, select");
  const data = {};
  for (const element of elements) {
    data[element.id.replace("filter-", "")] = element.value;
  }

  console.log(data);

  await fetch(`${API_URL}/user/?username=${data["username"]}&role=${data["role"]}&id_status=${data["status"]}`)
  .then(response => response.json())
  .then(data => dataTable(data))
  .catch(error => console.log(error));

}

async function dataTable(data) {

  const table = document.querySelector("tbody");
  table.innerHTML = "";
  const selectLevel = document.getElementById("filter-role");
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
    level.innerHTML = dataLevel[element.level?.id] ?? "No posee";
  
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

  var labelId = document.createElement("label");
  labelId.for = "id";
  labelId.innerHTML = "ID:";
  labelId.style.display = "none";
  var inputId = document.createElement("input");
  inputId.type = "text";
  inputId.id = "id";
  inputId.placeholder = "ID";
  inputId.value = data?.id ?? "";
  inputId.style.display = "none";

  var section = document.createElement("section");
  var form = document.createElement("form");

  var labelUser = document.createElement("label");
  labelUser.for = "username";
  labelUser.innerHTML = "Usuario:";
  var inputUser = document.createElement("input");
  inputUser.type = "text";
  inputUser.id = "username";
  inputUser.placeholder = "Usuario";
  inputUser.value = data?.username ?? "";
  
  /*
  var labelPassword = document.createElement("label");
  labelPassword.for = "password";
  labelPassword.innerHTML = "Contraseña:";
  var inputPassword = document.createElement("input");
  inputPassword.type = "text";
  inputPassword.id = "password";
  inputPassword.placeholder = "Contraseña";
  inputPassword.value = data?.password ?? "";
  */
  
  var labelPerson = document.createElement("label");
  labelPerson.for = "person";
  labelPerson.innerHTML = "Propietario:";
  var inputPerson = document.createElement("input");
  inputPerson.type = "text";
  inputPerson.id = "person";
  inputPerson.placeholder = "Propietario";
  inputPerson.value = data?.person?.id ? data?.person?.name + " " + data?.person?.lastName : "";
  inputPerson.addEventListener("click", () => createModalBoxTable(data?.person?.id));

  var labelRole = document.createElement("label");
  labelRole.for = "role";
  labelRole.innerHTML = "Permisos:";
  var selectRole = document.getElementById("filter-role");
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
  
  form.appendChild(labelId);
  form.appendChild(inputId);

  form.appendChild(labelUser);
  form.appendChild(inputUser);

  // form.appendChild(labelPassword);
  // form.appendChild(inputPassword);

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

async function createModalBoxTable(idPerson = ""){

  // Crear divs contenedores
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "modal-table";

  const container = document.createElement("div");
  container.className = "container";

  const tableContainer = document.createElement("div");
  tableContainer.className = "table-container fixed";

  //
  const header = document.createElement("header");
  header.className = "filter-container";
  const form = document.createElement("form");

  const inputId = document.createElement("input");
  inputId.id = "filter-id";
  inputId.type = "text";
  inputId.placeholder = "Filtrar por id";
  inputId.value = idPerson;

  const inputName = document.createElement("input");
  inputName.id = "filter-nombre";
  inputName.type = "text";
  inputName.placeholder = "Filtrar por nombre";

  const inputLastname = document.createElement("input");
  inputLastname.id = "filter-lastname";
  inputLastname.type = "text";
  inputLastname.placeholder = "Filtrar por apellido";

  const inputCedule = document.createElement("input");
  inputCedule.id = "filter-cedule";
  inputCedule.type = "text";
  inputCedule.placeholder = "Filtrar por ";

  const buttonSearch = document.createElement("button");
  buttonSearch.id = "search";
  buttonSearch.className = "filter-button active";
  buttonSearch.innerHTML = "Filter";
  
  const filterButtonContainer = document.createElement("div");
  filterButtonContainer.className = "filter-btn-container";

  const search = document.createElement("button");
  search.type = "button";
  search.id = "search-filter-btn";
  search.innerHTML = "Filtrar";
  const reset = document.createElement("button");
  reset.type = "reset";
  reset.id = "reset-filter-btn";
  reset.innerHTML = "Borrar";

  //
  filterButtonContainer.appendChild(search);
  filterButtonContainer.appendChild(reset);

  // Agregar elementos al contenedor
  form.appendChild(inputId);
  form.appendChild(inputName);
  form.appendChild(inputLastname);
  form.appendChild(inputCedule);
  form.appendChild(filterButtonContainer);

  //
  header.appendChild(form);

  //
  tableContainer.appendChild(header);

  const section = document.createElement("section");
  section.className = "table-overflow";

  // Crear un elemento <table>, un elemento <thead> y un elemento <tbody>
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  const tbody = document.createElement("tbody");

  const thID = document.createElement("th");
  thID.innerHTML = "ID"
  const thName = document.createElement("th");
  thName.innerHTML = "Nombres"
  const thLastname = document.createElement("th");
  thLastname.innerHTML = "Apellidos"
  const thCedule = document.createElement("th");
  thCedule.innerHTML = "Cedula"
  const thState = document.createElement("th");
  thState.innerHTML = "Estado"
  const thAction = document.createElement("th");
  thAction.innerHTML = "Acción"

  // Agregar las celdas de encabezado a la fila de encabezado
  trHead.appendChild(thID);
  trHead.appendChild(thName);
  trHead.appendChild(thLastname);
  trHead.appendChild(thCedule);
  trHead.appendChild(thState);
  trHead.appendChild(thAction);

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

  await fetch(`${API_URL}/person/?id=${idPerson}`)
  .then(response => response.json())
  .then(data => {
      data.forEach(element => {
          const row = tbody.insertRow(-1);

          const id = row.insertCell(0);
          id.innerText = element.id;

          const name = row.insertCell(1);
          name.innerText = element.name;

          const lastname = row.insertCell(2);
          lastname.innerText = element.lastName ?? "";

          const cedule = row.insertCell(3);
          cedule.innerText = element.cedule;
          
          const status = row.insertCell(4);
          const statusSpan = document.createElement('span');
          statusSpan.innerHTML = statusData[element.id_status];
          statusSpan.classList.add("status", statusClass[element.id_status]);
          status.appendChild(statusSpan);
          
          const action = row.insertCell(5);
          action.append(createButtonAssign(element.id));
      });
  })
  .catch(error => error);

  // Agregar la fila de encabezado al elemento <thead>
  thead.appendChild(trHead);

  // Agregar el elemento <thead> y <tbody> a la tabla
  table.appendChild(thead);
  table.appendChild(tbody);

  //
  section.appendChild(table);
  tableContainer.appendChild(section);

  //
  const footer = document.createElement("footer");
  const closeButton = document.createElement("button");
  closeButton.id = "close";
  closeButton.className = "change-button";
  closeButton.innerHTML = "Salir";

  //
  footer.appendChild(closeButton);
  tableContainer.appendChild(footer);

  container.appendChild(tableContainer);
  modal.appendChild(container);

  document.body.appendChild(modal);

  closeButton.addEventListener("click", closeModal);
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

function createButtonAssign(id){
  const button = document.createElement("button");
  button.innerHTML = "Asignar";
  button.className = "new";
  button.addEventListener("click", async () => await assignPerson(id));
  return button;
}

async function assignPerson(id) {
  await fetch(`${API_URL}/user/`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: document.getElementById("id").value,
      person:id
    })
  })
  .then(response => response.json)
  .then(data => console.log(data))
  .catch(error => console.error('Ha ocurrido un error: ', error));

  const modalTable = document.getElementById("modal-table");
  modalTable.classList.add("close-modal");
  setTimeout(() => {
      modalTable.style.display = "none";
      modalTable.classList.remove("close-modal");
      modalTable.remove();
  }, 260);
}

// Obtener el elemento "save" y agregarle un evento
async function save (){
  // Obtener los elementos "name" y "description"
  const id = document.getElementById("id").value;
  const jsonData = {
    username: document.getElementById("username").value,
    id_role: document.getElementById("level").value,
    id_status: Number(document.getElementById("status").value),
  }

  const method = id ? "PUT" : "POST";
  if(id) jsonData.id = id;

  // Gardar los elementos en la base de datos
  await fetch(`${API_URL}/user`, {
      method: method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(jsonData)
  })
  .then(response => response.json())
  .then(data => search())
  .catch(error => console.error('Ha ocurrido un error: ', error));
};