const express = require('express'); //Import the express dependency;
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { emitWarning } = require('process');
const app = express(); //Create an application with express
const port = 5000; //Declare the port for the server

const dbUser = process.argv[2];
const dbPass = process.argv[3];

// Middleware
app.use(express.json())