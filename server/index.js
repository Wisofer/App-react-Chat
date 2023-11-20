import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";


const app = express();

const server = http.createServer(app);
const io = new SocketServer(server)

io.on("connection", socket => {
    console.log("Cliente Conectado...");

    socket.on('mensaje', (body) => {
        socket.broadcast.emit('mensaje', {
            body,
            from:socket.id.slice(6)
        })
    })
});

server.listen(4000);
console.log("Servidor escuchando en el puerto",4000);