import { Room, Signals } from "@repo/type-definitions/rooms";
import type { Server as SocketIOServer } from "socket.io";

export interface RoomExistsParams {
    roomId: string;
    rooms: Room[];

    io: SocketIOServer;
}
export const roomExists = ({ roomId, rooms, io }: RoomExistsParams) => {
    const room = rooms.find((r) => r.id === roomId);

    if (room) {
        io.emit(Signals.ROOM_EXISTS, { room });
    } else {
        io.emit(Signals.ROOM_NOT_FOUND, { room: undefined });
    }
};
