const db = require("../Config/Database");
const q = require("../Quaries/ChatQuaries");

module.exports.createRoom = async (room) => {
  try {
    let checkExistRoom = await db.all(q.data.checkRoomExist(room));
    if (checkExistRoom.length) {
      return checkExistRoom[0].id;
    } else {
      let newRoom = await db.Update_all(q.data.createRoom(), [
        room.user_id,
        room.provider_id,
        room.request_id,
      ]);
      return newRoom.insertId;
    }
  } catch (e) {
    console.log(e);
    return e.message;
  }
};
module.exports.userRooms = async (userId) => {
  try {
    let rooms = await db.all(q.data.getRoomsByUserId(userId));
    let room_ids = [0];
    for (let i = 0; i < rooms.length; i++) {
      room_ids.push(rooms[i].id);
    }

    let unreadCount = await db.Update_all(q.data.getUnReadChat(), [
      room_ids,
      userId,
    ]);
    for (let i = 0; i < rooms.length; i++) {
      rooms[i].unread_chats = 0;
      for (let j = 0; j < unreadCount.length; j++) {
        if (rooms[i].id === unreadCount[j].room_id) {
          rooms[i].unread_chats = unreadCount[j].unread;
        }
      }
    }
    return rooms;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};
module.exports.getOldChat = async (data) => {
  try {
    let oldChat = await db.Update_all(q.data.getOldChatWithRoomId(data.roomId));
    return oldChat;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};
module.exports.saveMessage = async (chat, seen) => {
  try {
    await db.Update_all(q.data.updateLastMessageInRoom(), [
      chat.msg,
      chat.type,
      chat.roomId,
    ]);
    let lastSaved = await db.Update_all(q.data.saveMessageInRoom(), [
      chat.roomId,
      chat.userId,
      chat.msg,
      chat.type,
      seen,
      chat.user_type,
    ]);
    let savedMessage = await db.all(q.data.getMessage(lastSaved.insertId));

    return savedMessage[0];
  } catch (e) {
    console.log(e);
    return e.message;
  }


};
