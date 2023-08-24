API_URL = 'https://localhost:3000/api/'

document.getElementById('classroom').addEventListener('click', async (event) => await getClassroom());

//! OBTENER DE LA TABLA PROGRAM, LOS CLASSROOM Y LAS SUBJECTS, DESPUES, POR LA SUBJECT, COLOCAR A QUE CLASSROOM SE LE ASIGNARAN ACTIVIDADES O CALIFICACIONES

document.getElementById('subject').addEventListener('click', async () => await loadSubject());

async function loadSubject(){

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
    title.innerHTML = "Select a classroom";
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

    await fetch(`${API_URL}/program/classroom/professor/${UsuarioDelToken}/subject/`)
    .then(response => response.json())
    .response(data => {
        data.forEach(element => {
           console.log(element.subject);
        })
    })
    .catch(err => console.error(err));


}

document.getElementById('classroom').addEventListener('click', async () => await loadClassroom());

async function loadClassroom(){

    const id_subject = document.getElementById('subject');

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
    title.innerHTML = "Select a classroom";
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

    await fetch(`${API_URL}/program/classroom/professor/${UsuarioDelToken}/subject/${id_subject}`)
    .then(response => response.json())
    .response(data => {
        data.forEach(element => {
           console.log(element.element);
        })
    })
    .catch(err => console.error(err));

    //!
    await loadAssigments();
    await loadData();

}

async function loadAssigments(data) {

    const table = document.querySelector('thead').rows[0].cells;

    await fetch(`${API_URL}/assigment/program/${data}`)
    .then(response => response.json())
    .response(data => {
        data.forEach(element => {
            console.log(element);
        })
    })
    .catch(err => console.error(err));
}

// CARGAR LOS ESTUDIANTES, BUSCANDO SU ENROLLMENT, Y OBTENER DE CADA UNO, SUS ASSIGMENT_GRADE, COMPARAR EL ID DEL ASSIGMENT, CON EL ID QUE TENDRA EL THEAD, QUE SERA EL ASSIGMENT, Y DE ALLI, COLOCAR EL VALOR
async function loadData(data){
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = "";

    data.array.forEach(element => {
        
        const row = tbody.insertRow(-1);

        const cellName = row.insertCell(0);
        cellName.innerHTML = `${data?.name} ${row.lastname}`;
        
    });
}