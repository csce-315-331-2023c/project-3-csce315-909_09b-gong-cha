/**
 * Translates elements with a specific class to a target language using Google Translate API.
 * If the target language in local storage is not 'es', it translates to Spanish ('es') and sets the language in local storage.
 * If the target language is 'es', it translates to English ('en') and updates the language in local storage.
 */
function translateElements() {
    var targetLanguage;
    if (localStorage.getItem('lang') != 'es') {
        targetLanguage = 'es';
        localStorage.setItem('lang', 'es');
    }
    else {
        targetLanguage = 'en';
        localStorage.setItem('lang', 'en');
    }
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