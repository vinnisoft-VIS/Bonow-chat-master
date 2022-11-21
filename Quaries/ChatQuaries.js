const queries = {};

queries.insertQuery = function () {
  return "insert into forgot_password_request set ? ";
};
queries.selectAll = function () {
  return `SELECT * FROM tbl_chat`;
};

// chat rooms
queries.checkRoomExist = function (data) {
  return `select * from tbl_chat_rooms 
  WHERE 
  (	user_id="${data.user_id}" AND provider_id="${data.provider_id}" AND request_id="${data.request_id}")`;
};
queries.createRoom = function () {
  return `INSERT INTO tbl_chat_rooms(user_id, provider_id,request_id) VALUES (?,?,?)`;
};

queries.getRoomsByUserId = function (id) {
  return `
      SELECT tbl_chat_rooms.*,tbl_chat_rooms.last_message_type as unread_chats,
      auth_user.first_name as sender_name,
      profile.image as sender_img
      FROM tbl_chat_rooms  
      INNER JOIN auth_user
      ON 
      IF(tbl_chat_rooms.sender_id="${id}",
      tbl_chat_rooms.reciever_id=auth_user.id,
      tbl_chat_rooms.sender_id=auth_user.id) 

      INNER JOIN profile
      ON profile.user_id=auth_user.id
      WHERE (sender_id="${id}" OR reciever_id="${id}") AND last_message != "0"
      ORDER BY tbl_chat_rooms.createdDtm DESC`;
};

queries.getUnReadChat = function () {
  return `SELECT COUNT(*) as unread ,room_id 
  FROM tbl_chat 
  WHERE room_id 
  IN (?)
  && sender_id !=? 
  && is_seen=0 
  GROUP by room_id`;
};

queries.markRoomChatSeen = function () {
  return `UPDATE tbl_chat SET is_seen=1 WHERE room_id=? && sender_id !=?`;
};
queries.getOldChatWithRoomId = function (id) {
  return `SELECT tbl_chat.* 
  FROM tbl_chat 
  WHERE tbl_chat.room_id=${id}`;
};

queries.updateLastMessageInRoom = function () {
  return `UPDATE tbl_chat_rooms SET 
  last_message=?,last_message_type=? WHERE id=?`;
};
queries.saveMessageInRoom = function () {
  return `INSERT INTO tbl_chat(room_id, sender_id, message,type,is_seen,user_type) VALUES
  (?,?,?,?,?,?)`;
};
queries.getMessage = function (id) {
  return `SELECT tbl_chat.* 
  FROM tbl_chat 
  WHERE tbl_chat.id=${id}`;
};

queries.getRoomInfo = function (room_id) {
  return `SELECT * FROM tbl_chat_rooms WHERE id=${room_id}`;
};

queries.getUserFCM = function (id) {
  return `SELECT id,first_name,last_name,device_token as token
  FROM users WHERE id=${id}`;
};
queries.getProviderFCM = function (id) {
  return `SELECT providers.id, providers.first_name,providers.last_name,provider_devices.token
  FROM providers 
  INNER JOIN provider_devices
  ON providers.id=provider_devices.provider_id 
  WHERE providers.id=${id}`;
};

queries.updateUserFCM = function (id, token) {
  return `UPDATE users SET device_token="${token}"
  WHERE id=${id}`;
};
queries.updateProviderFCM = function (id, token) {
  return `UPDATE provider_devices SET token="${token}"
  WHERE provider_id=${id}`;
};

exports.data = queries;
