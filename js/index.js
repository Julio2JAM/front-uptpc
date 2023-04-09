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
        
        // Obtener el div y el hr, getElementsByClassName devuelve un arreglo, por eso se accede a la pos 0
        const div = document.getElementsByClassName("container")[0];
        const hr = div.querySelector("hr");

        // Crear el elemento a agregar
        const newElement = document.createElement("span");
        newElement.textContent = 'Este es el nuevo elemento';
        newElement.classList.add("message");

        // Agregar el nuevo elemento después del hr
        div.insertBefore(newElement, hr.nextSibling);
        
        const keys = Object.keys(data).sort();
        keys.forEach(key => {
            console.log(key + ": " + data[key]);
        });
    })
    .catch(error =>{
        console.log("Password or username incorrect");
    });
});

//Funcion para cambiar los input de password a text y viceversa
const viewBtn = document.querySelector(".view-btn");
viewBtn.addEventListener("click", function(){
    viewBtn.src = ((viewBtn.src == 'file:///home/julio/Documentos/front-se/source/ojo-no.png') ? 'source/ojo.png' : 'source/ojo-no.png');
    let view = document.getElementById("password");
    view.type = ((view.type == "password") ? "text" : "password");
});


/*
document.getElementById("register-btn").addEventListener("click", () => {
    location.href = "register.html";
});
*/