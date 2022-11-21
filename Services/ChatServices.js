const { pool } = require("../config/database");
module.exports = {
  createRoom: (data, callBack) => {
    // console.log(data);
    pool.query(
      `INSERT INTO tbl_chat_rooms( product_id, sender_id, reciever_id) VALUES (?,?,?)`,
      [data.product_id, data.sender_id, data.reciever_id],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  checkRoomExist: (data, callBack) => {
    pool.query(
      `select * from tbl_chat_rooms 
      WHERE 
      (sender_id=${data.sender_id} AND reciever_id=${data.reciever_id}) 
      OR 
      (sender_id=${data.reciever_id} AND reciever_id=${data.sender_id}) `,
      [],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  
  getRoomsByUserId: (senderID, callBack) => {
    pool.query(
      `SELECT tbl_chat_rooms.*,tbl_chat_rooms.last_message_type as unread_chats,
      tbl_products.name as product_name,
      tbl_products.img as product_img ,
      tbl_users.name as sender_name
      FROM tbl_chat_rooms 
      INNER JOIN tbl_products
      ON tbl_chat_rooms.product_id=tbl_products.id     
      INNER JOIN tbl_users
      ON IF(tbl_chat_rooms.sender_id=?,tbl_chat_rooms.reciever_id=tbl_users.id,tbl_chat_rooms.sender_id=tbl_users.id) 
      WHERE (sender_id=? OR reciever_id=?) AND last_message != "0"
      ORDER BY tbl_chat_rooms.createdDtm DESC`,
      [senderID, senderID, senderID],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getOldChatWithRoomId: (id, callBack) => {
    pool.query(
      `SELECT tbl_chat.* ,tbl_users.name as sender_name,tbl_users.userImg as sender_img FROM tbl_chat 
      INNER JOIN tbl_users
      ON tbl_chat.sender_id=tbl_users.id 
      WHERE tbl_chat.room_id=${id} `,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUnReadChat: (rooms, sender_id, callBack) => {
    console.log("ingetUnreed", rooms);
    pool.query(
      `SELECT COUNT(*) as unread ,room_id 
      FROM tbl_chat 
      WHERE room_id 
      IN (?)
      && sender_id !=? 
      && is_seen=0 
      GROUP by room_id`,
      [rooms, sender_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  markRoomChatSeen: (room_id, sender_id, callBack) => {
    pool.query(
      `UPDATE tbl_chat SET is_seen=1 WHERE room_id=? && sender_id !=?`,
      [room_id, sender_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  saveMessageInRoom: (msgBody, callBack) => {
    pool.query(
      `INSERT INTO tbl_chat(room_id, sender_id, message,type,is_seen) VALUES
       (?,?,?,?,?)`,
      [
        msgBody.room_id,
        msgBody.sender_id,
        msgBody.message,
        msgBody.type,
        msgBody.is_seen,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getMessage: (id, callBack) => {
    pool.query(
      `SELECT tbl_chat.* ,tbl_users.name as sender_name,tbl_users.userImg as sender_img FROM tbl_chat 
      INNER JOIN tbl_users
      ON tbl_chat.sender_id=tbl_users.id 
      WHERE tbl_chat.id=${id} `,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateLastMessageInRoom: (data, callBack) => {
    // console.log(data);
    pool.query(
      `UPDATE tbl_chat_rooms SET 
        last_message=?,last_message_type=? WHERE id=?`,
      [data.message, data.type, data.room_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  getRoomInfo: (id, sender_id, callBack) => {
    pool.query(
      `SELECT tbl_chat_rooms.* ,
      tbl_products.name as product_name,
      tbl_users.name as sender_name,
      tbl_products.img as product_img
      FROM tbl_chat_rooms 
      INNER JOIN tbl_products
      ON tbl_chat_rooms.product_id=tbl_products.id 
      INNER JOIN tbl_users
      ON tbl_users.id=${sender_id}
      WHERE tbl_chat_rooms.id=${id} `,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
};
