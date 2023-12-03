const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const { auth, requiresAuth } = require('express-openid-connect');
var cur_email = '';
// Create express app
const app = express();
const port = 5000;
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER,
  routes:{
    login: false,
    postLogoutRedirect: '/postlogout.html' // custom logout page
  }


};

app.use(auth(config));
//make it use the static folder
app.use(express.static('static'));
app.use(express.json());
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

//TODO: have app send correct url based on .env variable
//this will prevent us from having to manually change url when we deploy
// app.get('/baseUrl', (req, res) => {
//   if (process.env.NODE_ENV === 'production') {
//     res.send('http://localhost:10000')
//   }
//   else{
//     res.send('https://csce-315-project-3-gong-cha.onrender.com')
//   }
// });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });


app.get('/login', (req, res) =>
  res.oidc.login({
    returnTo: '/postLogin',
  })
);

app.get('/postLogin', (req, res) =>{
  cur_email = req.oidc.user.email;
  console.log(cur_email) 
  res.redirect('/postlogin.html');
  }
);
  

app.post('/userEmail', (req, res) =>{
  console.log("received");
  res.send(cur_email);
  console.log("naur");
  }
);

app.get('/manager/ingredients', (req, res) => {
    pool
    .query('SELECT * FROM ingredient;')
    .then(query_res => {
        res.send(query_res.rows);
    });
  });

//view all recipes

app.get('/recipe', async (req, res) => {
  pool
      .query('SELECT * FROM recipe;')
      .then(query_res => {
          res.send(query_res.rows);
      });
})

app.post('/getAccount', async (req, res) => {
  var username = req.body['username'];
  var password = req.body['password'];

  if (cur_email != null){
    username = cur_email;
  }

  pool
      .query("SELECT * FROM users WHERE username = '" + username + "';")
      .then(query_res => {
          console.log(query_res.rows);
          res.send(query_res.rows);
      });
})

app.post('/createAccount', async (req, res) => {
  username = req.body['new-username'];
  password = req.body['new-password'];
  is_manager = false;
  pool
      .query("INSERT INTO users VALUES('" + username + "', '" + password + "', '"+ is_manager + "');")
      .then(query_res => {
          console.log("rachel zegler stan");
      });
})

app.post('/createManager', async (req, res) => {
  username = req.body['new-username'];
  password = req.body['new-password'];
  is_manager = true;
  pool
      .query("INSERT INTO users VALUES('" + username + "', '" + password + "', '"+ is_manager + "');")
      .then(query_res => {
          console.log("rachel zegler stan");
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

// gets all the drink names
app.get('/drinkNames', async (req, res) => {
  pool
      .query('SELECT recipe_name FROM recipe ORDER BY recipe_id;')
      .then(query_res => {
          res.send(query_res.rows);
      });
})

// gets all the ingredient names
app.get('/ingredientNames', async (req, res) => {
  pool
      .query('SELECT ingredient_name FROM ingredient ORDER BY ingredient_id;')
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

app.put('/modIngredientMinStock', async (req, res) => {
  var ingredient_id = (req.body['ingredient_id']); 
  var ingredient_stock = (req.body['ingredient_stock']); 
  // sql query
  pool
  .query("UPDATE ingredient SET minimum_quantity = '" + ingredient_stock + "' WHERE ingredient_id = " + ingredient_id + ";");
  console.log("modified ingredient minimum stock price");
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

const API_KEY = '91bfb4a990ac4b6c806232138232911';

app.get('/weather', async (req, res) => {
  try {
    
    const weatherData = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=College Station&aqi=no`);
    
    res.json(weatherData.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function(err) {
  if(err) console.log(err);
  console.log(`Server is running on http://localhost:${PORT}`);
});

