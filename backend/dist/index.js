import express from 'express';
import http from 'http';
import { join } from 'node:path';
import { Server, Socket } from 'socket.io';
import { UserManager } from './manager/UserManager.js';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
const userManager = new UserManager();
io.on('connection', (socket) => {
    console.log('a user connected');
    userManager.addUser(socket, "randomName");
    socket.on('disconnect', () => {
        console.log('user disconnected');
        userManager.removeUser(socket.id);
    });
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});
//# sourceMappingURL=index.js.map