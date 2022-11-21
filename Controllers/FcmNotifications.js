const db = require("../Config/Database");
const q = require("../Quaries/ChatQuaries");

var FCM = require("fcm-node");
var providerServerKey = process.env.PROVIDER_FCM_KEY;
var providerFcm = new FCM(providerServerKey);
var userServerKey = process.env.USER_FCM_KEY;
var userFcm = new FCM(userServerKey);

module.exports = {
  messagePushNotification: async (chat) => {
    let roomInfo = await db.all(q.data.getRoomInfo(chat.roomId));
    let userInfo = await db.all(q.data.getUserFCM(roomInfo[0].user_id));
    let providerInfo = await db.all(
      q.data.getProviderFCM(roomInfo[0].provider_id)
    );
    //push notification to provider
    if (parseInt(chat.user_type) === 1) {
      var message = {
        to: providerInfo[0].token,
        notification: {
          title:
            userInfo[0].first_name.charAt(0).toUpperCase() +
            userInfo[0].first_name.slice(1),
          body: `Message: ${chat.msg}`,
        },
      };
      providerFcm.send(message, function (err, response) {
        if (err) {
          console.log("Provider Something has gone wrong!");
        } else {
          console.log("Provider Successfully sent with response: ", response);
        }
      });
    }
    //push notification to User
    if (parseInt(chat.user_type) === 2) {
      var message = {
        to: userInfo[0].token,
        notification: {
          title:
            providerInfo[0].first_name.charAt(0).toUpperCase() +
            providerInfo[0].first_name.slice(1),
          body: `Message: ${chat.msg}`,
        },
      };
      userFcm.send(message, function (err, response) {
        if (err) {
          console.log("User Something has gone wrong!");
        } else {
          console.log("User Successfully sent with response: ", response);
        }
      });
    }
  },
  updateFCM: async (data) => {
    try {
      let result;
      if (data.user_type === 1) {
        result = await db.Update_all(
          q.data.updateUserFCM(data.userId, data.token)
        );
      }
      if (data.user_type === 2) {
        result = await db.Update_all(
          q.data.updateProviderFCM(data.userId, data.token)
        );
      }
      return result;
    } catch (e) {
      console.log(e);
      return e.message;
    }
  },
};
