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

    editButton.appendChild(editIcon);

    labelElement.appendChild(inputElement);
    innerDiv2.appendChild(labelElement);
    innerDiv2.appendChild(priceTextNode);
    innerDiv2.appendChild(editButton);

    itemDiv.appendChild(innerDiv1);
    itemDiv.appendChild(innerDiv2);

    document.getElementById("subtotal").innerHTML = (parseFloat(document.getElementById("subtotal").innerHTML) + parseFloat(priceTextNode.data)).toFixed(2);
    document.getElementById("total").innerHTML = document.getElementById("subtotal").innerHTML;
    drinks.push(json);

    editButton.addEventListener("click", EditDrink);

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
    //send to the server
    //display the total cost
    //clear the items pane
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

function confirmCheckout()
{
    document.getElementById("items-pane").innerHTML = "";
    document.getElementById("subtotal").innerHTML= "0.00";
    document.getElementById("tip").innerHTML= "0.00";
    document.getElementById("total").innerHTML= "0.00";
    document.getElementById("RecipeButtons").style.display = "initial";
    document.getElementById("ConfirmCheckout").style.display = "none";
}
//open up a dropdown menu to ask for changing toppings, ice, sugar, or size
//update the receipt
//close the dropdown menu
function EditDrink(){
    console.log("edit drink");
   //create the dropdown menu
    //add actionlisteners to each of the buttons
    //update the receipt
    //close the dropdown menu
}