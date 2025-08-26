import { Socket } from "socket.io";
export interface User {
    socket: Socket;
    name: string;
}
export declare class UserManager {
    private users;
    private queue;
    private roomManager;
    constructor();
    addUser(socket: Socket, name: string): void;
    removeUser(socketId: string): void;
    clearQueue(): void;
    initHandlers(socket: Socket): void;
}
//# sourceMappingURL=UserManager.d.ts.map