const express = require("express");
const path = require("path");

const socketio = require("socket.io");
const http = require("http");

const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  socket.on("send-location", function (data) {
    const { latitude, longitude } = data;
    console.log(latitude, longitude);
    io.emit("receive-location", { id: socket.id, ...data });
  });
  console.log("connected !");

  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id);
  });
});

// io.on("connection", (socket) => {
//   console.log("A user connected: " + socket.id);

//   socket.on("send-location", (data) => {
//     // Broadcast to all clients
//     io.emit("receive-location", { id: socket.id, ...data });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected: " + socket.id);
//     io.emit("user-disconnected", socket.id);
//   });
// });

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000);
