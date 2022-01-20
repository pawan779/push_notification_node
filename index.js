const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const app = express();

const userRoute = require("./src/route/user");
const notiRoute = require("./src/route/notification");

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// mongodb connection

mongoose.connect(process.env.MONGODB);

mongoose.connection.on("connected", () => {
  console.log("Connected to mongodb");
});

mongoose.connection.on("error", (err) => {
  console.log("Unable to connect to mongodb");
});

app.use("/", userRoute);
app.use("/", notiRoute);

app.listen(process.env.PORT, () => {
  console.log(`Listening at http://localhost:${process.env.PORT}`);
});
