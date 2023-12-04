/**
 * @fileoverview This file contains functions that provide functionality for the manager page
 */

const url = 'https://csce-315-project-3-gong-cha.onrender.com/';

// This will load all necessary tables/options on startup
document.addEventListener("DOMContentLoaded", function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const isEmployee = localStorage.getItem('isEmployee');
  const isManager = localStorage.getItem('isManager');

  if (isLoggedIn == null) {
    localStorage.setItem('isLoggedIn', 'false');
  }
  if (isEmployee == null) {
    localStorage.setItem('isEmployee', 'false');
  }
  if (isManager == null) {
    localStorage.setItem('isManager', 'false');
  }

  if (isEmployee == 'false' || isManager == 'false') {
    alert("no access 🤪");
    window.location.href = '/about.html';
  }

  if (isLoggedIn == 'true') {
    this.getElementById('oauth').textContent = "Logout-OAUTH";
    this.getElementById('oauth').href = "/logout";
  }
  else {
    this.getElementById('oauth').textContent = "Login-OAUTH";
    this.getElementById('oauth').href = "/login";
  }

  ingredientTable();
  drinkTable();
  generateRestockReport();
  getDrinks();
  getDrinks2();
  getIngredients();
  fetchIngredientsAndDisplay('allIngredients');
  fetchIngredientsAndDisplay('allIngredientsAdd');

  if (localStorage.getItem('lang') == 'es') {
    translateElements2('es');
  }
});

/**
 *  Hide or show input boxes based on the selected option.
 */
function showInputBox() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`inputBox${i}`).classList.add("d-none"); // Reset input boxes to be hidden
  }

  let selectedOption = document.getElementById("options").value;

  document.getElementById(`inputBox${selectedOption}`).classList.remove("d-none");

  if (localStorage.getItem('lang') == 'es') {
    translateElements2('es');
  }
}

/**
 * Hide or show reports based on selected option
 */
function showReport() {
  for (let i = 1; i <= 3; i++) {
    document.getElementById(`report${i}`).classList.add("d-none"); // Reset report to be hidden
  }

  let selectedOption = document.getElementById("reportOptions").value;

  document.getElementById(`report${selectedOption}`).classList.remove("d-none");
}


/**
 * Adds a drink to the database.
 * @returns {Promise<void>} A Promise that resolves once the drink is added.
 */
async function addDrink() {

  var arrays = gatherValues('allIngredientsAdd');

  var drink = {
    'drink_name': document.getElementById("add-drink-name").value,
    'ingredient_names': arrays.ingredients,
    'ingredient_amount': arrays.quantities,
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

/**
 * Creates a new user account by extracting information from HTML elements and adding them to the database.
 * @param {Event} event - The event triggered by submitting the create account form.
 * @returns {boolean} Returns false if passwords do not match; otherwise, returns true.
 */
async function createManager(event) {
  username = document.getElementById('Manager-Email').value;
  password = 'password'
  alert("Account successfully created. ");

  var userData = {
    'new-username': username,
    'new-password': password,
  }

  const response = await fetch(url + "/createManager", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });  
}


/**
 * Adds an ingredient to the database.
 * @returns {Promise<void>} A Promise that resolves once the ingredient is added.
 */
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

  setTimeout(() => {
    ingredientTable();
    fetchIngredientsAndDisplay('allIngredients');
    fetchIngredientsAndDisplay('allIngredientsAdd');
    getIngredients();
  }, 200);
}

/**
 * Modifies the name of a drink given its drinkID.
 * @returns {Promise<void>} A Promise that resolves once the drink name is modified.
 */
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
    getDrinks2();
    drinkTable()
    if (localStorage.getItem('lang') == 'es') {
      translateElements2('es');
    }
  }, 200);
}

/**
 * Modifies ingredients and quantities of a drink given its drinkID.
 * @returns {Promise<void>} A Promise that resolves once the drink's ingredients and quantities are modified.
 */
async function modDrinkIngredients() {
  var select = document.getElementById('drinkList');

  var arrays = gatherValues('allIngredients');
  
  var trio = {
    'drink_id': select.value,
    'ingredients_name': arrays.ingredients,
    'ingredients_quantity': arrays.quantities
  };

  console.log(trio.drink_id);
  console.log(trio.ingredients_name);
  console.log(trio.ingredients_quantity);

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

/**
 * Modifies the medium price of a drink given its drinkID.
 * @returns {Promise<void>} A Promise that resolves once the medium price of the drink is modified.
 */
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

/**
 * Modifies the large price of a drink given its drinkID.
 * @returns {Promise<void>} A Promise that resolves once the large price of the drink is modified.
 */
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

/**
 * Modifies the recipe price of a drink given its drinkID.
 * @returns {Promise<void>} A Promise that resolves once the recipe price of the drink is modified.
 */
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

/**
 * Modifies an ingredient name given its ingredientID.
 * @returns {Promise<void>} A Promise that resolves once the ingredient name is modified.
 */
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
    ingredientTable();
    fetchIngredientsAndDisplay('allIngredients');
    fetchIngredientsAndDisplay('allIngredientsAdd');
    getIngredients();
  }, 200);
}

/**
 * Modifies an ingredient unit price given its ingredientID.
 * @returns {Promise<void>} A Promise that resolves once the ingredient unit price is modified.
 */
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

/**
 * Modifies an ingredient stock given its ingredientID.
 * @returns {Promise<void>} A Promise that resolves once the ingredient stock is modified.
 */
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

/**
 * Modifies the minimum stock of an ingredient given its ingredientID.
 * @returns {Promise<void>} A Promise that resolves once the minimum stock of the ingredient is modified.
 */
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

/**
 * Generates a table that will hold all the ingredients.
 * @returns {Promise<void>} A Promise that resolves once the ingredient table is generated.
 */
async function ingredientTable() {
  var request = await fetch(url + "/manager/ingredients").then((res => res.json()));

  request.sort((a, b) => a.ingredient_id - b.ingredient_id);

  createTableFromJSON(request, 'ingredient-table')
}

/**
 * Generates a table that will hold all the drinks.
 * @returns {Promise<void>} A Promise that resolves once the drink table is generated.
 */
async function drinkTable() {
  var request = await fetch(url + "/recipe").then((res => res.json()));

  request.sort((a, b) => a.recipe_id - b.recipe_id);

  createTableFromJSON(request, 'drink-table')
}

/**
 * Retrieves and populates the drinks select list.
 * @returns {Promise<void>} A Promise that resolves once the drinks list is populated.
 */
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
          option.classList = "translate";
          select.appendChild(option);
      });
  })
  if (localStorage.getItem('lang') == 'es') {
    translateElements2('es');
  }
}

/**
 * Retrieves and populates the second drinks select list.
 * @returns {Promise<void>} A Promise that resolves once the second drinks list is populated.
 */
async function getDrinks2() {
  var select = document.getElementById('drinkList2');
  select.innerHTML = '';

  fetch('/drinkNames')
  .then(response => response.json())
  .then(data => {
      const select = document.getElementById('drinkList2');
      data.forEach((drink, index) => {
          const option = document.createElement('option');
          option.value = index + 1;
          option.textContent = drink.recipe_name;
          option.classList = "translate";
          select.appendChild(option);
      });
  })
  if (localStorage.getItem('lang') == 'es') {
    translateElements2('es');
  }
}

/**
 * Retrieves and populates the ingredients select list.
 * @returns {Promise<void>} A Promise that resolves once the ingredients list is populated.
 */
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
          option.classList = "translate";
          select.appendChild(option);
      });
  })
  if (localStorage.getItem('lang') == 'es') {
    translateElements2('es');
  }
}

/**
 * Fetches ingredients and displays them in a specified element.
 * @param {string} element - The ID of the element where ingredients will be displayed.
 * @returns {Promise<void>} A Promise that resolves once ingredients are fetched and displayed.
 */
async function fetchIngredientsAndDisplay(element) {
  try {
    const response = await fetch('/ingredientNames');
    const ingredients = await response.json();
    const ingredientsListDiv = document.getElementById(`${element}`);

    ingredientsListDiv.innerHTML = "";

    const thirdLength = Math.ceil(ingredients.length / 3);
    const firstThird = ingredients.slice(0, thirdLength);
    const secondThird = ingredients.slice(thirdLength, 2 * thirdLength);
    const lastThird = ingredients.slice(2 * thirdLength);

    const firstColumn = createColumn(firstThird);
    const secondColumn = createColumn(secondThird);
    const thirdColumn = createColumn(lastThird);

    const row = document.createElement('div');
    row.classList.add('row');

    const col1 = document.createElement('div');
    col1.classList.add('col-md-4');
    col1.appendChild(firstColumn);

    const col2 = document.createElement('div');
    col2.classList.add('col-md-4');
    col2.appendChild(secondColumn);

    const col3 = document.createElement('div');
    col3.classList.add('col-md-4');
    col3.appendChild(thirdColumn);

    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);

    ingredientsListDiv.appendChild(row);
    if (localStorage.getItem('lang') == 'es') {
      translateElements2('es');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function createColumn(ingredients) {
  const column = document.createElement('div');
  column.classList.add('mb-3');

  ingredients.forEach(ingredient => {
    const formGroup = document.createElement('div');
    formGroup.classList.add('input-group');

    const inputGroupText = document.createElement('label');
    inputGroupText.classList.add('input-group-text', 'translate');
    inputGroupText.textContent = ingredient.ingredient_name;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.classList.add('form-control');
    quantityInput.name = 'ingredientQuantities[]';
    quantityInput.min = '0';
    quantityInput.value = '0';

    formGroup.appendChild(quantityInput);
    formGroup.appendChild(inputGroupText);
    column.appendChild(formGroup);
  });

  return column;
}

/**
 * Gathers ingredient names and quantities from specified input elements.
 * @param {string} element - The ID of the element containing input fields.
 * @returns {Object} An object containing 'ingredients' (comma-separated string) and 'quantities' (comma-separated string).
 */
function gatherValues(element) {
  const inputs = document.querySelectorAll(`#${element} input[type="number"]`);
  const ingredientNames = [];
  const quantities = [];

  inputs.forEach(input => {
    const val = input.value;
    const ingredientName = input.nextElementSibling.textContent.trim();

    if (val != 0) {
      ingredientNames.push(ingredientName); // Add input value to the Set if it's not empty
      quantities.push(val);
    }
  });

  const ingredientNamesString = ingredientNames.join(','); // Comma-separated string for unique values
  const quantitesString = quantities.join(','); // Comma-separated string for non-zero values

  console.log('Ingredients:', ingredientNamesString);
  console.log('Quantities:', quantitesString);

  var arrays = {
    'ingredients': ingredientNamesString,
    'quantities': quantitesString
  }

  return arrays;
}

/**
 * Generates a restock report and creates a table from the retrieved data.
 * @returns {Promise<void>} A Promise that resolves once the restock report table is generated.
 */
async function generateRestockReport() {
  var request = await fetch(url + "/restockReport").then((res => res.json()));

  createTableFromJSON(request, 'restock-report')
}

/**
 * Generates an excess report within a specified date and time range and creates a table from the retrieved data.
 * @returns {Promise<void>} A Promise that resolves once the excess report table is generated.
 */
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

/**
 * Generates a sales report within a specified date and time range and for a specific drink, creating a table from the retrieved data.
 * @returns {Promise<void>} A Promise that resolves once the sales report table is generated.
 */
async function generateSalesReport() {
  var init_date = document.getElementById('start-date').value;
  var final_date = document.getElementById('end-date').value;
  var init_time = document.getElementById('start-time').value;
  var final_time = document.getElementById('end-time').value;
  var main_recipe_id = document.getElementById('drinkList2').value;

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

/**
 * Creates a table from JSON data and inserts it into a specified container element.
 * @param {Object[]} jsonData - JSON data to be converted into a table.
 * @param {string} tableContainerID - The ID of the container element where the table will be inserted.
 * @returns {Promise<void>} A Promise that resolves once the table is created and inserted into the container.
 */
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

/**
 * Translates elements with a specific class to a specified language.
 * @param {string} lang - The target language for translation.
 */
function translateElements2(lang) {
  var targetLanguage = lang;
  const elements = document.querySelectorAll('.translate');
  const apiKey = 'AIzaSyCCT13ZuFYfFyH8H-DX195b8F6lSr0CESc';

  console.log(elements);
  elements.forEach(element => {
      const textToTranslate = element.textContent;
      fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(textToTranslate)}&target=${targetLanguage}`, {
          method: 'POST'
      })
          .then(response => response.json())
          .then(data => {
              const translatedText = data.data.translations[0].translatedText;
              element.textContent = translatedText;
          })
          .catch(error => {
              console.error('Translation error:', error);
          });
  });
}