/**
 * @fileoverview This file contains functions for checking out
 */

const url = 'https://csce-315-project-3-gong-cha.onrender.com';

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

  if (isLoggedIn == 'false') {
    window.location.href = 'login.html';
  }

  if (isLoggedIn == 'true') {
    this.getElementById('oauth').textContent = "Logout";
    this.getElementById('oauth').href = "/logout";
  }
  else {
    this.getElementById('oauth').textContent = "Login";
    this.getElementById('oauth').href = "/login";
  }

  var storedDrinks = JSON.parse(localStorage.getItem('drinks')) || [];
  // Call the function to update the page dynamically
  document.getElementById("items-pane").innerHTML = "";
  for(var i = 0; i < storedDrinks.length; i++)
  {
      updatePageDynamically(storedDrinks[i]);
  }
  if (localStorage.getItem('lang') == 'es') {
    translateElements2('es');
  }
});


/**
 * Updates the page dynamically with item information.
 * @param {Object} json - JSON object representing item information.
 */
function updatePageDynamically(json) {
  var itempane = document.getElementById("items-pane"); 
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("row", "item");

  const imageColumn = document.createElement("div");
  imageColumn.classList.add("col-md-2");

  const imgElement = document.createElement("img");
  imgElement.setAttribute("src", "images/teas/" + json.recipe_id + ".png");
  imgElement.classList.add("img-fluid");
  imageColumn.appendChild(imgElement);

  const nameColumn = document.createElement("div");
  nameColumn.classList.add("col-md-8");

  const nameDiv = document.createElement("div");
  const textNode = document.createElement("span");
  textNode.textContent = json.recipe_name;
  textNode.classList = "translate";
  nameDiv.appendChild(textNode);
  nameColumn.appendChild(nameDiv);

  const buttonColumn = document.createElement("div");
  buttonColumn.classList.add("col-md-1");

  const buttonElement = document.createElement("button");
  buttonElement.setAttribute("type", "button");
  buttonElement.classList.add("btn", "rounded-5");

  const iconElement = document.createElement("i");
  iconElement.classList.add("fa-regular", "fa-circle-xmark", "fa-lg");

  iconElement.addEventListener("click", function () {
    if (itemDiv.parentNode) {
      itemDiv.parentNode.removeChild(itemDiv);
      document.getElementById("subtotal").innerHTML = (parseFloat(document.getElementById("subtotal").innerHTML) - parseFloat(priceTextNode.data)).toFixed(2);
      document.getElementById("total").innerHTML = document.getElementById("subtotal").innerHTML;
      var storedDrinks = JSON.parse(localStorage.getItem('drinks')) || [];

      for(i = 0; i < storedDrinks.length; i++)
      {
        console.log(storedDrinks[i].recipe_name);
        console.log(itemDiv.children[1].children[0].textContent);
        if(storedDrinks[i].recipe_name == itemDiv.children[1].children[0].textContent)
        {
          console.log("equals");
            storedDrinks.splice(i, 1);
            localStorage.setItem('drinks', JSON.stringify(storedDrinks));
            break;
        }
      }
    }
  });

  buttonElement.appendChild(iconElement);
  buttonColumn.appendChild(buttonElement);

  const priceDiv = document.createElement("div");

  const priceTextNode = document.createTextNode(json.cur_price);
  priceDiv.appendChild(priceTextNode);
  nameColumn.appendChild(priceDiv);

  itemDiv.appendChild(imageColumn);
  itemDiv.appendChild(nameColumn);
  itemDiv.appendChild(buttonColumn);

  document.getElementById("subtotal").innerHTML = (parseFloat(document.getElementById("subtotal").innerHTML) + parseFloat(priceTextNode.data)).toFixed(2);
  document.getElementById("total").innerHTML = document.getElementById("subtotal").innerHTML;

  itempane.appendChild(itemDiv);
}

/**
 * Calculates tip based on a percentage.
 * @param {number} tipPercentage - The tip percentage to calculate.
 */
function calculateTip(tipPercentage) {
  let subtotal = parseFloat(document.getElementById("subtotal").innerText);
  let tipAmount = (subtotal * tipPercentage) / 100;
  document.getElementById("tip").innerText = tipAmount.toFixed(2);
  let total = subtotal + tipAmount;
  document.getElementById("total").innerText = total.toFixed(2);
}

/**
 * Handles the checkout process.
 */
async function checkout()
{
    var username = "68164488";
    var getDate = new Date();
    var date = getDate.getFullYear() + "-" + (getDate.getMonth() + 1) + "-" + getDate.getDate();
    var time = getDate.getHours() + ":" + getDate.getMinutes() + ":" + getDate.getSeconds();
    var last_order_id = await fetch(url + "/orderid").then((res) => res.json());

    var new_order_id = last_order_id[0].order_id + 1;
    var subtotal = document.getElementById("subtotal").innerHTML;
    var tip = document.getElementById("tip").innerHTML;

    insertOrder(username, new_order_id, date, time, subtotal, tip);

    var last_order_item_id = await fetch(url + "/orderitemid").then((res) => res.json());
    var new_order_item_id = last_order_item_id[0].order_item_id;
    var storedDrinks = JSON.parse(localStorage.getItem('drinks')) || [];
    for(i = 0; i < storedDrinks.length; i++) 
    {

        new_order_item_id += 1;
        var recipe_id = storedDrinks[i].recipe_id;
        var isMedium = true;
        var ice = "regular";
        var sugar = "100%";
        var edit_info = storedDrinks[i].edit_info;
        if(edit_info != null)
        {
          for(var j = 0; j < edit_info.length; j++){
            if(edit_info[j].is_medium != null){
              isMedium = edit_info[j].is_medium;
            }
            else if(edit_info[j].ice != null){
              ice = edit_info[j].ice;
            }
            else if(edit_info[j].sugar != null){
              sugar = edit_info[j].sugar;
            }
          }

        }

        var price = storedDrinks[i].med_price;

        insertOrderItem(new_order_item_id, recipe_id, new_order_id, isMedium, ice, sugar, price);

        var topping_info = storedDrinks[i].topping_info;
        if(topping_info != null){
          //for each topping, insert into orderitemtoppings
          for(var j = 0; j < topping_info.length; j++){
            ingredient_id = topping_info[j].ingredient_id;
            quantity_used = topping_info[j].quantity;
            insertOrderItemTopping(new_order_item_id, ingredient_id, quantity_used);
          }
        }
    }
    localStorage.removeItem('drinks');
    alert("successfully ordered!");
    document.getElementById("items-pane").innerHTML = "";
    document.getElementById("subtotal").innerHTML = "0.00";
}

/**
 * Inserts an order into the database.
 * @param {string} username - The username associated with the order.
 * @param {number} order_id - The order ID.
 * @param {string} date - The date of the order.
 * @param {string} time - The time of the order.
 * @param {number} subtotal - The subtotal of the order.
 * @param {number} tip - The tip amount for the order.
 */
async function insertOrder(username, order_id, date, time, subtotal, tip)
{
    var pair = {
        'username': username,
        'order_id': order_id,
        'date': date,
        'subtotal': subtotal,
        'tip': tip,
        'time': time
      };
      const response = await fetch(url + "/order", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pair),
      });
}

/**
 * Inserts an order item into the database.
 * @param {number} order_item_id - The order item ID.
 * @param {number} recipe_id - The recipe ID associated with the order item.
 * @param {number} order_id - The order ID associated with the order item.
 * @param {boolean} is_medium - Flag indicating if the item is medium-sized.
 * @param {string} ice - The type of ice for the order item.
 * @param {string} sugar - The sugar level for the order item.
 * @param {number} price - The price of the order item.
 */
async function insertOrderItem(order_item_id, recipe_id, order_id, is_medium, ice, sugar, price)
{
    var pair = {
        'order_item_id': order_item_id,
        'recipe_id': recipe_id,
        'order_id': order_id,
        'is_medium': is_medium,
        'ice': ice,
        'sugar': sugar,
        'price': price
      };
      const response = await fetch(url + "/orderitem", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pair),
      });
}

/**
 * Inserts order item topping information into the database.
 * @param {number} order_item_id - The order item ID associated with the topping.
 * @param {number} ingredient_id - The ingredient ID of the topping.
 * @param {number} quantity - The quantity of the topping.
 */
async function insertOrderItemTopping(order_item_id, ingredient_id, quantity)
{
    var pair = {
        'order_item_id': order_item_id,
        'ingredient_id': ingredient_id,
        'quantity': quantity,
      };
      const response = await fetch(url + "/orderitemtoppings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pair),
      });
}

/**
 * Translates elements to a specified language using Google Translate API.
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