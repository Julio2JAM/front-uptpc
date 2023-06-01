window.addEventListener("load", async () => await loadData());

const filter = document.querySelectorAll("filter-input");

// Funcion que recive dos datos, el elemento a validar, y el tipo de dato que se le permite escribir
function validateInput(event, type){
  let remplace = type == "char" ? /[^a-zA-Z]+$/ : /[^0-9]+$/;
  if (!remplace.test(event.target.value)) {
      event.target.value = event.target.value.replace(remplace, ''); // Eliminar caracteres no permitidos
  }
}

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
}

async function loadData(){

  const table = document.getElementById("table");
  const selectLevel = document.getElementById("filter-permission");

  const dataLevel = {};
  for (const option of selectLevel.options) {
    dataLevel[option.id] = option.value;
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

  await fetch(`http://localhost:3000/api/user`)
  .then(response => response.json())
  .then(data => {
    data.forEach(element => {
    
      const clonedSelect = selectLevel.cloneNode(true);
      clonedSelect.selectedIndex = (element.level !== null) ? element.level.id : 0;

      console.log("🚀 ~ file: users.js:40 ~ loadData ~ element:", element)
      // Insertar en la ultima posicion
      const row = table.insertRow(-1);
      row.className = "filter-item";//+element.id_level;
      
      // Crear columnas
      const id = row.insertCell(0);
      id.innerHTML = element.id;

      const username = row.insertCell(1);
      username.innerHTML = element.username;

      const level = row.insertCell(2);
      lastName.innerHTML = dataLevel[element.id_level] ?? "";

      const status = row.insertCell(3);
      status.innerHTML = dataStatus[element.id_status];

      const view = row.insertCell(4);
      view.appendChild(button.cloneNode(true));
    });
  })
  .catch(err => err);

}

// Agregar evento de click a todos los botones de view
function addEvents(){
  const buttons = document.querySelectorAll("tbody button");
  buttons.forEach(button => button.addEventListener("click", (event) => detail(event)));
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
