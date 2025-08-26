import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager.js";
let GLOBAL_ROOM_ID = 1;
export class UserManager {
    users;
    queue;
    roomManager;
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager();
    }
    addUser(socket, name) {
        this.users.push({ socket, name });
        this.queue.push(socket.id);
        socket.send("lobby");
        this.clearQueue();
        this.initHandlers(socket);
    }
    removeUser(socketId) {
        const user = this.users.find(x => x.socket.id === socketId);
        this.users = this.users.filter(x => x.socket.id !== socketId);
        this.queue = this.queue.filter(x => x === socketId);
    }
    clearQueue() {
        console.log('inside clear queues...');
        console.log(this.queue.length);
        if (this.queue.length < 2) {
            return;
        }
        const id1 = this.queue.pop();
        const id2 = this.queue.pop();
        console.log("id is " + id1 + " " + id2);
        const user1 = this.users.find(x => x.socket.id === id1);
        const user2 = this.users.find(x => x.socket.id === id2);
        if (!user1 || !user2) {
            return;
        }
        console.log('Creating room for ', user1.name, ' and ', user2.name);
        const room = this.roomManager.createRoom(user1, user2);
        this.clearQueue();
    }
    initHandlers(socket) {
        socket.on("offer", ({ sdp, roomId }) => {
            this.roomManager.onOffer(roomId, sdp);
        });
        socket.on("answer", ({ sdp, roomId }) => {
            this.roomManager.onAnswer(roomId, sdp);
        });
    }
}
//# sourceMappingURL=UserManager.js.map