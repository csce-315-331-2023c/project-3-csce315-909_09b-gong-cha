function Translate(){

}

class RecipeButton{
    //when clicked, i want it to add to the recipe div

}

//request to database to return all recipes
//dynamically create buttons for each recipe returned
//add event listener to each button
async function ReadRecipes() {
    var json = await fetch(url + "/recipe", {method:"GET"}).then((res) => res.json());
    console.log(json);

}

async function makeRecipeButtons(){
    var RecipeButtons = document.getElementById("RecipeButtons");
    //insert buttons into RecipeButtons
    //add event listeners to each button
    //when clicked, display recipe in the recipe div
    //display ingredients in the ingredients div
    //display instructions in the instructions div

}