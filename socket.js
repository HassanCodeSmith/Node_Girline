const { Server } = require("socket.io");
const UserModel = require("./models/user");
const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let users = [];

  const addUser = (userId, socketId) => {
    console.log(userId, socketId);
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  const addAdmin = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId, isAdmin: true });
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  const getAdmin = () => {
    return users.find((user) => user.isAdmin === true);
  };

  io.on("connection", (socket) => {
    console.log("a user connected.");

    socket.on("addUser", async (userId) => {
      console.log("AddUser:", userId);
      const AdminCheck = await UserModel.findOne({ _id: userId });
      if (AdminCheck.role === "admin") {
        addAdmin(userId, socket.id);
      } else {
        addUser(userId, socket.id);
      }
      console.log("userArray:", users);
      io.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderId, receiverId, text, isClient }) => {
      console.log("SenderID:", senderId, receiverId, text, isClient);
      if (isClient) {
        const user = getAdmin();
        console.log("UseR:", user);
        console.log({ message: text });
        io.to(user?.socketId).emit("getMessage", {
          senderId,
          text,
        });
      } else {
        const user = getUser(receiverId);
        console.log("UseR:", user);
        console.log({ message: text });
        io.to(user?.socketId).emit("getMessage", {
          senderId,
          text,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};

module.exports = setupSocket;
