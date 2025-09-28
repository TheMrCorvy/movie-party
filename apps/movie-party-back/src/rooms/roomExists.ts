import { logData } from "@repo/shared-utils/log-data";
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
        io.emit(Signals.ROOM_EXISTS, {
            roomExists: true,
            password: room.password ? true : false,
        });
        logData({
            layer: "room_ws",
            type: "log",
            title: "Room, in fact, exists",
            timeStamp: true,
            addSpaceAfter: true,
            data: roomId,
        });
    } else {
        io.emit(Signals.ROOM_NOT_FOUND, {
            roomExists: false,
            password: false,
        });
        logData({
            layer: "room_ws",
            type: "error",
            title: "Room, in fact, doesn't exists",
            timeStamp: true,
            addSpaceAfter: true,
            data: roomId,
        });
    }
};
