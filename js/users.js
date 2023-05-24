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
