const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: ".env" });
const DB = require("./config/database.js").apply();
const errorMiddleware = require('./middlewares/errorMiddleware.js');
const ApiError = require('./utils/apiError.js');

const authRoute = require('./routes/authRoute.js');
const chatsRoute = require('./routes/chatRoute.js');
const messageRoute = require("./routes/messageRoute.js");

app.use(express.json());

//routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/chats', chatsRoute);
app.use("/api/v1/message", messageRoute);


app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this page ${req.url}`, 404));
});

//Global error middleware
app.use(errorMiddleware);

const port=process.env.PORT
const server=app.listen(5000, console.log(`SERVER STARTED ON ${port}...`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.ORIGIN_URL,
  },
});


io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});




process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection : ${err.name} | ${err.message}`);
  app.close(() => {
    console.error("shutting down ... ");
    process.exit(1);
  });
});