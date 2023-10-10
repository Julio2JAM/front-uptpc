API_URL = 'http://localhost:3000/api'


document.getElementById("select-classroon").addEventListener("click", () => classroom());

async function classroom(){
    
    const validateModalMenu = document.getElementById("modal-menu");

    const div = document.createElement("div");
    div.id = "modal-menu";
    div.className = "modal-menu";

    const ul = document.createElement("ul");
    
    fetch(`${API_URL}/enrollment/?idStudent=${1}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const li = document.createElement("li");
            li.innerHTML = element?.classroom.name;
            ul.appendChild(liStudent);
        });
    })
    .catch(error => error);

    div.appendChild(ul);
    document.body.appendChild(div);

    const modalMenu = document.getElementById("modal-menu");
    modalMenu.addEventListener("click", event => {
        if (event.target.id === "modal-menu") {
            event.target.remove();
        }
    });
    
}