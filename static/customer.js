/**
 * @fileoverview This file contains functions for the customer page
 */

const url = 'https://csce-315-project-3-gong-cha.onrender.com/';

/*preset arrays so we can quickly determine ice levels */
var ice_ary = ["regular", "light", "none"]
var sugar_ary = ["100%", "70%", "50%", "30%", "0%"]
function ToggleVis(divName_vis, divName_hide){
    divName_hide.style.display = "none";
    divName_vis.style.display = "block";
}

//TODO: reset the forms with id size, sugarlevel, and icelevel back to default
function resetForms(){
      // Reset the Size select
      document.getElementById('size').selectedIndex = 0;

      // Reset the Sugar Level select
      document.getElementById('sugarLevel').selectedIndex = 0;

      // Reset the Ice Level select
      document.getElementById('iceLevel').selectedIndex = 0;;
}


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

    insertinfo();
});

async function getToppings(){
    var request = await fetch(url + "/toppings").then((res) => res.json());
    return request;
}

async function putToppingsinDiv(){
    var toppings = await getToppings();
    //change visiblility of #editDrink

    //create confirm button, applies changes to the drink
    //insert into toppingDiv
    var toppingDiv = document.getElementById("toppingDiv");
    toppingDiv.innerHTML = "";
    for (var i = 0; i < toppings.length; i++){
        //use above format
        var labelElement = document.createElement("label");
        labelElement.setAttribute("for", "quantity");
        var inputElement = document.createElement("input");
        inputElement.classList.add("form-control");
        inputElement.type = "number";
        inputElement.min = "1";
        inputElement.max = "10";
        var textNode = document.createElement("span");
        textNode.textContent = toppings[i].ingredient_name;
        textNode.classList = "translate"
        labelElement.appendChild(inputElement);
        var div = document.createElement("div");
        div.id = toppings[i].ingredient_id;
        div.appendChild(labelElement);
        div.appendChild(textNode);
        //TODO: hidden field to store the price of the topping
        var price = document.createElement("p");
        price.style.display = "none";
        price.innerHTML = toppings[i].unit_price;
        div.appendChild(price);

        toppingDiv.appendChild(div);
    }
    if (localStorage.getItem('lang') == 'es') {
        translateElements2('es');
    }
}

function sendtocheckout(json){
    var jsonData = json;

    // // Retrieve existing data from local storage or initialize an empty array
    var existingData = JSON.parse(localStorage.getItem('drinks')) || [];
    console.log(existingData);
    // // Add the new drink data to the array
    existingData.push(jsonData);

    // // Store the updated array back in local storage
    localStorage.setItem('drinks', JSON.stringify(existingData));

    // // Notify checkout.html that new data is updated (optional)
    localStorage.setItem('newData', 'true');

    alert("Drink has been added to shopping cart!");
}

var img_change = document.getElementById("img");
var name_change = document.getElementById("name");

function createButton(drinkname, json) {
    var button = document.createElement("button");
    // <button type="button" class="btn btn-light btn-outline-dark btn-lg"><img src="images/teas/1.png">Milk Tea Series</button>
    
    button.type = "button";
    button.className = "btn btn-light btn-outline-dark btn-lg";
    const image = document.createElement('img');
    image.src = 'images/teas/' + json.recipe_id + '.png';

    const text = document.createElement('span');
    text.textContent = drinkname;
    text.classList = "translate";
    
    button.appendChild(text);
    button.appendChild(image);

    button.addEventListener("click", function() {
        console.log(json);

        //put the toppings in the div
        putToppingsinDiv();
        
        //switch to customize page
        //TODO: change image and name in customizeDiv
        img_change.src = 'images/teas/' + json.recipe_id + '.png';
        name_change.textContent = drinkname;
        
        ToggleVis(customizeDiv, json.divName);

        //TODO: add edit button to customizeDiv, which will call sendtocheckout(json)
        const checkout = document.createElement("button");
        checkout.type = "button";
        checkout.className = "btn btn-light btn-outline-dark btn-lg translate";
        checkout.textContent = "Add to Cart";
        //add button to the checkout id
        var checkoutDiv = document.getElementById("checkout");
        checkoutDiv.innerHTML = "";
        checkoutDiv.appendChild(checkout);

        //TODO: when checkout is hit, send json to checkout.html
        checkout.addEventListener("click", function(){
            //parse through and get size, ice, sugar and toppings
            console.log("checkout button clicked");

            var selected_info_ary = [];
            //get size
            var size = document.getElementById("size").selectedIndex;
            if(size == 0){
                json.cur_price = parseFloat(json.med_price);
            }
            else{
                json.cur_price = parseFloat(json.large_price);
            }

            //get ice
            var ice = document.getElementById("iceLevel").selectedIndex;
            //get sugar
            var sugar = document.getElementById("sugarLevel").selectedIndex;

            console.log(size, ice, sugar);

            selected_info_ary.push({is_medium: size == 0 ? true : false})
            selected_info_ary.push({ice_level: ice_ary[ice]})
            selected_info_ary.push({sugar_level: sugar_ary[sugar]})

            //get toppings
            var topping_ary = [];
            var toppingDivs = document.querySelectorAll("#toppingDiv > div");
            // Loop through each topping div
            toppingDivs.forEach(function(toppingDiv) {
                var toppingId = toppingDiv.id;
                var quantity = parseInt(toppingDiv.querySelector("input[type=number]").value, 10);
                //get the price of the topping
                var price = parseFloat(toppingDiv.querySelector("p").innerHTML);
                // Check if the quantity is greater than 0
                if (quantity > 0) {
                  topping_ary.push({ ingredient_id: toppingId, quantity: quantity });
                  json.cur_price = parseFloat(json.cur_price) + price * quantity
                }
              });
  
            json.edit_info = selected_info_ary;
            json.topping_info = topping_ary;

            console.log(json);
            //TODO: send json to checkout.html
            sendtocheckout(json);

            //TODO: default values for size, ice, sugar
            resetForms();
            //switch to the buttons page
            ToggleVis(json.divName, customizeDiv);
        });

        //change customizeDiv's elements to match that of the drink
        
    });
    return button;
}

async function insertinfo(){
    var request = await fetch(url + "/recipe").then((res) => res.json());
    
    var milkTea = document.getElementById("milktea");
    var slushie = document.getElementById("slush");
    var coffee = document.getElementById("coffee");
    var tea = document.getElementById("tea");
    var other = document.getElementById("other");
    //clear all the divs
    milkTea.innerHTML = "";
    slushie.innerHTML = "";
    coffee.innerHTML = "";
    tea.innerHTML = "";
    other.innerHTML = "";
    //insert the json into the div
    for (var i = 0; i < request.length; i++){
        button = createButton(request[i].recipe_name, request[i]);
        let name = request[i].recipe_name;
        if(request[i].is_slush){
            request[i].divName = document.getElementById("slushDiv");
            slushie.appendChild(button);
        }
        else if(name.includes("Coffee")){
            request[i].divName = document.getElementById("coffeeDiv");
            coffee.appendChild(button);
        }
        else if(name.includes("Milk")){
            request[i].divName = document.getElementById("milkDiv");
            milkTea.appendChild(button);
        }
        else if(name.includes("Tea")){
            request[i].divName = document.getElementById("teaDiv");
            tea.appendChild(button);
        }
        else{
            request[i].divName = document.getElementById("otherDiv");
            other.appendChild(button);
        }
    }
    if (localStorage.getItem('lang') == 'es') {
        translateElements2('es');
    }
}

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