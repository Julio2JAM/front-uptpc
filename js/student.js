document.getElementById("new").addEventListener("click", (event) => {

    // Crear divs contenedores
    var modal = document.createElement("div");
    modal.className = "modal-box";
    modal.id = "modal-box";

    var modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.id = "modal-content";

    var cardContent = document.createElement("div");
    cardContent.className = "card-content";
    cardContent.id = "card-content";

    // Crear elementos del DOM
    var img = document.createElement("img");
    img.src = "source/subject2.jpeg";

    var fieldset1 = document.createElement("fieldset");
    var legend1 = document.createElement("legend");
    var select1 = document.createElement("select");
    var span11 = document.createElement("span");
    var span12 = document.createElement("span");
    var span13 = document.createElement("span");
    var input11 = document.createElement("input");
    var input12 = document.createElement("input");
    var option = document.createElement("option");

    var fieldset2 = document.createElement("fieldset");
    var legend2 = document.createElement("legend");
    var select2 = document.createElement("select");
    var option2_1 = document.createElement("option");
    var input2 = document.createElement("input");
    
    // Configurar los elementos
    legend1.textContent = "Data subject";
    span11.textContent = "Name";
    input11.type = "text";
    input11.id = "name";
    input11.placeholder = "name";
    
    span13.textContent = "Status";
    option.value = "";
    option.text = "Select a status";


    span12.textContent = "Description";
    input12.type = "text";
    input12.id = "Description";
    input12.placeholder = "Description";
    
    legend2.textContent = "Search subject";
    option2_1.value = "0";
    option2_1.textContent = "Selecciona un tema";
    select2.appendChild(option2_1);
    input2.type = "submit";
    input2.id = "search";
    input2.value = "search";
    
    // Agregar los elementos al DOM
    select1.appendChild(option);
    modalContent.appendChild(img);

    fieldset1.appendChild(legend1);

    fieldset1.appendChild(span11);
    fieldset1.appendChild(input11);

    fieldset1.appendChild(span12);
    fieldset1.appendChild(input12);

    fieldset1.appendChild(span13);
    fieldset1.appendChild(select1);
    
    cardContent.appendChild(fieldset1);

    fieldset2.appendChild(legend2);
    fieldset2.appendChild(select2);
    fieldset2.appendChild(input2);
    cardContent.appendChild(fieldset2);

    modalContent.appendChild(cardContent);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
})