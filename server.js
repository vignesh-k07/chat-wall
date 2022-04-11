const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notfound, errorhandler } = require("./middlewares/errorMiddleware");
const path = require("path");
const cors = require("cors");

dotenv.config(); //to access from .env

connectDB(); //DB connections

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //to accept JSON data
app.use(express.static('./build/'));

// Routes
app.use("/api/user", userRoutes); //login and signup routes
app.use("/api/chat", chatRoutes); //one to one and group chat CRUDs
app.use("/api/message", messageRoutes); //SocketIO message routes
app.use(cors());
// cors headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,OPTIONS,PUT,PATCH,DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-with,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});



app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/build/index.html'))
  });

// server running port

const server = app.listen(PORT, console.log("server running ...")); //save server in a variable


// // ----------------SOCKET.IO------------------------------

// // initialize
// const io = require("socket.io")(server, {
//   pingTimeout: 60000, //waits 60 seconds and close connection to save band width if user is inactive
//   // cors origin set
//   cors: {
//     origin: "http://localhost:5000",
//   },
// });

// // create a connection
// io.on("connection", (socket) => {
//   console.log("connected to socket.io");

//   // create new socket where frontend send data and create ne room
//   socket.on("setup", (userData) => {
//     socket.join(userData._id); //new room exclusive to particular user
//     console.log(userData._id);
//     socket.emit("connected"); //emit connected event
//   });

//   // create join chat socket
//   socket.on("join chat", (room) => {
//     //join chat
//     socket.join(room); //create a room with each chat
//     console.log("User Joined Room: " + room);
//   });

//   socket.on("typing", (room) => socket.in(room).emit("typing")); //inside of room emit typing event(room=selected chat)
//   socket.on("stop typing", (room) => socket.in(room).emit("stop typing")); //inside room emit stoptyping event

//   // send new message
//   socket.on("new message", (newmessageReceived) => {
//     var chat = newmessageReceived.chat; //chat in which message belong to

//     if (!chat.users) return console.log("chat.users not defined"); //if chat doesnt have any users

//     chat.users.forEach((user) => {
//       if (user._id == newmessageReceived.sender._id) return; //if message send by logged in user just return

//       socket.in(user._id).emit("message received", newmessageReceived); //sending message received event to logged in user room
//     });
//   });

//   // clean socket when user leave(or log off,as userdata is not there)
//   socket.off("setup", () => {
//     console.log("USER DISCONNECTED");
//     socket.leave(userData._id);
//   });
// });