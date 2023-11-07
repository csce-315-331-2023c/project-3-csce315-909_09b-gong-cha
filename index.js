
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//make it use the static folder
app.use(express.static('static'));

// This is used to link an HTML page to the respective page of our website, home being '/'
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

app.get('/amongus', async (req, res) => {
    console.log("amongus");
  })
  
