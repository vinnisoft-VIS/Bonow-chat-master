const allUsers = [];
const roomUsers = [];

function userJoin(id, userId) {
  const user = { id, userId };
  const index = allUsers.findIndex((user) => user.userId === userId);
  if (index === -1) {
    allUsers.push(user);
    // console.log("userJoin1==>", allUsers);
    return user;
  } else {
    allUsers[index].id = id;
    // console.log("userJoin2==>", allUsers);
    return user;
  }
}
function getSocketIdWithUserId(user_id) {
  return allUsers.find((user) => user.userId == user_id);
}

// Join user to chat
function userJoinRoom(id, userId, roomId) {
  const user = { id, userId, roomId };
  const result = roomUsers.filter(
    (u) => JSON.stringify(u) === JSON.stringify(user)
  );
  if (result.length) {
    // console.log("userJoinRoom1", roomUsers);
    return user;
  } else {
    roomUsers.push(user);
    // console.log("userJoinRoom2", roomUsers);
    return user;
  }
}

// Get current user
function getCurrentUser(id) {
  // console.log("getCurrentUser", roomUsers);
  return roomUsers.find((user) => user.id === id);
}
// User leaves chat Room
function leaveChatroom(user_id, room_id) {
  const index = roomUsers.findIndex(
    (user) => user.userId === user_id && user.roomId === room_id
  );
  if (index !== -1) {
    let result = roomUsers.splice(index, 1)[0];
    // console.log("leaveChatroom", roomUsers);
    return result;
  }
}
// allUsers
// User leaves chat
function userLeave(id) {
  const roomUsersIndex = roomUsers.findIndex((user) => user.id === id);
  const index = allUsers.findIndex((user) => user.id === id);

  if (roomUsersIndex !== -1) {
    let result = roomUsers.splice(roomUsersIndex, 1)[0];
    let result1 = allUsers.splice(index, 1)[0];
    // console.log("userLeave", roomUsers, allUsers);
    return result;
  }
}

// Get room users
function getRoomUsers(room) {
  return roomUsers.filter((user) => user.roomId === room);
}

module.exports = {
  userJoinRoom,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  leaveChatroom,
  userJoin,
  getSocketIdWithUserId,
};
