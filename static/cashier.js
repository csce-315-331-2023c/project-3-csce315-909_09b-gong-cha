const url = 'https://csce-315-project-3-gong-cha.onrender.com';

/**
 * @fileoverview This file contains all the functions that are used to display the cashier page.
 */
//onload for body, run makeRecipeButtons
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

  if (isEmployee == 'false') {
    alert("no access 🤪");
    window.location.href = 'about.html';
  }
  
  if (isLoggedIn == 'true') {
    this.getElementById('oauth').textContent = "Logout";
    this.getElementById('oauth').href = "/logout";
  }
  else {
    this.getElementById('oauth').textContent = "Login";
    this.getElementById('oauth').href = "/login";
  }
  if (localStorage.getItem('lang') == 'es') {
    translateElements2('es');
  }

  insertinfo();
});

var drinks = new Array();
var drinks_edit = new Array();

/** Helper function to dynamically create the menu items on the menu page. Accesses the file of the drink in the teas folder.
 * 
 * @param {string} drinkname 
 * @param {json} json 
 * @returns Button element
 */
function createButton(drinkname, json) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-secondary btn-square-lg btn-danger translate";
    button.innerHTML = drinkname;
    button.style.width = "130px";
    button.style.height = "130px";
    button.addEventListener("click", function() {
      insertIntoReceipt(json);
    });
    return button;
}
  
/**
 * actionlistener for the buttons, adds the item to the receipt
 * @param {json} json
 * @returns void
 */
function insertIntoReceipt(json) {
    
    var itempane = document.getElementById("items-pane"); 
    json.cur_price = json.med_price;
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const innerDiv1 = document.createElement("div");

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
          for(i = 0; i < drinks.length; i++)
          {
            if(drinks[i].recipe_name == itemDiv.children[0].textContent)
            {
                drinks.splice(i, 1);
                break;
            }
          }
        }
      });

    buttonElement.appendChild(iconElement);

    const textNode = document.createElement("span");
    textNode.classList = "translate";
    textNode.textContent = json.recipe_name;

    innerDiv1.appendChild(buttonElement);
    innerDiv1.appendChild(textNode);

    const innerDiv2 = document.createElement("div");
    innerDiv2.classList.add("d-flex");

    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", "quantity");

    const inputElement = document.createElement("input");
    inputElement.classList.add("form-control");
    inputElement.setAttribute("type", "number");
    inputElement.setAttribute("value", "1");
    inputElement.setAttribute("min", "1");
    inputElement.setAttribute("max", "10");

    const priceTextNode = document.createTextNode(json.med_price);

    const editButton = document.createElement("button");
    editButton.setAttribute("type", "button");
    editButton.classList.add("btn", "rounded-5");

    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-regular", "fa-pen-to-square", "fa-lg");
    
    //TODO: create associated json for each drink with relevant info, the editbutton will open up a menu to change the toppings, ice, sugar, or size
    //then, the editbutton will change the json and update the receipt
    editButton.appendChild(editIcon);
    editButton.addEventListener("click", async function(){
        //TODO: make page to edit drink
        //retrieve toppings
        document.getElementById("RecipeButtons").style.display = "none";
        document.getElementById("EditDrink").style.display = "initial";
        var toppings = await getToppings();
        //change visiblility of #editDrink

        //create confirm button, applies changes to the drink
        //insert into toppingDiv
        var toppingDiv = document.getElementById("toppingDiv");
        toppingDiv.innerHTML = "";
        for (var i = 0; i < toppings.length; i++){
            //use above format
            /**                
             <label for="quantity"><input class="form-control" type="number" value="1" min="1" max="10"></label>
            <label for="topping1">Topping 1</label> */
            var labelElement = document.createElement("label");
            labelElement.setAttribute("for", "quantity");
            var inputElement = document.createElement("input");
            inputElement.classList.add("form-control");
            inputElement.type = "number";
            inputElement.min = "1";
            inputElement.max = "10";
            var textNode = document.createElement("span");
            textNode.classList = "translate";
            textNode.textContent = toppings[i].ingredient_name;
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

        var confirm = document.getElementById("Confirm");
        confirm.innerHTML = "";
        var confirmButton = document.createElement("button");
        confirmButton.type = "button";
        confirmButton.className = "btn btn-danger w-100 h-10 translate";
        confirmButton.innerHTML = "Confirm";
        confirmButton.addEventListener("click", function(){
          //TODO: update the json, update receipt, close the editDrink page
          //TODO: subtract cur_price from subtotal, recalculate cur_price, add cur_price to subtotal
          //subtract cur price from subtotal
          document.getElementById("subtotal").innerHTML = (parseFloat(document.getElementById("subtotal").innerHTML) - parseFloat(json.cur_price)).toFixed(2);
          //do same for total
          document.getElementById("total").innerHTML = (parseFloat(document.getElementById("total").innerHTML) - parseFloat(json.cur_price)).toFixed(2);
          
          var selected_info_ary = [];
          // Get all radio buttons with the name "sizeoptions"
          var sizeOptions = document.querySelectorAll('input[name="sizeoptions"]');
          for (var i = 0; i < sizeOptions.length; i++) {
            if (sizeOptions[i].checked) {
              // Get the label text associated with the selected radio button
              selectedSize = sizeOptions[i].parentElement.textContent.trim();
              //if selected size is medium, then set isMedium to true, else false
              selected_info_ary.push({is_medium: selectedSize == "Medium" ? true : false})
              //set cur_price to the price of the selected size
              if(selectedSize == "Medium"){
                json.cur_price = parseFloat(json.med_price);
              }
              else if(selectedSize == "Large"){
                json.cur_price = parseFloat(json.large_price);
              }
              
              break; // Exit the loop when a selected option is found
            }
          }
          //get ice and sugar
          var iceOptions = document.querySelectorAll('input[name="iceoptions"]');
            for (var i = 0; i < iceOptions.length; i++) {
              if (iceOptions[i].checked) {
                // Get the label text associated with the selected radio button
                selectedIce = iceOptions[i].parentElement.textContent.trim();
                selected_info_ary.push({ice: selectedIce})
                break; // Exit the loop when a selected option is found
              }
            }

          var sugarOptions = document.querySelectorAll('input[name="sugaroptions"]');
            for (var i = 0; i < sugarOptions.length; i++) {
              if (sugarOptions[i].checked) {
                // Get the label text associated with the selected radio button
                selectedSugar = sugarOptions[i].parentElement.textContent.trim();
                selected_info_ary.push({sugar: selectedSugar})
                break; // Exit the loop when a selected option is found
              }
            }
          

          //TODO: get topping data
            var toppingDivs = document.querySelectorAll("#toppingDiv > div");
            var topping_ary = [];

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
          
          
          document.getElementById("subtotal").innerHTML = (parseFloat(document.getElementById("subtotal").innerHTML) + parseFloat(json.cur_price)).toFixed(2);
          document.getElementById("total").innerHTML = (parseFloat(document.getElementById("total").innerHTML) + parseFloat(json.cur_price)).toFixed(2);
          priceTextNode.data = parseFloat(json.cur_price).toFixed(2);
          document.getElementById("RecipeButtons").style.display = "initial";
          document.getElementById("EditDrink").style.display = "none";
          //send this info to confirmcheckout
          
        });
        confirm.appendChild(confirmButton);
        if (localStorage.getItem('lang') == 'es') {
          translateElements2('es');
        }
    });

    labelElement.appendChild(inputElement);
    innerDiv2.appendChild(labelElement);
    innerDiv2.appendChild(priceTextNode);
    innerDiv2.appendChild(editButton);

    itemDiv.appendChild(innerDiv1);
    itemDiv.appendChild(innerDiv2);

    document.getElementById("subtotal").innerHTML = (parseFloat(document.getElementById("subtotal").innerHTML) + parseFloat(priceTextNode.data)).toFixed(2);
    document.getElementById("total").innerHTML = document.getElementById("subtotal").innerHTML;
    
    drinks.push(json);
    itempane.appendChild(itemDiv); 

    if (localStorage.getItem('lang') == 'es') {
      translateElements2('es');
    }
  }

/**
 * Function that reads from database and populates tabs with buttons
 */
async function insertinfo(){
    var request = await fetch(url + "/recipe").then((res) => res.json());
    
    var milkTea = document.getElementById("milktea");
    var slushie = document.getElementById("slushie");
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
            slushie.appendChild(button);
        }
        else if(name.includes("Coffee")){
            coffee.appendChild(button);
        }
        else if(name.includes("Milk")){
            milkTea.appendChild(button);
        }
        else if(name.includes("Tea")){
            tea.appendChild(button);
        }
        else{
            other.appendChild(button);
        }
    }
    if (localStorage.getItem('lang') == 'es') {
      translateElements2('es');
    }
}

/**
 * Function that gathers current items in the reciept, prompts the user to confirm the order, and sends the order to the database.
 * @returns void
 */
function Checkout(){
    //gather all info from the receipt, request for tip
    document.getElementById("RecipeButtons").style.display = "none";
    document.getElementById("checkout").disabled = true;
    var subtotal = document.getElementById("subtotal");
    var amounts = ["15", "18", "20"];

    for(i = 0; i < amounts.length; i++)
    {
        document.getElementById(amounts[i]).innerHTML = amounts[i] + "%\n(" + ((parseFloat(amounts[i]) / 100) * (parseFloat(subtotal.innerHTML))).toFixed(2) + ")";
    }
    document.getElementById("TipButtons").style.display = "initial";
}

/**
 * Takes the tip amount from the button and updates the receipt.
 * @param {int} id 
 */
function getTipAmount(id)
{
    document.getElementById("tip").innerHTML = ((parseInt(id) / 100) * parseFloat(subtotal.innerHTML)).toFixed(2);
    document.getElementById("total").innerHTML = (parseFloat(document.getElementById("tip").innerHTML) + parseFloat(subtotal.innerHTML)).toFixed(2);
    document.getElementById("TipButtons").style.display = "none";
    document.getElementById("ConfirmCheckout").style.display = "initial";

}

/**
 * Function that Processes the tip amount and sends the order to the database, should the user specify a different tip amount.
 */
function otherTip()
{
    var input = document.getElementById("otherAmount");
    document.getElementById("tip").innerHTML = parseFloat(input.value).toFixed(2);
    document.getElementById("total").innerHTML = (parseFloat( document.getElementById("tip").innerHTML) + parseFloat( document.getElementById("subtotal").innerHTML)).toFixed(2);
    document.getElementById("TipButtons").style.display = "none";
    document.getElementById("ConfirmCheckout").style.display = "initial";
}

/**
 * Function that sends the order to the database and clears the receipt.
 */
async function confirmCheckout()
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
    for(i = 0; i < drinks.length; i++) 
    {

        new_order_item_id += 1;
        var recipe_id = drinks[i].recipe_id;
        var isMedium = true;
        var ice = "regular";
        var sugar = "100%";
        var edit_info = drinks[i].edit_info;
        if(edit_info != null)
        {
          //TODO: change isMedium, ice, sugar
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

        var price = drinks[i].med_price;

        insertOrderItem(new_order_item_id, recipe_id, new_order_id, isMedium, ice, sugar, price);

        var topping_info = drinks[i].topping_info;
        if(topping_info != null){
          //for each topping, insert into orderitemtoppings
          for(var j = 0; j < topping_info.length; j++){
            ingredient_id = topping_info[j].ingredient_id;
            quantity_used = topping_info[j].quantity;
            insertOrderItemTopping(new_order_item_id, ingredient_id, quantity_used);
          }
        }

    }
    clearOrder()
}

/**
 * Function that handles backend insertion of the order into the database. Takes in the username, order_id, date, time, subtotal, and tip.
 * @param {*} username 
 * @param {*} order_id 
 * @param {*} date 
 * @param {*} time 
 * @param {*} subtotal 
 * @param {*} tip 
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
 * Function that handles backend insertion of the order item into the database. Takes in the order_item_id, recipe_id, order_id, is_medium, ice, sugar, and price.
 * @param {*} order_item_id 
 * @param {*} recipe_id 
 * @param {*} order_id 
 * @param {*} is_medium 
 * @param {*} ice 
 * @param {*} sugar 
 * @param {*} price 
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
 * Function that handles backend insertion of the order item topping into the database. Takes in the order_item_id, ingredient_id, and quantity.
 * @param {*} order_item_id 
 * @param {*} ingredient_id 
 * @param {*} quantity 
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
 * Function that clears the reciept on the page and resets the page to the original state.
 */
function clearOrder()
{
    drinks.splice(0, drinks.length);
    document.getElementById("items-pane").innerHTML = "";
    document.getElementById("subtotal").innerHTML= "0.00";
    document.getElementById("tip").innerHTML= "0.00";
    document.getElementById("total").innerHTML= "0.00";
    document.getElementById("RecipeButtons").style.display = "initial";
    document.getElementById("ConfirmCheckout").style.display = "none";
    document.getElementById("checkout").disabled = false;

    
}
//open up a dropdown menu to ask for changing toppings, ice, sugar, or size
//update the receipt'
//close the dropdown menu

/**
 * Function that uses api call to access the toppings from the database.  
 * @returns json
 */
async function getToppings(){
    var request = await fetch(url + "/toppings").then((res) => res.json());
    return request;
}

/** Function to translate the elements on the menu page. Iteratews through all elements with class translate and translates them to the target language.
 * 
 * @param {string} lang 
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