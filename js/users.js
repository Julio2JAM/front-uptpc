window.addEventListener("load", async () => await loadData());


async function levels(){

  const select = document.createElement("select");
  select.innerHTML = "";

  const startOption = new Option("Select a permission", "");
  select.add(startOption);

  await fetch(`http://localhost:3000/api/level`)
  .then(response => response.json())
  .then(data => {
    data.forEach(element => {
      const option = new Option(element.name, element.id);
      select.add(option);
    });
  })
  .catch(err => err);
  
  return select
}

async function loadData(){

  const table = document.getElementById("table");
  const selectLevel = await levels();

  // Crear boton de view
  const button = document.createElement('button');
  button.innerHTML = "View";
  button.className = "view-button";

  await fetch(`http://localhost:3000/api/user`)
  .then(response => response.json())
  .then(data => {
    data.forEach(element => {
    
      const clonedSelect = selectLevel.cloneNode(true);
      clonedSelect.selectedIndex = (element.level !== null) ? element.level.id : 0;

      console.log("🚀 ~ file: users.js:40 ~ loadData ~ element:", element)
      // Insertar en la ultima posicion
      const row = table.insertRow(-1);
      row.className = "filter-item";//+element.id_level;
      
      // Crear columnas
      const name = row.insertCell(0);
      name.innerHTML = element.username;

      const lastName = row.insertCell(1);
      //lastName.innerHTML = element.lastName;

      const cedule = row.insertCell(2);
      //cedule.innerHTML = element.cedule;

      const level = row.insertCell(3);
      level.appendChild(clonedSelect);

      const view = row.insertCell(4);
      view.appendChild(button.cloneNode(true));
    });
  })
  .catch(err => err);

}

// Get the filter buttons
const filterButtons = document.querySelectorAll('.filter-button');

// Add click event listeners to the filter buttons
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove the active class from all filter buttons
    filterButtons.forEach(button => {
      button.classList.remove('active');
    });

    // Add the active class to the clicked filter button
    button.classList.add('active');

    // Get the filter value
    const filterValue = button.dataset.filter;

    // Show or hide table rows based on the filter value
    const tableRows = document.querySelectorAll('.filter-item');
    tableRows.forEach(row => {
      if (filterValue === 'all' || row.classList.contains(filterValue)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
});

// Get the view buttons
const viewButtons = document.querySelectorAll('.view-button');

// Add click event listeners to the view buttons
viewButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Get the row
    const row = button.parentElement.parentElement;

    // Get the data
    const firstName = row.querySelector('td:nth-child(1)').textContent;
    const lastName = row.querySelector('td:nth-child(2)').textContent;
    const idNumber = row.querySelector('td:nth-child(3)').textContent;
    const permissions = row.querySelector('td:nth-child(4)').textContent;

    // Show the complete information
    alert(`First Name: ${firstName}\nLast Name: ${lastName}\nID Number: ${idNumber}\nPermissions: ${permissions}`);
  });
});

// Get the save button
const saveButton = document.getElementById('save-button');

// Add click event listener to the save button
saveButton.addEventListener('click', () => {
  // Save the changes
  alert('Changes saved successfully!');

  // Disable the save button
  saveButton.disabled = true;
});

// Add change event listener to the table rows
const tableRows = document.querySelectorAll('.filter-item');
tableRows.forEach(row => {
  row.addEventListener('change', () => {
    // Enable the save button
    saveButton.disabled = false;
  });
});
