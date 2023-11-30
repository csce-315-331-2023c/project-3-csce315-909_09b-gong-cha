function translateElements() {
    const elements = document.querySelectorAll('.translate');
    const targetLanguage = 'es';
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