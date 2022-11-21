const express = require("express");
const app = express();
const http = require("http");
require("dotenv").config();

var bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const port = process.env.APP_PORT;

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log("server up and running on PORT :", port);
});

const io = require("./socket")(httpServer, app);
app.set("socketio", io);
