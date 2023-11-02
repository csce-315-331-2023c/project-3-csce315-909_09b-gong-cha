
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
app.use(express.json());
//view all recipes

app.get('/recipe', async (req, res) => {
  pool
      .query('SELECT * FROM recipe;')
      .then(query_res => {
          res.send(query_res.rows);
      });
})