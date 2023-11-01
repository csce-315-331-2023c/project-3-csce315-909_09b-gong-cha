function showInputBox() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`inputBox${i}`).classList.add("d-none"); // Reset input boxes to be hidden
  }

  let selectedOption = document.getElementById("options").value;

  document.getElementById(`inputBox${selectedOption}`).classList.remove("d-none");
}

// Adds a drink to the database
function addDrink() {

}

// Adds an ingredient to the database
function addIngredient() {

}

// Modifies name of a drink given drinkID
function modDrinkName() {

}

// Modifies ingredients & quantities of a drink given drinkID
function modDrinkIngredients() {

}

// Modifies medium price of a drink given drinkID
function modDrinkMediumPrice() {

}

// Modifies large price of a drink given drinkID
function modDrinkLargePrice() {

}

// Modifies recipe price of a drink given drinkID
function modDrinkRecipePrice() {

}

// Modifies an ingredient name given ingredientID
function modIngredientName() {

}

// Modifies an ingredient unit price given ingredientID
function modIngredientUnitPrice() {

}

// Modifies an ingredient stock given ingredientID
function modIngredientStock() {

}