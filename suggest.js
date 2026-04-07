document.addEventListener("DOMContentLoaded", () => {
    if(!isLoggedIn()) {
        window.location.href = "login.html";
        return;
    }

    const form = document.getElementById("suggestion-form");
    if (!form) return;
    const successMsg = document.getElementById("suggest-msg");

    form.addEventListener("submit", (e) =>{
        e.preventDefault();

        const nameEl = document.getElementById("place-name");
        const categoryEl = document.getElementById("place-category");
        const areaEl = document.getElementById("place-area");
        const descriptionEl = document.getElementById("place-description");
        if (!nameEl || !categoryEl || !areaEl || !descriptionEl) return;

        const place = {
            name: nameEl.value.trim(),
            category: categoryEl.value,
            area: areaEl.value.trim(),
            description: descriptionEl.value.trim(),
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
        if (successMsg) successMsg.style.display = "block";
    })
});