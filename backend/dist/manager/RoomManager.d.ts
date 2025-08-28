import type { User } from "../manager/UserManager.js";
export declare class RoomManager {
    private rooms;
    constructor();
    createRoom(user1: User, user2: User): void;
    onOffer(roomId: string, sdp: string, senderSocketid: string): void;
    onAnswer(roomId: string, sdp: string, senderSocketid: string): void;
    onIceCandidates(roomId: string, senderSocketid: string, candidate: any, type: "sender" | "receiver"): void;
    generate(): number;
}
//# sourceMappingURL=RoomManager.d.ts.map