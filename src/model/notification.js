const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  uuId: {
    type: String,
  },
  fcmToken: {
    type: String,
    required: false,
  },
});

let Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
