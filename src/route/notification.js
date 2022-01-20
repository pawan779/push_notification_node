const express = require("express");
const router = express.Router();

const User = require("../model/user");
const Notification = require("../model/notification");
const sendNotification = require("../HelperFunction/notification");
const { verifyUser } = require("../middleware/requiredAuth");

const message = {
  notification: {
    title: "Notification test",
    body: "hey there",
  },
};

router.get("/notification", verifyUser, async (req, res) => {
  const { user } = req;
  try {
    const findNoti = await Notification.find({ userId: user.id });
    const newData = [];
    findNoti.map((val) => val.fcmToken != "" && newData.push(val.fcmToken));

    sendNotification(newData, message);
    res.json(newData);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong", err });
  }
});

module.exports = router;
