
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
  const drink = (req.body); // json object!!!
  // index like you normally would for a pandas dataframe
  console.log(drink['drink_name'])

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
  var drink_id = (req.body['drink_id']); // json object!!!
  var drink_ingredients = (req.body['drink_ingredients']); // json object!!!

  // sql query

  res.send("successful");
});  

app.put('/modDrinkMediumPrice', async (req, res) => {
  var recipe_id = (req.body['drink_id']); // json object!!!
  var med_price = (req.body['med_price']); // json object!!!

  // sql query
  pool
      .query("UPDATE recipe SET med_price =" + med_price + "WHERE recipe_id =" + recipe_id + ";");
  console.log("modified drink med price");
  res.send("successful");
});  

app.put('/modDrinkLargePrice', async (req, res) => {
  var recipe_id = (req.body['drink_id']); // json object!!!
  var large_price = (req.body['large_price']); // json object!!!

  // sql query
  pool
      .query("UPDATE recipe SET large_price =" + large_price + "WHERE recipe_id =" + recipe_id + ";");
  
  console.log("modified drink large price");
  res.send("successful");

});  

app.put('/modDrinkRecipePrice', async (req, res) => {
  var recipe_id = (req.body['drink_id']); // json object!!!
  var recipe_price = (req.body['recipe_price']); // json object!!!

  // sql query
  pool
  .query("UPDATE recipe SET recipe_price =" + recipe_price + "WHERE recipe_id =" + recipe_id + ";");
  res.send("successful");
  console.log("updated drink recipe price")
});  


app.put('/modIngredientName', async (req, res) => {
  var ingredient_id = (req.body['ingredient_id']); 
  var ingredient_name = (req.body['ingredient_name']); 

  // sql query
  pool
  .query("UPDATE ingredient SET ingredient_name = '" + ingredient_name + "' WHERE ingredient_id = " + ingredient_id + ";");

  res.send("successful");
});  

app.put('/modIngredientUnitPrice', async (req, res) => {
  var ingredient_id = (req.body['ingredient_id']); 
  var ingredient_price = (req.body['ingredient_price']); 

  // sql query

  res.send("successful");
});  

app.put('/modIngredientStock', async (req, res) => {
  var ingredient_id = (req.body['ingredient_id']); 
  var ingredient_stock = (req.body['ingredient_stock']); 

  // sql query

  res.send("successful");
});  