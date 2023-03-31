document.getElementById("save").addEventListener("click", () => {
    let name = document.getElementById("name").value;
    let datetimeStart = document.getElementById("datetimeStart").value;
    let datetimeEnd = document.getElementById("datetimeEnd").value;

    fetch("http://localhost:3000/api/user",{
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name:name, datetimeStart:datetimeStart, datetimeEnd:datetimeEnd})
    })
    .then(response => response.json())
    .catch(error => console.error(error));
});