document.getElementById("login-btn").addEventListener("click", () =>{
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch("http://localhost:3000/api/access",{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username: username, password: password})
    })
    .then(response => {
        console.log("ok");
    })
    .catch(error =>{
        console.log("error");
    });
});

/*
document.getElementById("register-btn").addEventListener("click", () => {
    location.href = "register.html";
});
*/

//Funcion para cambiar los input de password a text y viceversa
const viewBtn = document.querySelector(".view-btn");
viewBtn.addEventListener("click", function(){
    viewBtn.src = ((viewBtn.src == 'file:///home/julio/Documentos/front-se/source/ojo-no.png') ? 'source/ojo.png' : 'source/ojo-no.png');
    let view = document.getElementById("password");
    view.type = ((view.type == "password") ? "text" : "password");
});