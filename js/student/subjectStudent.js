API_URL = 'http://localhost:3000/api'

document.getElementById("select-classroon").addEventListener("click", () => classroom());

async function classroom(){
    
    const validateModalMenu = document.getElementById("modal-menu");

    const div = document.createElement("div");
    div.id = "modal-menu";
    div.className = "modal-menu";

    const ul = document.createElement("ul");
    const liLength = 0;

    fetch(`${API_URL}/enrollment/?idStudent=${1}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            liLength++;
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.innerHTML = element?.classroom.name;
            li.appendChild(a);
            ul.appendChild(li);
        });
    })
    .catch(error => error);

    if(liLength == 0){
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.innerHTML = "Sin secciones para seleccionar";
        li.appendChild(a);
    }
    
    div.appendChild(ul);
    document.body.appendChild(div);

    const modalMenu = document.getElementById("modal-menu");
    modalMenu.addEventListener("click", event => {
        if (event.target.id === "modal-menu" || event.target.nodeName == "A") {
            document.getElementById("modal-menu").remove();
        }
    });
    
}