const OnlineUser = require("../../models/OnlineUser");

const addUser = async (id, user_id, room) => {
  const userDetail = {
    userId: user_id,
    socketId: id,
    room: room,
  };
  const insertOnlineUsers = new OnlineUser(userDetail);
  return await insertOnlineUsers.save();
  //   const existingUser = users.find(
  //     (user) => user.name.trim().toLowerCase() === name.trim().toLowerCase()
  //   );

  //   if (existingUser) return { error: "Username has already been taken" };
  //   if (!name && !room) return { error: "Username and room are required" };
  //   if (!name) return { error: "Username is required" };
  //   if (!room) return { error: "Room is required" };

  //   const user = { id, name, room };
  //   users.push(user);
  //   return { user };
};

const getUser = async (id) => {
  const getuser = await OnlineUser.findOne({ socketId: id });
  return getuser;
};

const deleteUser = async (id) => {
  const delete_User = await OnlineUser.deleteOne({ socketId: id });
  return delete_User;
  //   const index = users.findIndex((user) => user.id === id);
  //   if (index !== -1) return users.splice(index, 1)[0];
};

const getUsers = async (room) => {
  //   console.log(room);
  const getusers = await OnlineUser.find({ room: room });
  //  return getuser;
  //   console.log(getusers);
  // users.filter((user) => user.room === room);
  return getusers;
};

module.exports = { addUser, getUser, deleteUser, getUsers };
