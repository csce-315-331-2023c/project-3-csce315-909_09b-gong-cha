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