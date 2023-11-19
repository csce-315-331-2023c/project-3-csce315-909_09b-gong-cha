const url = 'http://localhost:5000';


document.addEventListener("DOMContentLoaded", function() {
  ingredientTable();
  drinkTable();
  generateRestockReport();
  getDrinks();
  getIngredients();
});

function showInputBox() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`inputBox${i}`).classList.add("d-none"); // Reset input boxes to be hidden
  }

  let selectedOption = document.getElementById("options").value;

  document.getElementById(`inputBox${selectedOption}`).classList.remove("d-none");
}

function showReport() {
  for (let i = 1; i <= 3; i++) {
    document.getElementById(`report${i}`).classList.add("d-none"); // Reset report to be hidden
  }

  let selectedOption = document.getElementById("reportOptions").value;

  document.getElementById(`report${selectedOption}`).classList.remove("d-none");
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

  drinkTable()
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

  ingredientTable();
}

// Modifies name of a drink given drinkID
async function modDrinkName() {
  var select = document.getElementById('drinkList');

  var pair = {
    'drink_id': select.value,
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

  setTimeout(() => {
    getDrinks();
    drinkTable()
  }, 200);
}

// Modifies ingredients & quantities of a drink given drinkID
async function modDrinkIngredients() {
  var select = document.getElementById('drinkList');

  var trio = {
    'drink_id': select.value,
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
  var select = document.getElementById('drinkList');

  var pair = {
    'drink_id': select.value,
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

  setTimeout(() => {
    drinkTable()
  }, 200);
}

// Modifies large price of a drink given drinkID
async function modDrinkLargePrice() {
  var select = document.getElementById('drinkList');

  var pair = {
    'drink_id': select.value,
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

  setTimeout(() => {
    drinkTable()
  }, 200);
}

// Modifies recipe price of a drink given drinkID
async function modDrinkRecipePrice() {
  var select = document.getElementById('drinkList');

  var pair = {
    'drink_id': select.value,
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

  setTimeout(() => {
    drinkTable()
  }, 200);
}

// Modifies an ingredient name given ingredientID
async function modIngredientName() {
  var pair = {
    'ingredient_id': document.getElementById('ingredientList').value,
    'ingredient_name': document.getElementById('mod-ingredient-name').value
  };

  const response = await fetch(url + "/modIngredientName", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pair),
  });

  const msg = await response.text();
  console.log(msg);

  setTimeout(() => {
    getIngredients();
    ingredientTable()
  }, 200);
}

// Modifies an ingredient unit price given ingredientID
async function modIngredientUnitPrice() {

  var pair = {
    'ingredient_id': document.getElementById('ingredientList').value,
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

  setTimeout(() => {
    ingredientTable()
  }, 200);
}

// Modifies an ingredient stock given ingredientID
async function modIngredientStock() {
  var pair = {
    'ingredient_id': document.getElementById('ingredientList').value,
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

  setTimeout(() => {
    ingredientTable()
  }, 200);
}

// Modifies an the minimum stock of an ingredient
async function modIngredientMinStock() {
  var pair = {
    'ingredient_id': document.getElementById('ingredientList').value,
    'ingredient_stock': document.getElementById('mod-ingredient-min').value
  };

  const response = await fetch(url + "/modIngredientMinStock", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pair),
  });

  const msg = await response.text();
  console.log(msg);

  setTimeout(() => {
    ingredientTable()
  }, 200);
}

// Generate table that will hold all the ingredients
async function ingredientTable() {
  var request = await fetch(url + "/manager/ingredients").then((res => res.json()));

  request.sort((a, b) => a.ingredient_id - b.ingredient_id);

  createTableFromJSON(request, 'ingredient-table')
}

// Generate table that will hold all the drinks
async function drinkTable() {
  var request = await fetch(url + "/recipe").then((res => res.json()));

  request.sort((a, b) => a.recipe_id - b.recipe_id);

  createTableFromJSON(request, 'drink-table')
}

async function getDrinks() {
  var select = document.getElementById('drinkList');
  select.innerHTML = '';

  fetch('/drinkNames')
  .then(response => response.json())
  .then(data => {
      const select = document.getElementById('drinkList');
      data.forEach((drink, index) => {
          const option = document.createElement('option');
          option.value = index + 1;
          option.textContent = drink.recipe_name;
          select.appendChild(option);
      });
  })
}

async function getIngredients() {
  var select = document.getElementById('ingredientList');
  select.innerHTML = '';

  fetch('/ingredientNames')
  .then(response => response.json())
  .then(data => {
      const select = document.getElementById('ingredientList');
      data.forEach((drink, index) => {
          const option = document.createElement('option');
          option.value = index + 1;
          option.textContent = drink.ingredient_name;
          select.appendChild(option);
      });
  })
}

async function generateRestockReport() {
  var request = await fetch(url + "/restockReport").then((res => res.json()));

  createTableFromJSON(request, 'restock-report')
}

async function generateExcessReport() {
  var start_date = document.getElementById('start-date2').value;
  var end_date = document.getElementById('end-date2').value;
  var start_time = document.getElementById('start-time2').value;
  var end_time = document.getElementById('end-time2').value;

  var urlWithParams = `${url}/excessReport/${start_date}/${end_date}/${start_time}/${end_time}`;

 try {
    var request = await fetch(urlWithParams);
    if (!request.ok) {throw new Error('Error fetching data');}
  } 
  catch (error) {
      alert('An error occured while fetching data.');
  }

  var jsonData = await request.json();

  createTableFromJSON(jsonData, 'excess-report')
}

async function generateSalesReport() {
  var init_date = document.getElementById('start-date').value;
  var final_date = document.getElementById('end-date').value;
  var init_time = document.getElementById('start-time').value;
  var final_time = document.getElementById('end-time').value;
  var main_recipe_id = document.getElementById('menu-item-id').value;

  var urlWithParams = `${url}/salesReport/${init_date}/${final_date}/${init_time}/${final_time}/${main_recipe_id}`;

  console.log(urlWithParams);

  try {
    var request = await fetch(urlWithParams);
    if (!request.ok) {throw new Error('Error fetching data');}
  } 
  catch (error) {
      alert('An error occured while fetching data.');
  }

  var jsonData = await request.json();

  createTableFromJSON(jsonData, 'sales-report')
}

// Make a table given json data 
async function createTableFromJSON(jsonData, tableContainerID) {
  // Get the container element where the table will be inserted
  let container = document.getElementById(tableContainerID);
  if (container.childElementCount > 0)
     container.removeChild(container.firstChild);

  // Clear the container's contents
  container.innerHTML = '';

  // Create the table element
  let table = document.createElement("table");

  // Get the keys (column names) of the first object in the JSON data
  let cols = Object.keys(jsonData[0]);

  // Create the header element
  let thead = document.createElement("thead");
  let tr = document.createElement("tr");

  // Loop through the column names and create header cells
  cols.forEach((item) => {
     let th = document.createElement("th");
     th.innerText = item; // Set the column name as the text of the header cell
     tr.appendChild(th); // Append the header cell to the header row
  });
  thead.appendChild(tr); // Append the header row to the header
  table.append(tr) // Append the header to the table

  // Loop through the JSON data and create table rows
  jsonData.forEach((item) => {
     let tr = document.createElement("tr");

     // Get the values of the current object in the JSON data
     let vals = Object.values(item);

     // Loop through the values and create table cells
     vals.forEach((elem) => {
        let td = document.createElement("td");
        td.innerText = elem; // Set the value as the text of the table cell
        tr.appendChild(td); // Append the table cell to the table row
     });
     table.appendChild(tr); // Append the table row to the table
  });
  container.appendChild(table) // Append the table to the container element
}