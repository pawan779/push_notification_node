const admin = require("firebase-admin");

const serviceAccount = require("../../chemistnepal-8cd61-firebase-adminsdk-2106t-741fbbebc9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (registrationToken, message) => {
  const { failureCount, successCount } = await admin
    .messaging()
    .sendToDevice(registrationToken, message, { priority: "high" });
};

module.exports = sendNotification;
