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
    id != null ? url += `/${id}` : url ;
    fetch(url/*, { 
        headers: { 'Authorization': 'Bearer ' + token } 
    }*/)
    .then(response => response.json())
    .catch(error => console.error(error));
});

document.getElementById("search-student").addEventListener("click", () => {
    let ceduleStudent = document.getElementById("cedule-student").value ?? null;
    let nameStudent = document.getElementById("name-student").value ?? null;

    fetch(`http://localhost:3000/api/classroom/${ceduleStudent}/${nameStudent}`/*, { 
        headers: { 'Authorization': 'Bearer ' + token } 
    }*/)
    .then(response => response.json())
    .catch(error => console.error(error));
});