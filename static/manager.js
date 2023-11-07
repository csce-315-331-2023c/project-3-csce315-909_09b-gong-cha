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
function addDrink() {

  var Drink_Name = document.getElementById("add-drink-name").value;
  var Ingredient_Names = document.getElementById('add-ingredients').value;
  var Ingredient_Amount = document.getElementById('add-ingredients-qty').value;
  var Is_Slushy = document.getElementsByName("is-slushy")[0].checked;
  var Med_Price = document.getElementById('med-price-add').value;
  var Large_Price = document.getElementById('lrg-price-add').value;
  var Recipe_Price = document.getElementById('rcp-price-add').value;

  drinkTable();
}

// Adds an ingredient to the database
function addIngredient() {

  var Ingredient_Name = document.getElementById("add-ingredient-name").value;
  var Unit_Price = document.getElementById("add-unit-price").value;
  var Stock = document.getElementById("add-unit-price").value;
  var Is_Toppping = document.getElementsByName("is-topping").value;

  ingredientTable();
}

// Modifies name of a drink given drinkID
function modDrinkName() {
  var Drink_Id = document.getElementById('mod-drink-id');
  var Drink_Name = document.getElementById("mod-drink-name").value;

  drinkTable();
}

// Modifies ingredients & quantities of a drink given drinkID
function modDrinkIngredients() {
  var Drink_Id = document.getElementById('mod-drink-id');

  drinkTable();
}

// Modifies medium price of a drink given drinkID
function modDrinkMediumPrice() {
  var Drink_Id = document.getElementById('mod-drink-id');
  var Medium_Price = document.getElementById('mod-drink-med-price').value;

  drinkTable();
}

// Modifies large price of a drink given drinkID
function modDrinkLargePrice() {
  var Drink_Id = document.getElementById('mod-drink-id');
  var Large_Price = document.getElementById('mod-drink-lrg-price').value;

  drinkTable();
}

// Modifies recipe price of a drink given drinkID
function modDrinkRecipePrice() {
  var Drink_Id = document.getElementById('mod-drink-id');
  var Large_Price = document.getElementById('mod-drink-rcp-price').value;

  drinkTable();
}

// Modifies an ingredient name given ingredientID
function modIngredientName() {
  var Ingredient_ID = document.getElementById('mod-ingredient-id');
  var Ingredient_Name = document.getElementById('add-ingredient-name');

  ingredientTable();
}

// Modifies an ingredient unit price given ingredientID
function modIngredientUnitPrice() {
  var Ingredient_ID = document.getElementById('mod-ingredient-id');
  var Ingredient_Price = document.getElementById('mod-ingredient-unit-price').value;

  ingredientTable();
}

// Modifies an ingredient stock given ingredientID
function modIngredientStock() {
  var Ingredient_ID = document.getElementById('mod-ingredient-id');
  var Ingredient_Price = document.getElementById('mod-ingredient-stock').value;

  ingredientTable();
}

// Generate table that will hold all the ingredients
async function ingredientTable() {
  var request = await fetch(url + "/manager/ingredients").then((res => res.json()));
  console.log(request)
  createTableFromJSON(request, 'ingredient-table')
}

// Generate table that will hold all the drinks
async function drinkTable() {
  var request = await fetch(url + "/recipe").then((res => res.json()));
  console.log(request)
  createTableFromJSON(request, 'drink-table')
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