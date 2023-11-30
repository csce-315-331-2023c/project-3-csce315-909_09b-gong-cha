const url = 'http://localhost:5000';
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

  const weatherInfo = document.getElementById('weather-info');

  fetch(url + `/weather`)
    .then((response) => response.json())
    .then((data) => {
      const { current } = data;
      const tempF = current.temp_f;

      weatherInfo.innerHTML = `Weather: ${tempF}°F`;
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
      weatherInfo.innerHTML = 'Weather: Not available';
    });
});

$('.carousel').carousel({
    interval: 5000 //have it cycle
  })

