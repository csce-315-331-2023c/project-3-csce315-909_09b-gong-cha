// class Recipe{
//     constructor(recipe_id, recipe_name, is_slush, med_price, large_price, recipe_price){
//         this.recipe_id = recipe_id;
//         this.recipe_name = recipe_name;
//         this.is_slush = is_slush;
//         this.med_price = med_price;
//         this.large_price = large_price;
//         this.recipe_price = recipe_price;
//     }
// }

class RecipeButton{
    //when clicked, i want it to add to the recipe div


}

//request to database to return all recipes
//dynamically create buttons for each recipe returned
//add event listener to each button
async function ReadRecipes() {
    var json = await fetch(url + "/recipe", {method:"GET"}).then((res) => res.json());
    console.log(json);
    return json;
}

async function makeRecipeButtons(){
    //get all recipes from database
    var recipes = await ReadRecipes(); //recipe is a json
    //we insert depending on tabcontent
    var milkTea = document.getElementById("milktea");
    var slushie = document.getElementById("slushie");
    var coffee = document.getElementById("coffee");
    var other = document.getElementById("other");

    for(var i = 0; i < recipes.length; i++){
        var button = document.createElement("button");
        button.innerHTML = recipes[i].recipe_name;
        button.id = recipes[i].recipe_id;
        button.className = "RecipeButton";
        if(recipes[i].is_slush){
            slushie.appendChild(button);
        }
        else if(recipes[i].recipe_name.includes("milk")){
            milkTea.appendChild(button);
        }
        else if(recipes[i].recipe_name.includes("coffee")){
            coffee.appendChild(button);
        }
        else{
            other.appendChild(button);
        }
    }
    //add event listeners to each button
    //when clicked, display recipe in the recipe div
    //display ingredients in the ingredients div
    //display instructions in the instructions div

}