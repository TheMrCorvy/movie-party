import { logData } from "@repo/shared-utils/log-data";
import {
    RoomExistsWsCallbackParams,
    RoomExistsWsParams,
    ServerRoom,
    Signals,
} from "@repo/type-definitions/rooms";
import type { Server as SocketIOServer } from "socket.io";
import roomValidation from "../utils/roomValidations";

export interface RoomExistsParams extends RoomExistsWsParams {
    io: SocketIOServer;
    rooms: ServerRoom[];
}
export const roomExists = ({ roomId, rooms, io }: RoomExistsParams) => {
    const { room } = roomValidation({
        rooms,
        roomId,
    });
    const callbackParams: RoomExistsWsCallbackParams = {
        roomExists: true,
        password: false,
        hasCustomBg: undefined,
    };

    if (!room) {
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
        return;
    }

    callbackParams.password = room.password ? true : false;
    callbackParams.hasCustomBg = room.hasCustomBg;
    io.emit(Signals.ROOM_EXISTS, callbackParams);
    logData({
        layer: "room_ws",
        type: "log",
        title: "Room, in fact, exists",
        timeStamp: true,
        addSpaceAfter: true,
        data: roomId,
    });
};
