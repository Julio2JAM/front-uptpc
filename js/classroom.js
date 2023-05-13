window.addEventListener("load", async () => await loadSubject());

async function loadSubject(){

    const selectClassroom = document.getElementById("select-classroom");
    selectClassroom.innerHTML = '';
    const startOption = new Option("Select a classroom", "");
    selectClassroom.add(startOption);

    await fetch("http://localhost:3000/api/classroom")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            let option = new Option(element.name, element.id);
            selectClassroom.add(option);
        });
    })
    .catch(error => error);

}

document.getElementById("save").addEventListener("click", async () => {
    let name = document.getElementById("name").value;
    let datetimeStart = document.getElementById("datetime-start").value;
    let datetimeEnd = document.getElementById("datetime-end").value;

    await fetch("http://localhost:3000/api/classroom/postOrUpdate",{
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name:name, datetime_start:datetimeStart, datetime_end:datetimeEnd})
    })
    .then(response => response.json())
    .catch(error => console.error(error));

    await loadSubject();
});

document.getElementById("select-classroom").addEventListener("change", async (event) => searchClassroom(Number(event.target.value)));
document.getElementById("search").addEventListener("click", async (event) => {
    let name = document.getElementById("search-classroom").value;
    await searchClassroom(name);
});

async function searchClassroom(data){

    // En caso de venir vacio, o que el id sea 0, retorna
    if(!Boolean(data)){
        document.querySelectorAll("#data-classroom :not(#save):not(option)").forEach(element => {element.value = "";})
        return;
    }
    
    let url = (typeof data != "string") 
    ? "http://localhost:3000/api/classroom/"
    : "http://localhost:3000/api/classroom/name/";
    
    await fetch(url+data)
    .then(response => response.json())
    .then(data => {
        document.getElementById("name").value = data.name;
        document.getElementById("datetime-start").value = data.datetime_start;
        document.getElementById("datetime-end").value = data.datetime_end;
        document.getElementById("status").value = data.id_status;
    })
    .catch(error => console.log(error));
}

/*
document.getElementById("search").addEventListener("click", () => {
    let classroom = document.getElementById("select-classroom");
    let id = document.getElementById("search-classroom");

    let url = "http://localhost:3000/api/classroom";
    fetch()
    .then(response => response.json())
    .catch(error => console.error(error));
});
*/
/*
document.getElementById("search-student").addEventListener("click", async () => {
    let ceduleStudent = document.getElementById("cedule-student").value ?? "";
    let nameStudent = document.getElementById("name-student").value ?? "";

    await fetch(`http://localhost:3000/api/classroom/${ceduleStudent}/${nameStudent}`)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error(error));
});

// Funcion para buscar un registro en la tabla search
async function searchStudent(data){

    // En caso de venir vacio, o que el id sea 0, retorna
    if(!Boolean(data)){
        return;
    }

    // Si es string, buscar el nombre, caso contrario, el id
    let url = (typeof data == "string")
    ? "http://localhost:3000/api/classroom/name/"
    : "http://localhost:3000/api/classroom/"

    await fetch(url+data)
    .then(response => {
        if(response.status == 404){
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let status = document.getElementById("status");
        let nameInput = document.getElementById("name");
        status.value = data.id_status;
        nameInput.value = data.name;
    })
    .catch(error => null);
}*/
