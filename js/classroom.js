window.addEventListener("load", async () => {

    const selectClassroom = document.getElementById("select-classroom");

    await fetch("http://localhost:3000/api/classroom")
    .then(response => response.json())
    .then(data => {
        data.array.forEach(element => {
            let option = new Option(element.seccion, element.id);
            selectClassroom.addEventListener(option);
        });
    })
    .catch(error => error);
});

document.getElementById("save").addEventListener("click", () => {
    let name = document.getElementById("name").value;
    let datetimeStart = document.getElementById("datetimeStart").value;
    let datetimeEnd = document.getElementById("datetimeEnd").value;

    fetch("http://localhost:3000/api/classroom",{
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name:name, datetimeStart:datetimeStart, datetimeEnd:datetimeEnd})
    })
    .then(response => response.json())
    .catch(error => console.error(error));
});

document.getElementById("search").addEventListener("click", () => {
    let classroom = document.getElementById("select-classroom");
    let id = document.getElementById("search-classroom");

    let url = "http://localhost:3000/api/classroom";
    fetch(url/*, { 
        headers: { 'Authorization': 'Bearer ' + token } 
    }*/)
    .then(response => response.json())
    .catch(error => console.error(error));
});

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
}
