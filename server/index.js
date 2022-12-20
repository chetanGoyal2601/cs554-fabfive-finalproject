const express = require("express");
const app = express();
const cors = require("cors");
const static = express.static("/");

// rohits db setup code
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => console.log(err));

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const initializeSocket = require("./chat");
const configRoutes = require("./routes");

app.use(static);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

server.listen(8000, () => {
  console.log("Server is up and running on 'http://localhost:8000' !!");
});

configRoutes(app);
initializeSocket(io);
