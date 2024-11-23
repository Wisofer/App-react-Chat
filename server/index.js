import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import { resolve } from "path";
import { PORT } from "./config.js";
import cors from "cors";

// Inicializaciones
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(resolve("frontend/dist")));

// Configuración de Socket.io
io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  socket.on("message", (body) => {
    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(8),
    });
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});