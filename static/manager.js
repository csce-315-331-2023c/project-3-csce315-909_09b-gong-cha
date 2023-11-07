url = "http://localhost:5000"; //changes this later

document.addEventListener("DOMContentLoaded", function() {
  ingredientTable();
  drinkTable();
});

function showInputBox() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`inputBox${i}`).classList.add("d-none"); // Reset input boxes to be hidden
  }

  let selectedOption = document.getElementById("options").value;

  document.getElementById(`inputBox${selectedOption}`).classList.remove("d-none");
}

// Adds a drink to the database
async function addDrink() {

  var Drink_Name = document.getElementById("add-drink-name").value;
  var Ingredient_Names = document.getElementById('add-ingredients').value;
  var Ingredient_Amount = document.getElementById('add-ingredients-qty').value;
  var Is_Slushy = document.getElementsByName("is-slushy")[0].checked;
  var Med_Price = document.getElementById('med-price-add').value;
  var Large_Price = document.getElementById('lrg-price-add').value;
  var Recipe_Price = document.getElementById('rcp-price-add').value;
  // var request = await fetch(url + "/amongus").then((res) => res.json());

  var drink = {
    'drink_name': Drink_Name,
    'ingredient_names': Ingredient_Names,
    'ingredient_amount': Ingredient_Amount,
    'is_slushy': Is_Slushy,
    'med_price': Med_Price,
    'large_price': Large_Price,
    'recipe_price': Recipe_Price  
  };

  console.log((drink));
  const response = await fetch(url + "/addDrink", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(drink),
  });

  const msg = await response.text();
  console.log(msg);

  drinkTable()
}

// Adds an ingredient to the database
function addIngredient() {

  var Ingredient_Name = document.getElementById("add-ingredient-name").value;
  var Unit_Price = document.getElementById("add-unit-price").value;
  var Stock = document.getElementById("add-stock").value;
  var Is_Topping = document.getElementsByName("is-topping")[1].checked;

  var ingredient = {
    'ingredient_name': document.getElementById("add-ingredient-name").value,
    'unit_price': document.getElementById("add-unit-price").value,
    'stock': document.getElementById("add-stock").value,
    'is_topping': document.getElementsByName("is-topping")[1].checked
  };

  ingredientTable();
}

// Modifies name of a drink given drinkID
async function modDrinkName() {
  var pair = {
    'drink_id': document.getElementById("mod-drink-id").value,
    'drink_name': document.getElementById("mod-drink-name").value
  };

  const response = await fetch(url + "/modDrinkName", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pair),
  });

  const msg = await response.text();
  console.log(msg);

  drinkTable()
}

// Modifies ingredients & quantities of a drink given drinkID
async function modDrinkIngredients() {

  var pair = {
    'drink_id': document.getElementById('mod-drink-id').value,
    'drink_ingredients': document.getElementById('mod-drink-ingredients').value
  };

  const response = await fetch(url + "/modDrinkIngredients", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pair),
  });

  const msg = await response.text();
  console.log(msg);

  drinkTable();
}

// Modifies medium price of a drink given drinkID
async function modDrinkMediumPrice() {
  var pair = {
    'drink_id': document.getElementById('mod-drink-id').value,
    'med_price': document.getElementById('mod-drink-med-price').value
  };

  const response = await fetch(url + "/modDrinkMediumPrice", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pair),
  });

  const msg = await response.text();
  console.log(msg);

  drinkTable()
}

// Modifies large price of a drink given drinkID
async function modDrinkLargePrice() {
  var pair = {
    'drink_id': document.getElementById('mod-drink-id').value,
    'large_price': document.getElementById('mod-drink-lrg-price').value
  };

  const response = await fetch(url + "/modDrinkLargePrice", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pair),
  });

  const msg = await response.text();
  console.log(msg);

  drinkTable()
}

// Modifies recipe price of a drink given drinkID
async function modDrinkRecipePrice() {
  var pair = {
    'drink_id': document.getElementById('mod-drink-id').value,
    'recipe': document.getElementById('mod-drink-rcp-price').value
  };
  const response = await fetch(url + "/modDrinkRecipePrice", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pair),
  });

  const msg = await response.text();
  console.log(msg);

  drinkTable();
}

// Modifies an ingredient name given ingredientID
async function modIngredientName() {

  var pair = {
    'ingredient_id': document.getElementById('mod-ingredient-id').value,
    'ingredient_name': document.getElementById('mod-ingredient-name').value
  };
  console.log("hewwo");
  const response = await fetch(url + "/modIngredientName", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pair),
  });

  const msg = await response.text();
  console.log(msg);

  ingredientTable();
}

// Modifies an ingredient unit price given ingredientID
async function modIngredientUnitPrice() {

  var pair = {
    'ingredient_id': document.getElementById('mod-ingredient-id').value,
    'ingredient_price': document.getElementById('mod-ingredient-unit-price').value
  };

  const response = await fetch(url + "/modIngredientUnitPrice", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pair),
  });

  const msg = await response.text();
  console.log(msg);

}

// Modifies an ingredient stock given ingredientID
async function modIngredientStock() {
  var pair = {
    'ingredient_id': document.getElementById('mod-ingredient-id').value,
    'ingredient_stock': document.getElementById('mod-ingredient-stock').value
  };

  const response = await fetch(url + "/modIngredientStock", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pair),
  });

  const msg = await response.text();
  console.log(msg);
}