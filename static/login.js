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
function checkLoginInfo() {

}

// this function will take new account info from HTML elements "new-username" and "new-password" and add them to our database
