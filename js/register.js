document.getElementById("view").addEventListener("click", function(){
    let view = [
        document.getElementById("password"),
        document.getElementById("repet")
    ];

    view.forEach(element => element.type = (element.type == "password") ? "text" : "password");
});

document.getElementById("repet").addEventListener("keydown", event =>verifyPassword("repet"));
document.getElementById("password").addEventListener("keydown", event =>verifyPassword("password"));

function verifyPassword(value){
    let password = document.getElementById("password");
    console.log(password.value);
    let repet = document.getElementById("repet");

    if(value == "password" && (password.value).length < 8 || (password.value).length > 16 ){
        console.log(password.value + " is not a valid password");
    }

    if(value == "repet"){
        repet.value != password.value ? console.log("NO!") : console.log("YES!");
    }
}