document.addEventListener("DOMContentLoaded", () => {
    if(!isLoggedIn()) {
        window.location.href = "login.html";
        return;
    }

    const form =document.getElementById("suggest-form");
    const successMsg = document.getElementById("success-msg");

    form.addEventListener("submit", (e) =>{
        e.preventDefault();

        const place = {
            name: document.getElementById("place-name").value.trim(),
            category: document.getElementById("place-category").value,
            area: document.getElementById("place-area").value.trim(),
            description: document.getElementById("place-description").value.trim(),
            suggestedBy: localStorage.getItem("userEmail"),
            createdAt: new Date().toISOString()
        };

        if(!place.name || !place.category || !place.area || !place.description){
            alert("Please fill in all required fields.");
            return;
        }

        const existing =
            JSON.parse(localStorage.getItem("suggestedPlaces")) || [];

        existing.push(place);
        localStorage.setItem("suggestedPlaces", JSON.stringify(existing));

        form.reset();
        successMsg.style.display = "block";
    })
});