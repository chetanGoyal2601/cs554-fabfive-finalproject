const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const initializeSocket = require('./chat');
const configRoutes = require('./routes');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


server.listen(8000, () => {
    console.log("Server is up and running on 'http://localhost:8000' !!");
});

configRoutes(app);
initializeSocket(io);