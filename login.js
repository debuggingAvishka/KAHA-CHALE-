
document.addEventListener("DOMContentLoaded", () =>{
    const form = document.getElementById("login-form");
    if (!form) return;

    form.addEventListener("submit", (e)=>{
        e.preventDefault();

        const emailEl = document.getElementById("email");
        const passwordEl = document.getElementById("password");
        if (!emailEl || !passwordEl) return;

        const email = emailEl.value.trim();
        const password = passwordEl.value.trim();

        if(!email || !password){
            alert("Please enter both email and password.");
            return;
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        window.location.href = "index.html";
    })
});