const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../model/user");
const Notification = require("../model/notification");
const sendNotification = require("../HelperFunction/notification");

router.post("/register", async (req, res) => {
  const { email, password, name, address, fcmToken, phone, uuId } = req.body;

  if (!email || !password) {
    return res.status(422).send({ message: "Email and password is required" });
  }

  const isMatch = await User.findOne({ email });
  if (isMatch) {
    return res.status(422).send({ message: "Email already exists!!" });
  }
  try {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).send({ message: "Could not hash!" });
      }

      const user = new User({
        email,
        password: hash,
        name,
        address,
        phone,
      });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.SECRET);
      res.json({
        token,
        admin: user.isAdmin,
        email: user.email,
        phone: user.phone,
        address: user.address,
        fcmToken,
        id: user._id,
      });

      const isThere = await Notification.findOneAndUpdate(
        { uuId },
        { fcmToken, userId: user._id }
      );

      if (!isThere) {
        const noti = new Notification({
          fcmToken,
          uuId,
        });
        noti.save();
      }
    });
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password, fcmToken, uuId } = req.body;
  if (!email || !password) {
    return res.status(422).send({ message: "Email and password is required" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).send({ message: "Invalid email or password" });
  }

  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.SECRET);

      res.json({
        token,
        fcmToken,
        email: user.email,
        phone: user.phone,
        address: user.address,
        id: user._id,
      });
      const isThere = await Notification.findOneAndUpdate(
        { uuId },
        { fcmToken, userId: user._id }
      );
      if (!isThere) {
        const noti = new Notification({
          fcmToken,
          uuId,
        });
        noti.save();
      }
    } else {
      return res.status(422).send({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = router;
