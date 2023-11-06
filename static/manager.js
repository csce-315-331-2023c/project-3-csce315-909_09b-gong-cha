url = "http://localhost:5000"; //changes this later

function showInputBox() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`inputBox${i}`).classList.add("d-none"); // Reset input boxes to be hidden
  }

  let selectedOption = document.getElementById("options").value;

  document.getElementById(`inputBox${selectedOption}`).classList.remove("d-none");
}

// Adds a drink to the database
function addDrink() {

  var Drink_Name = document.getElementById("add-drink-name").value;
  var Ingredient_Names = document.getElementById('add-ingredients').value;
  var Ingredient_Amount = document.getElementById('add-ingredients-qty').value;
  var Is_Slushy = document.getElementsByName("is-slushy")[0].checked;
  var Med_Price = document.getElementById('med-price-add').value;
  var Large_Price = document.getElementById('lrg-price-add').value;
  var Recipe_Price = document.getElementById('rcp-price-add').value;
  // var request = await fetch(url + "/amongus").then((res) => res.json());
}

// Adds an ingredient to the database
function addIngredient() {

  var Ingredient_Name = document.getElementById("add-ingredient-name").value;
  var Unit_Price = document.getElementById("add-unit-price").value;
  var Stock = document.getElementById("add-unit-price").value;
  var Is_Toppping = document.getElementsByName("is-topping").value;

}

// Modifies name of a drink given drinkID
function modDrinkName() {
  var Drink_Id = document.getElementById('mod-drink-id');
  var Drink_Name = document.getElementById("mod-drink-name").value;
}

// Modifies ingredients & quantities of a drink given drinkID
function modDrinkIngredients() {
  var Drink_Id = document.getElementById('mod-drink-id');

}

// Modifies medium price of a drink given drinkID
function modDrinkMediumPrice() {
  var Drink_Id = document.getElementById('mod-drink-id');
  var Medium_Price = document.getElementById('mod-drink-med-price').value;
}

// Modifies large price of a drink given drinkID
function modDrinkLargePrice() {
  var Drink_Id = document.getElementById('mod-drink-id');
  var Large_Price = document.getElementById('mod-drink-lrg-price').value;

}

// Modifies recipe price of a drink given drinkID
function modDrinkRecipePrice() {
  var Drink_Id = document.getElementById('mod-drink-id');
  var Large_Price = document.getElementById('mod-drink-rcp-price').value;

}

// Modifies an ingredient name given ingredientID
function modIngredientName() {
  var Ingredient_ID = document.getElementById('mod-ingredient-id');
  var Ingredient_Name = document.getElementById('add-ingredient-name');
}

// Modifies an ingredient unit price given ingredientID
function modIngredientUnitPrice() {
  var Ingredient_ID = document.getElementById('mod-ingredient-id');
  var Ingredient_Price = document.getElementById('mod-ingredient-unit-price').value;
}

// Modifies an ingredient stock given ingredientID
function modIngredientStock() {
  var Ingredient_ID = document.getElementById('mod-ingredient-id');
  var Ingredient_Price = document.getElementById('mod-ingredient-stock').value;
}