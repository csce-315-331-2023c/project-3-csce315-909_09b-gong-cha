const express = require('express');
const app = express();

app.use(express.static('static'));

// This is used to link an HTML page to the respective page of our website, home being '/'
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



