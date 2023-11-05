url = "http://localhost:5000"; //changes this later
//onload for body, run makeRecipeButtons
document.addEventListener("DOMContentLoaded", function() {
    insertinfo();
});


function createButton(drinkname, json) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-secondary btn-square-lg";
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
    var div = document.createElement("div");
    div.className = "item";
    div.innerHTML = "test";
    /**
     * the div should allow for user to choose whether medium or large
     * also quantity of a drink
     * also remove button
     * and a toppings button that opens a modal, which has a list of toppings
     * this will be done via actionlistener to the toppings button
     */
    //remove button
    //medium or large button
    //quantity 

    
    itempane.appendChild(div); // Corrected variable name
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
    //send to the server
    //display the total cost
    //clear the items pane


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