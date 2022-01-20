const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = mongoose.model("User");

module.exports.verifyUser = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in" });
  }

  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in" });
    }
    const { userId } = payload;

    const user = await User.findById(userId);

    req.user = user;
    next();
  });
};

module.exports.verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (req.user.isAdmin !== true) {
    return res.status(403).send({ error: "Forbidden" });
  }
  next();
};
