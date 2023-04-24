document.onload(async () => {

    const classroomSelect = document.getElementById("classroom-select");
    const subjectSelect = document.getElementById("subject-select");

    await fetch(`http://localhost:3000/api/classroom/`)
    .then(response => response.json())
    .then(data => {
        data.forEach(registro => {
            const option = document.createElement('option');
            option.value = registro.id;
            option.text = registro.nombre;
            classroomSelect.appendChild(option);
        });
    })
    .catch(error => console.log("Conexion failed, try in some seconds"));


    await fetch(`http://localhost:3000/api/subject/`)
    .then(response => response.json())
    .then(data => {
        data.forEach(registro => {
            const option = document.createElement('option');
            option.value = registro.id;
            option.text = registro.nombre;
            subjectSelect.appendChild(option);
        });
    })
    .catch(error => console.log("Conexion failed, try in some seconds"));

});

document.getElementById("save").addEventListener("click", async () => {
    let name = document.getElementById("name");

    await fetch(`http://localhost:3000/api/subject/name/${name.value}`)
    .then(response => response.json())
    .then(data => {
        let status = document.getElementById("status");
        status.value = data.idStatus;
    })
    .catch(error => console.log("Conexion failed, try in some seconds"));

});

document.getElementById("classroom").addEventListener("input", async event => {

    await fetch(`http://localhost:3000/api/classroom/name/${event.target.value}`)
    .then(response => response.json())
    .then(data => {
        let select = document.getElementById(classroom-select);
        select.value = data.id;
    })
    .catch(error => console.log("Conexion failed, try in some seconds"));

})

document.getElementById("subject").addEventListener("input", async event => {

    await fetch(`http://localhost:3000/api/subject/name/${event.target.value}`)
    .then(response => response.json())
    .then(data => {
        let select = document.getElementById(subject-select);
        select.value = data.id;
    })
    .catch(error => console.log("Conexion failed, try in some seconds"));

})