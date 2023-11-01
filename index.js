const express = require('express');
const { as } = require('pg-promise');
const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://csce315_909_antonhugo1:password@csce-315-db.engr.tamu.edu:5432/csce315331_09b_db')
// username: csce315_909_antonhugo1
// password: password
// host: csce-315-db.engr.tamu.edu
// port name: 5432
// db name: csce315331_09b_db

const query = pgp.as.format('select * from recipe')
console.log(query)
db.any(query).then((data) => {
  app.get('/', (req, res) => {
    res.send(JSON.stringify(data[60]));
  });
  console.log(data);

//send info to cashier.js
//then cashier.js will send info to cashier.html
//then cashier.html will display info
//   for (var key in data) {
//     if (data.hasOwnProperty(key)) {
//         console.log(key + " -> " + data[key]);
//     }
// }

})
app.use(express.static('static'));

// This is used to link an HTML page to the respective page of our website, home being '/'
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//view all recipes
async function ReadRecipes() {
  var result = await client.query("SELECT * FROM recipe");
  return result.rows;
}

app.get('/recipe', async (req, res) => {
  const result = await ReadRecipes();
  res.send(result);
})