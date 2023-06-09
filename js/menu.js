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

})