const url = 'http://localhost:5000';

function ToggleVis(divName_vis, divName_hide){
    divName_hide.style.display = "none";
    divName_vis.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function() {
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
        //TODO: hidden field to store the price of the topping
        var price = document.createElement("p");
        price.style.display = "none";
        price.innerHTML = toppings[i].unit_price;
        div.appendChild(price);

        toppingDiv.appendChild(div);
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
}

function createButton(drinkname, json) {
    var button = document.createElement("button");
    // <button type="button" class="btn btn-light btn-outline-dark btn-lg"><img src="images/teas/1.png">Milk Tea Series</button>
    
    button.type = "button";
    button.className = "btn btn-light btn-outline-dark btn-lg";
    const image = document.createElement('img');
    image.src = 'images/teas/' + json.recipe_id + '.png';
    
    button.textContent = drinkname;
    button.appendChild(image);

    button.addEventListener("click", function() {
        console.log(json);

        //put the toppings in the div
        putToppingsinDiv();
        
        //switch to customize page
        ToggleVis(customizeDiv, json.divName);
        //TODO: add edit button to customizeDiv, which will call sendtocheckout(json)
        //TODO: send json to checkout.html

        //TODO: this time, 
        sendtocheckout(json);
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
}