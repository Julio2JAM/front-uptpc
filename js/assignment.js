API_URL = 'https://localhost:3000/api/'

document.getElementById('classroom').addEventListener('click', async (event) => await getClassroom());

async function getClassroom() {
    fetch(`${API_URL}/classroom`)
    .then(response => response.json())
    .response(data => console.log(data))
    .catch(err => console.error(err));
}

async function getStudents(classroom){
    fetch(`${API_URL}/enrollment/classroom/${classroom}/student/`)
    .then(response => response.json())
    .response(data => console.log(data))
    .catch(err => console.error(err));
}

function loadData(data){
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = "";

    data.array.forEach(element => {
        
        const row = tbody.insertRow(-1);

        const cellName = row.insertCell(0);
        cellName.innerHTML = `${data?.name} ${row.lastname}`;
        
    });
}