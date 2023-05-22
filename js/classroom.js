$(function() {
    $('select').select2();
});

$('select').on('select2:select', function (e) {
    console.log(e.target.id);
    console.log(e.params.data.id);
});
  
$(document).on('click', function(e) {
    if (!$(e.target).closest('.select2-container').length) {
      $('select').select2('close');
    }
});
  
// Al cargar la pagina, cargar todos los datos necesarios
window.addEventListener("load", async () => {
    await loadData("all");
});

// Funcion para cargar datos
async function loadData(entity){

    // Datos que admite la pagina para cargar
    const url =  [
        "subject",
        "classroom",
        "student",
        "professor",
        "all",
    ];

    // Validar que se haya enviado un dato valido para cargar
    if(!url.includes(entity)){
        return;
    }
    
    // Al enviar "All", cargar todos los datos
    if(entity == "all"){
        url.slice(0,-1).forEach(e => loadData(e));
        return;
    }

    // Tomar el select del dato enviado
    const subjectSelect = document.getElementById("select-"+entity);
    // Vaciar el contenido
    subjectSelect.innerHTML = "";
    // Agregar la opcion 0, "Seleccione un ..."
    const startOption = new Option("Select a "+entity, "");
    subjectSelect.add(startOption);

    // Obtener datos de la BD
    await fetch(`http://localhost:3000/api/${entity}/`)
    .then(response => response.json())
    .then(data => {
        data.forEach(row => {

            if(entity == "professor" || entity == "student"){
                row.name = row.name+" "+row.lastname;
            }
            const option = new Option(row.name, row.id);
            subjectSelect.add(option);

        });
    })
    .catch(error => console.log("Conexion failed, try in some seconds"));

}

// Guardar datos en la BD
document.getElementById("save").addEventListener("click", async () => {
    // Tomar todos los datos necesarios
    const name = document.getElementById("name").value;
    const datetimeStart = document.getElementById("datetime-start").value;
    const datetimeEnd = document.getElementById("datetime-end").value;
    const status = document.getElementById("status").value;

    // Guardar en la BD los datos tomados
    await fetch("http://localhost:3000/api/classroom/postOrUpdate",{
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ 
            name:name,
            datetime_start:datetimeStart,
            datetime_end:datetimeEnd,
            id_status:status
        })
    })
    .then(response => response.json())
    .catch(error => console.error(error));

    // Llamar a la funcion que carga datos, para que tenga el nuevo
    await loadData("classroom");
});

// Tomar el id del classroom para llamar a la funcion que obtiene su informacion
document.getElementById("select-classroom").addEventListener("change", async (event) => searchClassroom(Number(event.target.value)));
document.getElementById("search").addEventListener("click", async (event) => {
    let name = document.getElementById("search-classroom").value;
    await searchClassroom(name);
});

// Obtener los datos de un registro
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

// Obtener datos por cedula
async function getCedule(entity,cedule){

    const url = [
        "student",
        "professor",
    ];

    if(!entity || !cedule || !url.includes(entity)){
        return;
    }
    
    await fetch(`http://localhost:3000/api/${entity}/cedule/${cedule}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById(`name-${entity}`).value = data.name;
    })
    .catch(error => {
        document.getElementById(`name-${entity}`).value = "";
    });

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
