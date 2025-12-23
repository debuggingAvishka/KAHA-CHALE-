document.addEventListener("DOMContentLoaded", () =>{
    const form = document.getElementById("login-form");

    form.addEventListener("submit", (e)=>{
        e.preventDefault();

        const email= document.getElementById("email").value.trim();
        const password= document.getElementById("password").value.trim();

        if(!email || !password){
            alert("Please enter both email and password.");
            return;
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        window.location.href = "index.html";
    })
});