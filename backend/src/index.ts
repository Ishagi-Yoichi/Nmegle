import express from 'express';
import http from 'http';
import { join } from 'node:path';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin: "*"
  }
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});