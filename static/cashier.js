url = "http://localhost:5000"; //changes this later
//onload for body, run makeRecipeButtons
document.addEventListener("DOMContentLoaded", function() {
    insertinfo();
});

var drinks = new Array();

function createButton(drinkname, json) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-secondary btn-square-lg btn-danger";
    button.innerHTML = drinkname;
    button.addEventListener("click", function() {
      insertIntoReceipt(json);
    });
    return button;
  }
  
/**
 * actionlistener for the buttons, adds the item to the receipt
 */
function insertIntoReceipt(json) {
    var itempane = document.getElementById("items-pane"); // Corrected ID

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

    const textNode = document.createTextNode(json.recipe_name);

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
        console.log(toppings[0])


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
            var textNode = document.createTextNode(toppings[i].ingredient_name);
            labelElement.appendChild(inputElement);
            var div = document.createElement("div");
            div.id = toppings[i].ingredient_id;
            div.appendChild(labelElement);
            div.appendChild(textNode);
            toppingDiv.appendChild(div);
        }
        var confirm = document.getElementById("Confirm");
        confirm.innerHTML = "";
        var confirmButton = document.createElement("button");
        confirmButton.type = "button";
        confirmButton.className = "btn btn-danger w-100 h-10";
        confirmButton.innerHTML = "Confirm";
        confirmButton.addEventListener("click", function(){
                //TODO: update the json, update receipt, close the editDrink page
                //get size data
                // var size = document.getElementById("size");
                // var size = size.options[size.selectedIndex].value;
                // //get sugar data, located in id sugarLevel
                // var sugarLevel = document.getElementById("sugarLevel");
                // var sugar = sugarLevel.options[sugarLevel.selectedIndex].value;
                // //get ice data
                // var iceLevel = document.getElementById("iceLevel");
                // var ice = iceLevel.options[iceLevel.selectedIndex].value;
                //get topping data

                //iterate through id toppingDiv and for each child, get the value and add it to the json

                document.getElementById("RecipeButtons").style.display = "initial";
                document.getElementById("EditDrink").style.display = "none";

        });
        confirm.appendChild(confirmButton);

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
  }

/**
 * reads from database and populates tabs with buttons
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
}

function Checkout(){
    //gather all info from the receipt, request for tip
    document.getElementById("RecipeButtons").style.display = "none";
    var subtotal = document.getElementById("subtotal");
    var amounts = ["15", "18", "20"];

    for(i = 0; i < amounts.length; i++)
    {
        document.getElementById(amounts[i]).innerHTML = amounts[i] + "%\n(" + ((parseFloat(amounts[i]) / 100) * (parseFloat(subtotal.innerHTML))).toFixed(2) + ")";
    }
    document.getElementById("TipButtons").style.display = "initial";

}

function getTipAmount(id)
{
    document.getElementById("tip").innerHTML = ((parseInt(id) / 100) * parseFloat(subtotal.innerHTML)).toFixed(2);
    document.getElementById("total").innerHTML = (parseFloat(document.getElementById("tip").innerHTML) + parseFloat(subtotal.innerHTML)).toFixed(2);
    document.getElementById("TipButtons").style.display = "none";
    document.getElementById("ConfirmCheckout").style.display = "initial";

}

function otherTip()
{
    var input = document.getElementById("otherAmount");
    document.getElementById("tip").innerHTML = parseFloat(input.value).toFixed(2);
    document.getElementById("total").innerHTML = (parseFloat( document.getElementById("tip").innerHTML) + parseFloat( document.getElementById("subtotal").innerHTML)).toFixed(2);
    document.getElementById("TipButtons").style.display = "none";
    document.getElementById("ConfirmCheckout").style.display = "initial";
}

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
        var price = drinks[i].med_price;

        insertOrderItem(new_order_item_id, recipe_id, new_order_id, isMedium, ice, sugar, price);
        
        var ingredient_id = 40;
        var quantity_used = 1;

        insertOrderItemTopping(new_order_item_id, ingredient_id, quantity_used);

    }
    clearOrder()
}

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

function clearOrder()
{
    drinks.splice(0, drinks.length);
    document.getElementById("items-pane").innerHTML = "";
    document.getElementById("subtotal").innerHTML= "0.00";
    document.getElementById("tip").innerHTML= "0.00";
    document.getElementById("total").innerHTML= "0.00";
    document.getElementById("RecipeButtons").style.display = "initial";
    document.getElementById("ConfirmCheckout").style.display = "none";
}
//open up a dropdown menu to ask for changing toppings, ice, sugar, or size
//update the receipt'
//close the dropdown menu

async function getToppings(){
    var request = await fetch(url + "/toppings").then((res) => res.json());
    return request;
}

