const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: ".env" });
const DB = require("./config/database.js").apply();






const port=process.env.PORT
app.listen(5000, console.log(`SERVER STARTED ON ${port}...`));