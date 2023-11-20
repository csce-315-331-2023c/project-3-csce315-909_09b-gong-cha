const url = 'http://localhost:5000';

document.addEventListener("DOMContentLoaded", function() {
    updatePageDynamically();

});
// Function to update the page dynamically
function updatePageDynamically(data) {
    // Your code to update the checkout page based on the new data
    console.log('Updating page with new data:', data);
    //clear the data if needed
    
}

// Check if new data is available
var newDataFlag = localStorage.getItem('newData');
if (newDataFlag === 'true') {
    // Retrieve the stored array of drinks from local storage
    var storedDrinks = JSON.parse(localStorage.getItem('drinks')) || [];

    // Call the function to update the page dynamically
    updatePageDynamically(storedDrinks);

    // Clear the "newData" flag
    localStorage.removeItem('newData');
}
