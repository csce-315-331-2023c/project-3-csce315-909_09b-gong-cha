/**
 * @fileoverview This file contains functions for post login
 */

const url = 'https://csce-315-project-3-gong-cha.onrender.com';
document.addEventListener("DOMContentLoaded", function() {
  alert("Logged in Successfully!");
  checkManager();
  localStorage.setItem('isLoggedIn', 'true');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  if (isLoggedIn == 'true') {
    this.getElementById('oauth').textContent = "Logout";
    this.getElementById('oauth').href = "/logout";
  }
  else {
    this.getElementById('oauth').textContent = "Login";
    this.getElementById('oauth').href = "/login";
  }

  if (localStorage.getItem('lang') == 'es') {
    translateElements2('es');
  }
  const weatherInfo = document.getElementById('weather-info');

  fetch(url + `/weather`)
    .then((response) => response.json())
    .then((data) => {
      const { current } = data;
      const tempF = current.temp_f;

      weatherInfo.innerHTML = `Weather: ${tempF}°F`;
      if (localStorage.getItem('lang') == 'es') {
        translateElements2('es');
      }
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
      weatherInfo.innerHTML = 'Weather: Not available';
    });
});

$('.carousel').carousel({
    interval: 5000 //have it cycle
  })


  /**
   * Translates elements with a specific class to a specified language.
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

/**
 * Asynchronously checks the manager status for a user.
 * Makes POST requests to retrieve account information and user email.
 * Sets local storage items based on user's manager and employee status.
 * @param {string} url - The base URL for API requests.
 * @returns {Promise<void>} - A Promise indicating the completion of the check.
 */
async function checkManager(){
  var userData = {
    'username': '',
    'password': ''
  }

  const response = await fetch(url + "/getAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const response_2 = await fetch(url + "/userEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  var email = await response_2.text();
  console.log("response"+ email);
  if (response.ok) {
    const responseData = await response.json();
    // Resource exists
    localStorage.setItem('isLoggedIn', 'true');

    // change this criteria ideally
    if (email.includes('employee')) {
      localStorage.setItem('isEmployee', 'true');
    }
    if (responseData[0].is_manager == true) {
      localStorage.setItem('isManager', 'true');
      localStorage.setItem('isEmployee', 'true');
    }
  }



}