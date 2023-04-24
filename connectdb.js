const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const database = process.env.MONGO_DB_DATABASE;
const connectdb = () => {
  const url = `mongodb+srv://${username}:${password}@ecomcluster.bwhyju4.mongodb.net/${database}?retryWrites=true&w=majority`;
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose
    .connect(url, connectionParams)
    .then(() => {
      console.log("Connected to database ");
    })
    .catch((err) => {
      console.error(`Error connecting to the database. \n${err}`);
    });
};

module.exports = connectdb;
