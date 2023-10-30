const express = require('express'); //Import the express dependency;
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { emitWarning } = require('process');
const app = express(); //Create an application with express
const port = 5000; //Declare the port for the server

const dbUser = "csce315_909_" + process.argv[2];
const dbPass = process.argv[3];

//create client, connect to the AWS database
const client = new Client({
    user: 'public',
    host: 'jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315331_09b_db',
    database: dbUser,
    password: dbPass,
    port: 5432,
});

// Middleware
app.use(express.json())

//TODO: redo database, have it populate too using the csv
async function reset() {
    // Load SQL script from file
    const filePath = path.join(__dirname, 'sql', 'master_delete_create_insert.sql');
    const sql = fs.readFileSync(filePath, 'utf8');
    // Execute SQL script
    var result = client.query(sql);
    console.log('Successfully created and populated database');
}

// Connect
async function connect(client) {
    try {
        await client.connect();
        await reset();  // Reset the database schema and populate it
        return 'Connected to PostgreSQL!';
    } catch (error) {
        return error;
    }
}

// Disconnect from the database
async function disconnect(client) {
    try {
        await client.end();
        return 'Disconnected from PostgreSQL!';
    } catch (error) {
        return error;
    }
}