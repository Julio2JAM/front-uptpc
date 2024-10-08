const API_URL = "http://localhost:3000/api";
const token = sessionStorage.getItem('token');

if(!token){
    location.href = "../index.html";
}
document.getElementById("logout").addEventListener("click", logout);
function logout(){
    sessionStorage.removeItem('token');
    location.href = "../index.html";
}

document.querySelector(".card-container").addEventListener("click", (event) => {
    const element = event.target;

    if(element.classList.contains("card-container")){
        return;
    }

    if(element.classList.contains("card")){
        location.href = `${element.id}.html`;
    }

    if(element.parentNode.classList.contains("card")){
        location.href = `${element.parentNode.id}.html`;
    }

});

window.addEventListener("load", async () => loadModules());

async function loadModules() {

    const cookieString = document.cookie;
    const cookieArray = cookieString.split("; ");
    const cookieName = "token";

    let cookieValue;
    for (const value of cookieArray) {

        if (value.indexOf(cookieName) === 0) {
            cookieValue = value.substring(cookieName.length + 1);
            cookieValue = decodeURIComponent(cookieValue);
            break;
        }
        
    }

    if(!cookieValue){
        return;
    }

    var token;
    await fetch(`http://localhost:3000/api/access/verifyToken/${cookieValue}`)
    .then(response => response.json())
    .then(data => {
        console.log("🚀 ~ file: index.js:24 ~ verifyToken ~ data:", data.token)
        token = data.token;
        console.log("🚀 ~ file: index.js:26 ~ verifyToken ~ token:", token)
    })
    .catch(err => console.error(err));
    
    if(!token){
        location.href = "index.html";
        document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}