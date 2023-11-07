
const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

// Create express app
const app = express();
const port = 5000;

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// Add process hook to shutdown pool
process.on('SIGINT', function() {
  pool.end();
  console.log('Application successfully shutdown');
  process.exit(0);
});
         
// app.set("view engine", "html");

//testing
app.get('/user', (req, res) => {
  teammembers = []
  pool
      .query('SELECT * FROM teammembers;')
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              teammembers.push(query_res.rows[i]);
          }
          const data = {teammembers: teammembers};
          console.log(teammembers);
          res.render('user', data);
      });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function(err) {
  if(err) console.log(err);
  console.log(`Server is running on http://localhost:${PORT}`);
});

//make it use the static folder
app.use(express.static('static'));

// This is used to link an HTML page to the respective page of our website, home being '/'
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

app.get('/manager', (req, res) => {
    res.sendFile(__dirname + '/static/manager.html');
  });




app.use(express.json());
//view all recipes

app.get('/recipe', async (req, res) => {
  pool
      .query('SELECT * FROM recipe;')
      .then(query_res => {
          res.send(query_res.rows);
      });
})

//get all drinks that have milk in the name
app.get('/recipe/milk', async (req, res) => {
  pool
      .query('SELECT * FROM recipe WHERE recipe_name LIKE \'%Milk%\';')
      .then(query_res => {
          res.send(query_res.rows);
      });
})

//get all drinks that are slushies
app.get('/recipe/slushie', async (req, res) => {
  pool
      .query('SELECT * FROM recipe WHERE is_Slush = true;')
      .then(query_res => {
          res.send(query_res.rows);
      });
})

//get all drinks that have coffee in the name
app.get('/recipe/coffee', async (req, res) => {
  pool
      .query('SELECT * FROM recipe WHERE recipe_name LIKE \'%Coffee%\';')
      .then(query_res => {
          res.send(query_res.rows);
      });
})

//get all the other drinks that don't fit into the other categories
app.get('/recipe/other', async (req, res) => {
  pool
      .query('SELECT * FROM recipe WHERE is_Slush = false AND recipe_name NOT LIKE \'%Coffee%\' AND recipe_name NOT LIKE \'%Milk%\';')
      .then(query_res => {
          res.send(query_res.rows);
      });
})

app.get('/amongus', async (req, res) => {
    console.log("amongus");
  })

// add drink
app.put('/addDrink', async (req, res) => {
  var recipe_name = req.body['drink_name'];
  var is_slush = req.body['is_slushy'];
  var med_price = req.body['med_price'];
  var large_price = req.body['large_price'];
  var recipe_price = req.body['recipe_price'];
  var recipe_id = -1;

  // get next available recipe id
  const last_recipe = await pool
    .query("SELECT * FROM recipe ORDER BY recipe_id DESC LIMIT 1;");
  recipe_id = last_recipe.rows[0]['recipe_id']+1;
  console.log(req.body);
  // insert into recipe table
  pool
      .query("INSERT INTO recipe VALUES('" + recipe_id + "','" + recipe_name + "','" + is_slush + "','" + med_price + "', '" + large_price + "', '"+ recipe_price + "');" );
  
  // adding ingredients :)
  var ingredients = req.body['ingredient_names'].split(",");
  var quantities = req.body['ingredient_amount'].split(",");
  var ingredient_ids = [];
  for(var i = 0; i < ingredients.length; i++){
    console.log(ingredients[i]);
    const ingr_row = await pool
    .query("SELECT * FROM ingredient WHERE ingredient_name = '" + ingredients[i] + "';");
    ingredient_ids.push(ingr_row.rows[0]['ingredient_id']);
  }
  for(var i = 0; i < ingredient_ids.length; i++){
    const ingr_row = await pool
    .query("INSERT INTO recipe_ingredient VALUES('" + recipe_id + "','" + ingredient_ids[i] + "','" + quantities[i] + "');");
  }
  
  res.send("successful");

});  

app.put('/addIngredient', async (req, res) => {
  var name = req.body['ingredient_name'];
  var price = req.body['unit_price'];
  var stock = req.body['stock'];
  var is_topping = req.body['is_topping'];
  var minimum_quantity = req.body['minimum_quantity']; 
  var ingredient_id = -1;
  
  // get ingredient id

  const last_ingredient = await pool
    .query("SELECT * FROM ingredient ORDER BY ingredient_id DESC LIMIT 1;");
  ingredient_id = last_ingredient.rows[0]['ingredient_id']+1;
  console.log(req.body);

  // sql query
  pool
  .query("INSERT INTO ingredient VALUES ('" + ingredient_id + "','" + name + "','" + price + "','" + stock + "', '" + minimum_quantity + "', '"+ is_topping + "');" );

  res.send("successful");

});  


app.put('/modDrinkName', async (req, res) => {
  var drink_name = (req.body['drink_name']);
  var recipe_id = (req.body['drink_id']); 
  // sql query
  pool
      .query("UPDATE recipe SET recipe_name  = '" + drink_name + "' WHERE recipe_id = '" + recipe_id + "';");
  res.send("successful");
  console.log("modified drink name");
});  

app.put('/modDrinkIngredients', async (req, res) => {
  var recipe_id = req.body['drink_id']; 
  var ingredients_name = req.body['ingredients_name'].split(","); 
  var ingredients_quantity = req.body['ingredients_quantity'].split(",");
  // sql query
  // delete ingredients in recipe_ingredient
  pool.query("DELETE FROM recipe_ingredient WHERE recipe_id = '" + recipe_id + "';");

  var ingredient_ids = [];
  for(var i = 0; i < ingredients_name.length; i++){
    const ingr_row = await pool
    .query("SELECT * FROM ingredient WHERE ingredient_name = '" + ingredients_name[i] + "';");
    ingredient_ids.push(ingr_row.rows[0]['ingredient_id']);
  }
  for(var i = 0; i < ingredient_ids.length; i++){
    pool.query("INSERT INTO recipe_ingredient VALUES('" + recipe_id + "','" + ingredient_ids[i] + "','" + ingredients_quantity[i] + "');");
  }

  res.send("successful");
});  

app.put('/modDrinkMediumPrice', async (req, res) => {
  var recipe_id = (req.body['drink_id']); 
  var med_price = (req.body['med_price']); 

  // sql query
  pool
      .query("UPDATE recipe SET med_price =" + med_price + "WHERE recipe_id =" + recipe_id + ";");
  console.log("modified drink med price");
  res.send("successful");
});  

app.put('/modDrinkLargePrice', async (req, res) => {
  var recipe_id = (req.body['drink_id']); 
  var large_price = (req.body['large_price']); 

  // sql query
  pool
      .query("UPDATE recipe SET large_price =" + large_price + "WHERE recipe_id =" + recipe_id + ";");
  
  console.log("modified drink large price");
  res.send("successful");

});  

app.put('/modDrinkRecipePrice', async (req, res) => {
  var recipe_id = (req.body['drink_id']); 
  var recipe_price = (req.body['recipe']); 

  // sql query
  pool
      .query("UPDATE recipe SET recipe_price =" + recipe_price + "WHERE recipe_id =" + recipe_id + ";");
  res.send("successful");
  console.log("updated drink recipe price");
});  


app.put('/modIngredientName', async (req, res) => {
  var ingredient_id = (req.body['ingredient_id']); 
  var ingredient_name = (req.body['ingredient_name']); 

  // sql query
  pool
  .query("UPDATE ingredient SET ingredient_name = '" + ingredient_name + "' WHERE ingredient_id = " + ingredient_id + ";");
  console.log("modified ingredient name");
  res.send("successful");
});  

app.put('/modIngredientUnitPrice', async (req, res) => {
  var ingredient_id = (req.body['ingredient_id']); 
  var ingredient_price = (req.body['ingredient_price']); 

  // sql query
  pool
  .query("UPDATE ingredient SET unit_price = '" + ingredient_price + "' WHERE ingredient_id = " + ingredient_id + ";");
  console.log("modified ingredient unit price");
  res.send("successful");
});  

app.put('/modIngredientStock', async (req, res) => {
  var ingredient_id = (req.body['ingredient_id']); 
  var ingredient_stock = (req.body['ingredient_stock']); 
  // sql query
  pool
  .query("UPDATE ingredient SET stock = '" + ingredient_stock + "' WHERE ingredient_id = " + ingredient_id + ";");
  console.log("modified ingredient unit price");
  res.send("successful");
});  