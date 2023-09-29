// Obtén el elemento con el que quieres interactuar
const menuElement = document.querySelectorAll('nav a');

for (const iterator of menuElement) {
    changeIcon(iterator);
    changeIcon2(iterator);
}

const toggleMenu = document.getElementById("toggle-menu");

toggleMenu.addEventListener("click", () => {

    const toggleMenu        = document.getElementById("toggle-menu");
    const closeIcon         = '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>'
    const toggleIcon        = '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/></svg>';
    
    const validateModalMenu = document.getElementById("modal-menu");
    if(validateModalMenu){
        validateModalMenu.remove();
        toggleMenu.innerHTML = '';
        toggleMenu.innerHTML = toggleIcon;
        return;
    }

    toggleMenu.innerHTML = '';
    toggleMenu.innerHTML = closeIcon;

    const div = document.createElement("div");
    div.id = "modal-menu";
    div.className = "modal-menu";

    const ul = document.createElement("ul");
    
    const studentProfessor  = '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3a3 3 0 1 1-1.614 5.53M15 12a4 4 0 0 1 4 4v1h-3.348M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 11h3a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"/></svg>';
    const section           = '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="none" viewBox="0 0 18 20"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 2h4a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4m6 0v3H6V2m6 0a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1M5 5h8m-5 5h5m-8 0h.01M5 14h.01M8 14h5"/></svg>';
    const subject           = '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 16.5c0-1-8-2.7-9-2V1.8c1-1 9 .707 9 1.706M10 16.5V3.506M10 16.5c0-1 8-2.7 9-2V1.8c-1-1-9 .707-9 1.706"/></svg>';
    const user              = '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.109 17H1v-2a4 4 0 0 1 4-4h.87M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm7.95 2.55a2 2 0 0 1 0 2.829l-6.364 6.364-3.536.707.707-3.536 6.364-6.364a2 2 0 0 1 2.829 0Z"/></svg>';

    const liStudent = document.createElement("li");
    const aStudent = document.createElement("a");
    aStudent.id = "modal-student-professor";
    aStudent.href = aStudent.id.split("-").pop() + ".html";
    aStudent.innerHTML = "Estudiantes / docentes";
    aStudent.innerHTML = studentProfessor + aStudent.innerHTML;
    liStudent.appendChild(aStudent);

    const liSection = document.createElement("li");
    const aSection = document.createElement("a");
    aSection.id = "modal-section";
    aSection.href = aSection.id.split("-").pop() + ".html";
    aSection.innerHTML = "Secciones";
    aSection.innerHTML = section + aSection.innerHTML;
    liSection.appendChild(aSection);

    const liSubject = document.createElement("li");
    const aSubject = document.createElement("a");
    aSubject.id = "modal-subject";
    aSubject.href = aSubject.id.split("-").pop() + ".html";
    aSubject.innerHTML = "Asignaturas";
    aSubject.innerHTML = subject + aSubject.innerHTML;
    liSubject.appendChild(aSubject);

    const liUser = document.createElement("li");
    const aUser = document.createElement("a");
    aUser.id = "modal-user";
    aUser.href = aUser.id.split("-").pop() + ".html";
    aUser.innerHTML = "Usuario";
    aUser.innerHTML = user + aUser.innerHTML;
    liUser.appendChild(aUser);

    ul.appendChild(liStudent);
    ul.appendChild(liSection);
    ul.appendChild(liSubject);
    ul.appendChild(liUser);
    div.appendChild(ul);

    document.body.appendChild(div);

    const toggleMenuElements = document.querySelectorAll(".modal-menu ul a");
    for (const iterator of toggleMenuElements) {
        const array = iterator.id.split("-");
        array.shift();
        iterator.id = array.join('-'); 

        changeIcon(iterator);
        changeIcon2(iterator);
    }

    const modalMenu = document.getElementById("modal-menu");
    modalMenu.addEventListener("click", event => {
        if (event.target.id === "modal-menu") {
            event.target.remove();
        }
    });
});

function changeIcon(iterator){
    iterator.addEventListener("mouseover", () => {

        const iconList = {
            "home"              : '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/></svg>',
            "student-professor" : '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18"><path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/></svg>',
            "section"           : '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20"><path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v2H7V2ZM5 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm8 4H8a1 1 0 0 1 0-2h5a1 1 0 0 1 0 2Zm0-4H8a1 1 0 0 1 0-2h5a1 1 0 1 1 0 2Z"/></svg>',
            "subject"           : '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18"><path d="M9 1.334C7.06.594 1.646-.84.293.653a1.158 1.158 0 0 0-.293.77v13.973c0 .193.046.383.134.55.088.167.214.306.366.403a.932.932 0 0 0 .5.147c.176 0 .348-.05.5-.147 1.059-.32 6.265.851 7.5 1.65V1.334ZM19.707.653C18.353-.84 12.94.593 11 1.333V18c1.234-.799 6.436-1.968 7.5-1.65a.931.931 0 0 0 .5.147.931.931 0 0 0 .5-.148c.152-.096.279-.235.366-.403.088-.167.134-.357.134-.55V1.423a1.158 1.158 0 0 0-.293-.77Z"/></svg>',
            "user"              : '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18"><path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-1.391 7.361.707-3.535a3 3 0 0 1 .82-1.533L7.929 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h4.259a2.975 2.975 0 0 1-.15-1.639ZM8.05 17.95a1 1 0 0 1-.981-1.2l.708-3.536a1 1 0 0 1 .274-.511l6.363-6.364a3.007 3.007 0 0 1 4.243 0 3.007 3.007 0 0 1 0 4.243l-6.365 6.363a1 1 0 0 1-.511.274l-3.536.708a1.07 1.07 0 0 1-.195.023Z"/></svg>',
        };

        if (!iconList[iterator.id]) {
            return;
        }

        iterator.removeChild(iterator.firstChild);
        iterator.innerHTML = iconList[iterator.id] + iterator.innerHTML;
    });
}

function changeIcon2(iterator){
    iterator.addEventListener("mouseout", () => {
        const iconList = {
            "home"              : '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true"  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8v10a1 1 0 0 0 1 1h4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h4a1 1 0 0 0 1-1V8M1 10l9-9 9 9"/></svg>',
            "student-professor" : '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3a3 3 0 1 1-1.614 5.53M15 12a4 4 0 0 1 4 4v1h-3.348M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 11h3a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"/></svg>',
            "section"           : '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="none" viewBox="0 0 18 20"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 2h4a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4m6 0v3H6V2m6 0a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1M5 5h8m-5 5h5m-8 0h.01M5 14h.01M8 14h5"/></svg>',
            "subject"           : '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 16.5c0-1-8-2.7-9-2V1.8c1-1 9 .707 9 1.706M10 16.5V3.506M10 16.5c0-1 8-2.7 9-2V1.8c-1-1-9 .707-9 1.706"/></svg>',
            "user"              : '<svg style="width:1.2rem; height: 1.2rem; color:#646464" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.109 17H1v-2a4 4 0 0 1 4-4h.87M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm7.95 2.55a2 2 0 0 1 0 2.829l-6.364 6.364-3.536.707.707-3.536 6.364-6.364a2 2 0 0 1 2.829 0Z"/></svg>'
        };

        if (!iconList[iterator.id]) {
            return;
        }

        iterator.removeChild(iterator.firstChild);
        iterator.innerHTML = iconList[iterator.id] + iterator.innerHTML;
    });
}

