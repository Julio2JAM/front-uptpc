// Al cargar el archivo, obtener todos los registros de la tabla subject
window.addEventListener("load", async () => {

    const subjectSelect = document.getElementById("subject-select");

    await fetch(`http://localhost:3000/api/subject/`)
    .then(response => response.json())
    .then(data => {
        data.forEach(row => {
            const option = new Option(row.name, row.id);
            /*const option = document.createElement('option');
            option.value = row.id;
            option.text = row.name;
            //subjectSelect.appendChild(option);*/
            subjectSelect.add(option);
        });
    })
    .catch(error => console.log("Conexion failed, try in some seconds"));

});

// Obtener el elemento "save" y agregarle un evento
document.getElementById("save").addEventListener("click", async () => {
    // Obtener los elementos "name" y "description"
    let name = document.getElementById("name");
    let description = document.getElementById("description");
    let id_status = document.getElementById("status");

    // Gardar los elementos en la base de datos
    await fetch("http://localhost:3000/api/subject/postOrUpdate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({name:name.value, description: description.value, id_status: id_status.value})
    })
    .then(response => response.json())
    .then(data => {
        console.log('Datos guardados: ', data);
    })
    .catch(error => console.error('Ha ocurrido un error: ', error));
    
});

// Al hacer click en search, obtener el elemento name y llamar a la funcion search
document.getElementById("search").addEventListener("click", async () => {
    let name = document.getElementById("name");
    search(name.value);
});

// Al hacer cambiar el select, obtener el elemento y llamar a la funcion search
document.getElementById("subject-select").addEventListener("change", async (event) => search(Number(event.target.value)));

// Funcion para buscar un registro en la tabla search
async function search(data){

    // En caso de venir vacio, o que el id sea 0, retorna
    if(!Boolean(data)){
        return;
    }

    // Si es string, buscar el nombre, caso contrario, el id
    let url = (typeof data == "string")
    ? "http://localhost:3000/api/subject/name/"
    : "http://localhost:3000/api/subject/"

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
        let description = document.getElementById("description");
        nameInput.value = data.name;
        description.value = data.description;
        status.value = data.id_status;
    })
    .catch(error => null);
}