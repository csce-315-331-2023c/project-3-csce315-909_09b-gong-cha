const url = 'http://localhost:5000';

function ToggleVis(divName_vis, divName_hide){
    divName_hide.style.display = "none";
    divName_vis.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function() {
    insertinfo();
});

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
        // <button type="button" class="btn btn-light btn-outline-dark btn-lg p-3 m-3" onclick="ToggleVis(buttons, milkDiv)">Back</button>
        //change visibility of current div to hidden
        customizeDiv = document.getElementById("customizeDiv");

        ToggleVis(customizeDiv, json.divName);

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