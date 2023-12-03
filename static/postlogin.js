const url = 'https://icespicefanclub.onrender.com';
document.addEventListener("DOMContentLoaded", function() {
  alert("Logged in Successfully!");
  checkManager();

  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
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


async function checkManager(){
  alert("do i even go here");

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