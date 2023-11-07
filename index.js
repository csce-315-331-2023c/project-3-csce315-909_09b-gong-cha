
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

//make it use the static folder
app.use(express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

app.get('/manager/ingredients', (req, res) => {
    pool
    .query('SELECT * FROM ingredient;')
    .then(query_res => {
        res.send(query_res.rows);
    });
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

//get all toppings
/** select * from ingredient where istopping = true;*/
app.get('/toppings', async (req, res) => {
  pool
      .query('SELECT * FROM ingredient WHERE isTopping = true;')
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

app.get('/orderid', async (req, res) => {
  pool
      .query("SELECT * FROM order_ ORDER BY order_id DESC LIMIT 1;")
      .then(query_res => {
        res.send(query_res.rows);
      });
})

app.get('/orderitemid', async (req, res) => {
  pool
      .query("SELECT * FROM order_item ORDER BY order_item_id DESC LIMIT 1;")
      .then(query_res => {
        res.send(query_res.rows);
      });
})

app.put('/modDrinkRecipePrice', async (req, res) => {
  var recipe_id = (req.body['drink_id']); // json object!!!
  var recipe_price = (req.body['recipe']); // json object!!!

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

app.put('/order', async (req, res) => {
  var username = (req.body['username']);
  var order_id = (req.body['order_id']); 
  var date_ = (req.body['date']); 
  var subtotal = (req.body['subtotal']); 
  var tip = (req.body['tip']); 
  var time_ = (req.body['time']); 

  // sql query
  pool
  .query("INSERT INTO order_ values ('" + username + "','" + order_id + "','" + date_ + "','" + subtotal + "','" + tip + "','" + time_ + "');");

  res.send("successful");
});  

app.put('/orderitem', async (req, res) => {
  var order_item_id = (req.body['order_item_id']);
  var recipe_id = (req.body['recipe_id']); 
  var order_id = (req.body['order_id']); 
  var isMedium = (req.body['is_medium']); 
  var ice = (req.body['ice']); 
  var sugar = (req.body['sugar']); 
  var price = (req.body['price']);

  // sql query
  pool
  .query("INSERT INTO order_item values ('" + order_item_id + "','" + recipe_id + "','" + order_id + "','" + isMedium + "','" + ice + "','" + sugar + "','" + price + "');");

  res.send("successful");
}); 

app.put('/orderitemtoppings', async (req, res) => {
  var order_item_id = (req.body['order_item_id']); 
  var ingredient_id = (req.body['ingredient_id']); 
  var quantity_used = (req.body['quantity']); 

  pool
  .query("INSERT INTO order_item_toppings values ('" + order_item_id + "','" + ingredient_id + "','" + quantity_used + "');");

  res.send("successful");
});  

app.get('/restockReport', async (req, res) => { 
  pool
  .query('SELECT * FROM ingredient WHERE stock < minimum_quantity;')
  .then(query_res => {
      res.send(query_res.rows);
  });
});  

app.get('/excessReport/:start_date/:end_date/:start_time/:end_time', async (req, res) => {
  const start_date = req.params.start_date;
  const end_date = req.params.end_date;
  const start_time = req.params.start_time;
  const end_time = req.params.end_time;

  // sql query
  pool
  .query(`SELECT Ingredient.Ingredient_Name, Subquery.Total_Used, CEILING(Ingredient.Stock * .1) AS Ten_Percent_Stock FROM (Select Ingredient_Name, SUM(Quantity_Used) AS Total_Used FROM Recipe_Ingredient NATURAL JOIN Ingredient NATURAL JOIN Order_ NATURAL JOIN Order_Item WHERE Date_ BETWEEN '${start_date}' AND '${end_date}' AND Time_ BETWEEN '${start_time}' AND '${end_time}' GROUP BY Ingredient_Name ORDER BY Ingredient_Name) AS Subquery, Ingredient WHERE Subquery.Total_Used < CEILING(Ingredient.Stock * .1) AND Ingredient.Ingredient_Name = Subquery.Ingredient_Name ORDER BY Total_Used;`)
  .then(query_res => {
      res.send(query_res.rows);
  })
});  

app.get('/salesReport/:init_date/:final_date/:init_time/:final_time/:main_recipe_id', async (req, res) => {
  const init_date = req.params.init_date;
  const final_date = req.params.final_date;
  const init_time = req.params.init_time;
  const final_time = req.params.final_time;
  const main_recipe_id = req.params.main_recipe_id;

  // sql query
  pool
  .query(`SELECT subquery.order_id, order_item_id, recipe_id,  is_medium, ice, sugar, item_price FROM (SELECT order_id FROM order_item NATURAL JOIN order_ WHERE date_ BETWEEN '${init_date}' AND '${final_date}' AND time_ BETWEEN '${init_time}' AND '${final_time}' AND recipe_id = '${main_recipe_id}') AS subquery, order_item WHERE order_item.order_id = subquery.order_id ORDER BY subquery.order_id;`)
  .then(query_res => {
      res.send(query_res.rows);
  })
});  

const PORT = process.env.PORT || 5000;
app.listen(PORT, function(err) {
  if(err) console.log(err);
  console.log(`Server is running on http://localhost:${PORT}`);
});