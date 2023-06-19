//window.addEventListener('load', async () => await loadData());
document.getElementById("classroom").addEventListener("click", async () => await createModalList());

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

    //const ul = document.createElement("ul");
    await fetch("http://localhost:3000/api/classroom/")
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

function loadClassroomEvents(){
    const a = document.querySelectorAll("fieldset a");
    a.forEach(a => a.addEventListener("click", (event) => loadData(event)));
}

async function loadData(data) {
    document.getElementById("modal-box").remove();
    const classroom = 1;

    await fetch(`http://localhost:3000/api/enrollment/classroom/${data.target.id}/student`)
    .then(response => response.json())
    .then(data => dataTable(data))
    .catch(error => error);

}

function dataTable(data) {

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    const button = document.createElement("button");
    button.className = "view-button";
    button.innerText = "view";

    data.forEach(element => {
        const row = tbody.insertRow(-1);

        const id = row.insertCell(0);
        id.innerText = element.student.id;

        console.log(element);
        const name = row.insertCell(1);
        name.innerText = element.student.name ?? "No name";

        const lastname = row.insertCell(2);
        lastname.innerText = element.student.lastname ?? "No last name";

        const cedule = row.insertCell(3);
        cedule.innerText = element.student.cedule;
        
        const action = row.insertCell(4);
        action.appendChild(button.cloneNode(true));
    });

    addEvents();
}

function addEvents(){
    const buttons = document.querySelectorAll("tbody button");
    buttons.forEach(button => button.addEventListener("click", async (event) => await detail(event)));
}

async function detail(event){

    const row = event.target.closest("tr");
    const id = row.cells[0].textContent;

    await fetch(`http://localhost:3000/api/student/${id}`)
    .then(response => response.json())
    .then(data => {
        data.delete = true;
        createModalBox(data)
    })
    .catch(error => console.log(error));

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
    img.src = "source/students.jpeg";
    modalContent.appendChild(img);
    
    if(!data){
        // id_classroom
        // id_student
    }else{
        // Id
        var spanId = document.createElement("span");
        spanId.innerText = "ID";
        spanId.className = "id";
        var inputId = document.createElement("input");
        inputId.type = "text";
        inputId.className = "id";
        inputId.value = data?.id ?? "";
    
        cardContent.appendChild(spanId);
        cardContent.appendChild(inputId);
    }

    // Name
    var spanName = document.createElement("span");
    spanName.innerText = "Name";
    var inputName = document.createElement("input");
    inputName.type = "text";
    inputName.value = data?.name ?? "";

    cardContent.appendChild(spanName);
    cardContent.appendChild(inputName);
    
    // Lastname
    var spanLastname = document.createElement("span");
    spanLastname.innerHTML = "Last name";
    var inputLastname = document.createElement("input");
    inputLastname.type = "text";
    inputLastname.value = data?.lastname ?? "";

    cardContent.appendChild(spanLastname);
    cardContent.appendChild(inputLastname);

    // Cedule
    var spanCedule = document.createElement("span");
    spanCedule.innerText = "Cedule";
    var inputCedule = document.createElement("input");
    inputCedule.type = "text";
    inputCedule.value = data?.cedule ?? "";

    cardContent.appendChild(spanCedule);
    cardContent.appendChild(inputCedule);
    
    // Email
    var spanEmail = document.createElement("span");
    spanEmail.innerText = "Email";
    var inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.value = data?.email ?? "";

    cardContent.appendChild(spanEmail);
    cardContent.appendChild(inputEmail);

    // Phone
    var spanPhone = document.createElement("span");
    spanPhone.innerText = "Phone";
    var inputPhone = document.createElement("input");
    inputPhone.type = "text";
    inputPhone.value = data?.phone ?? "";

    cardContent.appendChild(spanPhone);
    cardContent.appendChild(inputPhone);

    // Save
    var inputSubmit = document.createElement("input");
    inputSubmit.id = (data.delete) ? "delete" : "save";
    inputSubmit.type = "submit";
    inputSubmit.value = (data.delete) ? "Delete from this classroom" : "Save";
    inputSubmit.addEventListener("click", async () => await enrollmentData((data.delete) ? "delete" : "save"));

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

async function enrollmentData (action){

    if(action === "delete"){

        var method = "PUT";
        var data = {
            id:document.getElementById("id").value,
            status_id:0
        };

    }else{

        var method = "POST";
        var data = {
            id_classroom:document.getElementById("id-classroom").value,
            id_student:document.getElementById("id-student").value,
        };

    }

    await fetch(`http://localhost:3000/enrollment/`, {
        method: method,
        headers: {"Content-type": "application/json"},
        body: data
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => error);

}

document.querySelectorAll(".card-container button[id*=change]").forEach(element => {
    element.addEventListener("click", () => {
        location.href = `${element.id.replace("-change", "")}.html`;
    });
});