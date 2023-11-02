url = "http://localhost:5000"; //changes this later

//onload for body, run makeRecipeButtons
document.body.onload = function(){insertinfo()};
    //add event listeners to each button
    //when clicked, display recipe in the recipe div
    //display ingredients in the ingredients div
    //display instructions in the instructions div

async function insertinfo(){
    var request = await fetch(url + "/recipe").then((res) => res.json());
    console.log(request);
    console.log("from insertinfo");
    var milkTea = document.getElementById("milktea");
    var slushie = document.getElementById("slushie");
    var coffee = document.getElementById("coffee");
    var other = document.getElementById("other");

    //insert the json into the div
    for (var i = 0; i < request.length; i++){
        var button = document.createElement("button");
        button.innerHTML = request[i].recipe_name;
        button.className = "RecipeButton";
        milkTea.appendChild(button);
    }
}
