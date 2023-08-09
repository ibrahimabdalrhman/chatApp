const mongoose = require('mongoose');

const DB = async() => {
  mongoose
    .connect(process.env.MONGO_URL).then(console.log("DATABSE CONNETED...")).catch(err=>console.log(err))
}

module.exports = DB;