
document.addEventListener("DOMContentLoaded", () => {
    const authLink = document.getElementById("auth-link");

    if(!authLink) return;

    if(isLoggedIn()){
        authLink.textContent = "Logout";
        authLink.href = "#";
        authLink.addEventListener("click", (e)=>{
            e.preventDefault();
            logout();
        });
    } else {
        authLink.textContent = "Login";
        authLink.href = "login.html";
    }  
});