const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const serialNumber = require("./serialNumber");

io.on("connection", function (socket) {
  console.log("Usuario conectado al socket de Agente");
  serialNumber(function (err, value) {
    if (value) {
      socket.emit("haveSerial", "LISTO");
      setTimeout(() => {
        socket.emit("serialNumber", value);
      }, 5000);
    }
  });
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

server.listen(5050, function () {
  console.log("Server listening at port 5050");
});
