const openModal = document.getElementById("modal-btn");
const closeModal = document.querySelector(".close-btn");
const modal = document.querySelector(".modal");

function toggleModal(){
    modal.classList.toggle("show-modal");
}

openModal.addEventListener("click", toggleModal); 
closeModal.addEventListener("click", toggleModal);
modal.addEventListener("click", event => {
    console.log(event.target);
    if(event.target.id == "modal"){
        modal.classList.toggle("show-modal");
    }
});

document.getElementById("reset").addEventListener("click", () => {
    document.querySelector("form").reset();
});