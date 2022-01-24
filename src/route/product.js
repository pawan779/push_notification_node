const express = require("express");
const { verifyUser } = require("../middleware/requiredAuth");
const Product = require("../model/product");
const User = require("../model/user");
const router = express.Router();

router.route("/products").get(async (req, res) => {
  try {
    const find = await Product.find({}).sort({ _id: -1 });
    setTimeout(() => {
      res.json(find);
    }, 3000);
  } catch (err) {
    res.status("500").send("Something went wrong!");
  }
});

router.route("/products/:id").get(verifyUser, async (req, res) => {
  try {
    const data = await Product.findById(req.params.id);
    const user = await User.findById(req.user.id);
    const newData = user;
    console.log({ ...newData, ...data });
    res.json(newData);
  } catch (err) {
    res.status(404).send({ message: "Product not found with the given id" });
  }
});

module.exports = router;
