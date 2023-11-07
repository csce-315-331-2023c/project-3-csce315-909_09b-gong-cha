const url = "http://localhost:5000"; //changes this later
function showInputBox() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`inputBox${i}`).classList.add("d-none"); // Reset input boxes to be hidden
  }

  let selectedOption = document.getElementById("options").value;

  document.getElementById(`inputBox${selectedOption}`).classList.remove("d-none");
}

// Adds a drink to the database
async function addDrink() {

  var drink = {
    'drink_name': document.getElementById("add-drink-name").value,
    'ingredient_names': document.getElementById('add-ingredients').value,
    'ingredient_amount': document.getElementById('add-ingredients-qty').value,
    'is_slushy': document.getElementsByName("is-slushy")[1].checked,
    'med_price': document.getElementById('med-price-add').value,
    'large_price': document.getElementById('lrg-price-add').value,
    'recipe_price': document.getElementById('rcp-price-add').value
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
}

// Adds an ingredient to the database
async function addIngredient() {

  var ingredient = {
    'ingredient_name': document.getElementById("add-ingredient-name").value,
    'unit_price': document.getElementById("add-unit-price").value,
    'stock': document.getElementById("add-stock").value,
    'is_topping': document.getElementsByName("is-topping")[1].checked,
    'minimum_quantity': document.getElementById("add-minimum-quantity").value

  };

  const response = await fetch(url + "/addIngredient", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ingredient),
  });

  const msg = await response.text();
  console.log(msg);

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
}

// Modifies ingredients & quantities of a drink given drinkID
async function modDrinkIngredients() {

  var trio = {
    'drink_id': document.getElementById('mod-drink-id').value,
    'ingredients_name': document.getElementById('mod-drink-ingredients').value,
    'ingredients_quantity': document.getElementById('mod-drink-ingredients-qty').value
  };

  const response = await fetch(url + "/modDrinkIngredients", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trio),
  });

  const msg = await response.text();
  console.log(msg);

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