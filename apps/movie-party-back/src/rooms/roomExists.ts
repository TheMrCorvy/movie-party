import { logData } from "@repo/shared-utils/log-data";
import {
    RoomExistsWsCallbackParams,
    RoomExistsWsParams,
    ServerRoom,
    Signals,
} from "@repo/type-definitions/rooms";
import type { Server as SocketIOServer } from "socket.io";

export interface RoomExistsParams extends RoomExistsWsParams {
    io: SocketIOServer;
    rooms: ServerRoom[];
}
export const roomExists = ({ roomId, rooms, io }: RoomExistsParams) => {
    const room = rooms.find((r) => r.id === roomId);
    const callbackParams: RoomExistsWsCallbackParams = {
        roomExists: true,
        password: false,
    };

    if (room) {
        callbackParams.password = room.password ? true : false;
        io.emit(Signals.ROOM_EXISTS, callbackParams);
        logData({
            layer: "room_ws",
            type: "log",
            title: "Room, in fact, exists",
            timeStamp: true,
            addSpaceAfter: true,
            data: roomId,
        });
    } else {
        callbackParams.roomExists = false;
        io.emit(Signals.ROOM_NOT_FOUND, callbackParams);
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
