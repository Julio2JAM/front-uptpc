document.getElementById("login-btn").addEventListener("click", () =>{
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch("http://localhost:3000/api/access",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username: username, password: password})
    })
    /*.then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
        alert("Error al iniciar sesión");
    });*/
    .then(response => {
        //const cookie = 
        response.json();
        console.log(response.json())
    })
    .catch(error => console.error(error));
});

document.getElementById("register-btn").addEventListener("click", () => {
    location.href = "register.html";
});