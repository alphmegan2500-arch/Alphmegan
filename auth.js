// USERS & PASSWORDS
const users = {
  admin: "admin123",
  
  client: "client123"
};

// LOGIN FUNCTION
function login() {
  const role = document.getElementById("role").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  if (!role || !password) {
    error.textContent = "Please select role and enter password";
    return;
  }

  if (users[role] === password) {
    localStorage.setItem("loggedInUser", role);
    window.location.href = "dashboard.html";
  } else {
    error.textContent = "Invalid login credentials";
  }
}

// DASHBOARD LOAD
if (window.location.pathname.includes("dashboard.html")) {
  const user = localStorage.getItem("loggedInUser");
  if (!user) {
    window.location.href = "index.html";
  } else {
    document.getElementById("welcome").textContent =
      `Welcome ${user.toUpperCase()}`;
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
