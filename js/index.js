const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

fetch("https://localhost:3000/api/access",{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username: username, password: password})
})
.then(response => {
    console.log(response);
})
.catch(error => {
    console.log(error);
    alert("Error al iniciar sesión");
});