/**
 * @fileoverview This file contains functions for the about page
 */

const url = 'https://csce-315-project-3-gong-cha.onrender.com/';
document.addEventListener("DOMContentLoaded", function() {
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

  if (localStorage.getItem('lang') == 'es') {
    translateElements2('es');
  }
  if (isLoggedIn == 'true') {
    this.getElementById('oauth').textContent = "Logout-OAUTH";
    this.getElementById('oauth').href = "/logout";
  }
  else {
    this.getElementById('oauth').textContent = "Login-OAUTH";
    this.getElementById('oauth').href = "/login";
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
