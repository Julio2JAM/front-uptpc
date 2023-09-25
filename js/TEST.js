const openModalBtn = document.getElementById("modal-btn");
const closeModalBtn = document.querySelector(".close-btn");
const modal = document.getElementById("modal");
const modalContent = document.querySelector(".modal-content");

function openModal() {
    modal.style.display = "flex";
}

function closeModal(event) {
    modal.classList.add("close-modal");
    setTimeout(() => {
        modal.style.display = "none";
        // if(document.body.contains(modal)){
        //     document.body.removeChild(modal);
        // }
        modal.classList.remove("close-modal");
    }, 260);
}

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", event => {

    if (event.target != modalContent) {
        console.log(".");
        closeModal();
    }

    if (event.target.id == "modal") {
        // modal.classList.toggle("show-modal");
    }
});

document.getElementById("reset").addEventListener("click", () => {
    document.querySelector("form").reset();
});