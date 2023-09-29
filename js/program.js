//Importar la constante con la URL utilizado para hacer peticiones a la API
//import { API_URL } from './globals.js';
const API_URL = "http://localhost:3000/api"

// Agregar evento de click para mostrar una lista con todas las secciones activas.
document.getElementById("classroom").addEventListener("click", async () => await createModalList());

// Crear modal box con el nombre de las secciones activas.
async function createModalList(data){

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

    //
    const title = document.createElement("h3");
    title.innerHTML = "Seleccione una seccion.";
    cardContent.appendChild(title);

    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerHTML = "Classrooms";

    fieldset.appendChild(legend);
    cardContent.appendChild(fieldset);

    modalContent.appendChild(cardContent);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
        if(event.target.id === "modal-box"){
            event.target.remove();
        }
    });

    //const ul = document.createElement("ul");
    await fetch(`${API_URL}/classroom/`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {

            //const li = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            //li.appendChild(checkbox);

            const text = document.createElement("a");
            text.innerHTML = element.name;
            text.id = element.id;
            //li.appendChild(text);

            //const hr = document.createElement("hr");

            //ul.appendChild(li);
            fieldset.appendChild(text);
        });
        loadClassroomEvents();
        //fieldset.appendChild(ul);
    })
    .catch(error => error);

}

// Agregar eventos de click para a la lista de secciones, para obtener datos de la seccion seleccionada.
function loadClassroomEvents(){
    const a = document.querySelectorAll("fieldset a");
    a.forEach(a => a.addEventListener("click", async (event) => await loadData(event)));
}

document.querySelectorAll(".card-content button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.hred = `${element.id.replace("-change", "")}.html`;
    });
});
