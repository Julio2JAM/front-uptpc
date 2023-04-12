document.getElementById("login-btn").addEventListener("click", () =>{
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch("http://localhost:3000/api/access",{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username: username, password: password})
    })
    .then(response => response.json())
    .then(data => {
        
        if(data.status == 400){
            handleMessage(data.message);
            return;
        }

        handleMessage("");
        document.cookie = `token=${data.token}; SameSite=None; Secure;`;
    })
    .catch(error => handleMessage("Conexion failed, try in some seconds"))
});
    

//Funcion para cambiar los input de password a text y viceversa
const viewBtn = document.querySelector(".view-btn");
viewBtn.addEventListener("click", function(){
    viewBtn.src = ((viewBtn.src == 'file:///home/julio/Documentos/front-se/source/ojo-no.png') ? 'source/ojo.png' : 'source/ojo-no.png');
    let view = document.getElementById("password");
    view.type = ((view.type == "password") ? "text" : "password");
});

function handleMessage(message){
    // Obtener el elemento cuya clase sea "message"
    const span = document.querySelector(".message");

    // Validar que el mensaje esta vacio y el elemento exista para eliminar
    if(!message && span){
        span.remove();

    // Validar que el mensaje esta vacio y el elemento no exista para retornar
    }else if(!message && !span){
        return;
    }

    // Validar que el elemento <span> exista, de ser asi, se cambia solo el su texto y se retorna
    if(span){
        span.textContent = message;
        return;
    }


    // Obtener el div y el hr, getElementsByClassName devuelve un arreglo, por eso se accede a la pos 0
    //const div = document.getElementsByClassName("container")[0];
    const div = document.querySelector(".container");
    const hr = div.querySelector("hr");

    // Crear el elemento a agregar
    const newElement = document.createElement("span");
    newElement.textContent = message;
    newElement.classList.add("message");

    // Agregar el nuevo elemento después del hr
    div.insertBefore(newElement, hr.nextSibling);
}

/*
document.getElementById("register-btn").addEventListener("click", () => {
    location.href = "register.html";
});
*/