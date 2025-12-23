
function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

function logout() {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
}