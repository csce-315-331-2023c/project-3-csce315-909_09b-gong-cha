// Function to change text size
function changeTextSize(size) {
    $('body').css('font-size', size);

    // Save the user's preference in a cookie
    document.cookie = `textSize=${size}; path=/`;
    }

    // Retrieve the user's preferred text size from the cookie on page load
    function getSavedTextSize() {
    const size = document.cookie.replace(/(?:(?:^|.*;\s*)textSize\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (size) {
        changeTextSize(size);
        $('#text-size').val(size);
        //get button, and change the text
        var button = document.getElementById("translate");
        button.style.fontSize = size;
    }   
    }

    // Call the function on page load
    $(document).ready(function () {
    getSavedTextSize();
    });