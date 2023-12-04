/**
 * @fileoverview This file contains functions that provide login functionality.
 */

const url = 'https://csce-315-project-3-gong-cha.onrender.com/';

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
    this.getElementById('oauth').textContent = "Logout-OAUTH";
    this.getElementById('oauth').href = "/logout";
  }
  else {
    this.getElementById('oauth').textContent = "Login-OAUTH";
    this.getElementById('oauth').href = "/login";
  }

  if (localStorage.getItem('lang') == 'es') {
    translateElements2('es');
  }

  toggleAuthenticationViews();
})

/**
 * Toggles between login mode and create account mode by hiding or displaying the login and signup forms.
 */
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

/**
 * Checks login information against stored data and performs login operations if valid.
 * @param {Event} event - The event triggered by submitting the login form.
 */
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
    window.location.href = 'index.html';
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

/**
 * Toggles between authentication views based on the login state stored in local storage.
 */
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

/**
 * Logs the user out by updating local storage and redirecting to the index page.
 */
function logout() {
  localStorage.setItem('isLoggedIn', 'false');
  localStorage.setItem('isEmployee', 'false');
  localStorage.setItem('isManager', 'false');
  window.location.href = 'index.html';
}

/**
 * Creates a new user account by extracting information from HTML elements and adding them to the database.
 * @param {Event} event - The event triggered by submitting the create account form.
 * @returns {boolean} Returns false if passwords do not match; otherwise, returns true.
 */
async function createAccount(event) {
  username = document.getElementById('new-username').value;
  password = document.getElementById('new-password').value;
  if(password != document.getElementById('confirm-password').value){
    event.preventDefault();
    alert("Passwords do not match!");
    return false;
  }else{
    alert("Account successfully created. ");

    var userData = {
      'new-username': username,
      'new-password': password,
    }
  
    const response = await fetch(url + "/createAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });  
  }
}

/**
 * Translates elements with a specific class to a specified language using Google Translate API.
 * @param {string} lang - The target language for translation.
 */
function translateElements2(lang) {
  var targetLanguage = lang;
  const elements = document.querySelectorAll('.translate');
  const apiKey = 'AIzaSyCCT13ZuFYfFyH8H-DX195b8F6lSr0CESc';

  console.log(elements);
  elements.forEach(element => {
      const textToTranslate = element.textContent;
      fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(textToTranslate)}&target=${targetLanguage}`, {
          method: 'POST'
      })
          .then(response => response.json())
          .then(data => {
              const translatedText = data.data.translations[0].translatedText;
              element.textContent = translatedText;
          })
          .catch(error => {
              console.error('Translation error:', error);
          });
  });
}