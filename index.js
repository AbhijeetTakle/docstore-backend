const express = require("express");
const cors = require("cors");
const userAPI = require("./routes/user");
const connectdb = require("./connectdb");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multer = require("multer");
const { addDocument } = require("./controllers/user");

const app = express();
dotenv.config();
app.use(cors());
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

connectdb();

app.use("/", userAPI);
app.post("/files", upload.single("file"), addDocument);
app.listen(process.env.PORT, () => {
  console.log("Ecommerce API Launched...");
});
