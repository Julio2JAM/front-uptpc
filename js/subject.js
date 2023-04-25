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

document.getElementById("save").addEventListener("click", async () => {
    let name = document.getElementById("name");
    let description = document.getElementById("description");

    await fetch("http://localhost:3000/api/subject", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({name:name.value, description: description.value})
    })
    
});

document.getElementById("search").addEventListener("click", async () => {
    let name = document.getElementById("name");
    search(name.value);
});

document.getElementById("subject-select").addEventListener("change", async (event) => {
    console.log(event);
    let name = event.target.value;
    console.log(name);
    search(name.value);
});

// CAMBIAR PARA QUE FUNCIONE CON ID Y CON NAME
async function search(id,name){

    if(name == ""){
        return;
    }

    await fetch(`http://localhost:3000/api/subject/name/${name}`)
    .then(response => {
        if(response.status == 404){
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let status = document.getElementById("status");
        let nameInput = document.getElementById("name");
        console.log(nameInput);
        status.value = data.id_status;
        nameInput.value = name;
        console.log(nameInput);
    })
    .catch(error => null);
}