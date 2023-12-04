/**
 * @fileoverview This file contains functions that changes the text size of the page and buttons for accessibility.
 */
// Function to change text size
/** This function changes the text size of all elements with the class translate based on the selected option. 
 * 
 * @param {string} size 
 */
function changeTextSize(size) {
    const elements = document.querySelectorAll('.translate'); //selects all elements with class translate
    elements.forEach(element => {
        if (size == '100%') {
            element.style.removeProperty('font-size');
        } else {
        element.style.fontSize = size;
        }
    });
    
    const span = document.querySelectorAll('span');
    span.forEach(element => {
        if (size == '100%') {
            element.style.removeProperty('font-size');
        } else {
        element.style.fontSize = size;
        }
    });

    const buttons = document.querySelectorAll('.btn-square-lg');
    buttons.forEach(function (button) {
        // Calculate the width based on text length
        if (size == '100%') {
            button.style.width = 130 + 'px';
            button.style.height = 130 + 'px';
        }
        else if (size == '150%') {

            // Set the button dimensions
            button.style.width = 130 * 3 + 'px';
            button.style.height = 130 * 3 + 'px';
        }
        else{
            button.style.width = 130 * 4 + 'px';
            button.style.height = 130 * 4 + 'px';
        }
      });

      const btn_tip = document.querySelectorAll('.btn-tip');
        btn_tip.forEach(function (button) {
            if (size == '100%') {
                button.style.removeProperty('font-size');
            } else {
                button.style.fontSize = size;
            }
        });

        const table = document.querySelectorAll('table');
        table.forEach(function (button) {
            if (size == '100%') {
                button.style.removeProperty('font-size');
            } else {
                button.style.fontSize = size;
            }
        });
    document.cookie = `textSize=${size}; path=/`;
    }

    // 
/** Retrieve the user's preferred text size from the cookie on page load
 * 
 */
function getSavedTextSize() {
    const size = document.cookie.replace(/(?:(?:^|.*;\s*)textSize\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (size) {
        //replace the selected option with the saved option
        document.getElementById('text-size').value = size;
        //iterate through all dynamically generated items and change their text size
        // const elements = document.querySelectorAll('.translate'); //selects all elements with class translate
        // elements.forEach(element => {
        //     element.style.fontSize = size;
        // });

        changeTextSize(size);

    }   
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', getSavedTextSize);

