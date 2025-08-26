import type { User } from "../manager/UserManager.js";
export declare class RoomManager {
    constructor();
    private rooms;
    createRoom(user1: User, user2: User): void;
    onOffer(roomId: string, sdp: string): void;
    onAnswer(roomId: string, sdp: string): void;
    generate(): number;
}
//# sourceMappingURL=RoomManager.d.ts.map