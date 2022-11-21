const chat = require("./Controllers/ChatController");
const {
  userJoin,
  userLeave,
  userJoinRoom,
  getCurrentUser,
  getRoomUsers,
  leaveChatroom,
} = require("./utils/users");

const FCM = require("./Controllers/FcmNotifications");

module.exports = function Socket(server) {
  const io = require("socket.io")(server);
  io.on("connection", async (socket) => {
    //when socket connect
    socket.emit("onConnection", `${socket.id} connected`);
    console.log("connected", socket.id);

    //when user connect with userId
    socket.on("socketJoin", (data) => {
      console.log("socketJoin==>", data);
      const user = userJoin(socket.id, data.userId);
      socket.emit("socketJoin", user);
    });

    socket.on("updateFCM", async (data) => {
      console.log("updateFCM==>", data);
      let updated = await FCM.updateFCM(data);
      socket.emit("updateFCM", updated);
    });
    socket.on("createRoom", async (roomDetailsFromDevice) => {
      console.log("createRoom==>", roomDetailsFromDevice);
      let chatroomId = await chat.createRoom(roomDetailsFromDevice);
      socket.emit("createRoom", { roomId: chatroomId });
    });

    socket.on("getDialogs", async (user) => {
      console.log("getDialogs==>", user);
      let rooms = await chat.userRooms(user.userId);
      // io.to(socket.id).emit("getDialogs", rooms);
      socket.emit("getDialogs", rooms);
    });

    socket.on("joinRoom", async (data) => {
      console.log("joinRoom==>", data);
      const user = userJoinRoom(socket.id, data.userId, data.roomId);
      socket.join(data.roomId);
      let oldChat = await chat.getOldChat(data);
      socket.emit("message", oldChat);
    });
    socket.on("chatMessage", async (c) => {
      let seen = 1;
      let savedMessage = await chat.saveMessage(c, seen);
      console.log("chatMessage==>", savedMessage);
      io.to(c.roomId).emit("chatMessage", savedMessage);
      FCM.messagePushNotification(c);
    });

    // Listen for user Leave Room
    socket.on("leaveRoom", (data) => {
      const user = leaveChatroom(data.userId, data.roomId);
      console.log("leaveRoom", user);
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
      console.log("disconnect", socket.id);
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.roomId).emit("roomAlerts", "user has left the chat");

        // Send users and room info
        io.to(user.roomId).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
  return io;
};
