const url = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const isEmployee = localStorage.getItem('isEmployee');
  const isManager = localStorage.getItem('isManager');

  if (isLoggedIn == null) {
    localStorage.setItem('isLoggedIn', 'false');
  }
  if (isEmployee == null) {
    localStorage.setItem('isEmployee', 'false');
  }
  if (isManager == null) {
    localStorage.setItem('isManager', 'false');
  }
  if (isLoggedIn == 'true') {
    this.getElementById('login-nav').textContent = "Logout";
  }
  else {
    this.getElementById('login-nav').textContent = "Login";
  }

  toggleAuthenticationViews();
})
// this switches between login mode and create account mode
function toggleForm() {
    var loginForm = document.getElementById("loginForm");
    var signupForm = document.getElementById("signupForm");

    if (loginForm.style.display === "none") {
      loginForm.style.display = "block";
      signupForm.style.display = "none";
    } else {
      loginForm.style.display = "none";
      signupForm.style.display = "block";
    }
  }

// this function will take the login info from HTML elements "username" and "password"
async function checkLoginInfo(event) {
  event.preventDefault();

  username = document.getElementById('username').value;
  password = document.getElementById('password').value;

  var userData = {
    'username': document.getElementById('username').value,
    'password': document.getElementById('password').value
  }

  const response = await fetch(url + "/getAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (response.ok) {
    const responseData = await response.json();
    // Resource exists
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'about.html';
    if (!responseData[0].username.includes('@')) {
      localStorage.setItem('isEmployee', 'true');
      window.location.href = 'cashier.html';
    }
    if (responseData[0].is_manager == true) {
      localStorage.setItem('isManager', 'true');
      window.location.href = 'manager.html';
    }
    alert("Login Successful!");
  } else {
    // Resource doesn't exist or there was an error
    console.log('Resource does not exist or there was an error');
    alert("Username or Password Incorrect");
  }
}

function toggleAuthenticationViews() {
  var loginForm = document.getElementById('loginForm');
  var logoutBox = document.getElementById('logoutBox');

  console.log(localStorage.getItem('isLoggedIn'));

  if (localStorage.getItem('isLoggedIn') == 'true') {
    loginForm.style.display = 'none'; // Hide login form
    logoutBox.style.display = 'block'; // Show logout box
  } else {
    loginForm.style.display = 'block'; // Show login form
    logoutBox.style.display = 'none'; // Hide logout box
  }
}

function logout() {
  localStorage.setItem('isLoggedIn', 'false');
  localStorage.setItem('isEmployee', 'false');
  localStorage.setItem('isManager', 'false');
  window.location.href = 'index.html';
}

// this function will take new account info from HTML elements "new-username" and "new-password" and add them to our database
