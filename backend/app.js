const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: ".env" });
const DB = require("./config/database.js").apply();
const errorMiddleware = require('./middlewares/errorMiddleware.js');
const authRoute = require('./routes/authRoute.js');


app.use(express.json());

//routes
app.use('/api/v1/auth', authRoute);


app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this page ${req.url}`, 404));
});

//Global error middleware
app.use(errorMiddleware);

const port=process.env.PORT
app.listen(5000, console.log(`SERVER STARTED ON ${port}...`));

process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection : ${err.name} | ${err.message}`);
  app.close(() => {
    console.error("shutting down ... ");
    process.exit(1);
  });
});