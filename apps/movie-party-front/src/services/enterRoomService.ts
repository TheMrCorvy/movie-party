import { logData } from "@repo/shared-utils/log-data";
import {
    EnterRoomWsParams,
    LeaveRoomWsParams,
    RoomExistsWsCallbackParams,
    RoomExistsWsParams,
    Signals,
} from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";
export interface EnterRoomServiceParams extends EnterRoomWsParams {
    ws: Socket | null;
}

export type EnterRoomService = (params: EnterRoomServiceParams) => void;

export const enterRoomService: EnterRoomService = ({
    ws,
    peerId,
    peerName,
    roomId,
}) => {
    if (ws) {
        const enterRoomParams: EnterRoomWsParams = {
            peerId,
            peerName,
            roomId,
        };
        ws.emit(Signals.ENTER_ROOM, enterRoomParams);
    }
};

export interface VerifyRoomServiceParams extends RoomExistsWsParams {
    ws: Socket | null;
    callback: (params: RoomExistsWsCallbackParams) => void;
}

export type VerifyRoomService = (params: VerifyRoomServiceParams) => () => void;

export const verifyRoom: VerifyRoomService = ({ roomId, ws, callback }) => {
    if (!ws) {
        return () => {
            logData({
                title: "Nothing to unmount",
                type: "warn",
                data: {
                    message:
                        "Something during the setup of the events went wrong...",
                },
                layer: "room_ws",
                timeStamp: true,
            });
        };
    }

    const roomExistsParams: RoomExistsWsParams = { roomId };

    ws.emit(Signals.DOES_ROOM_EXISTS, roomExistsParams);
    ws.on(Signals.ROOM_EXISTS, callback);
    ws.on(Signals.ROOM_NOT_FOUND, callback);

    return () => {
        ws.off(Signals.ROOM_EXISTS);
        ws.off(Signals.ROOM_NOT_FOUND);
    };
};

export interface LeaveRoomServiceParams extends LeaveRoomWsParams {
    ws: Socket | null;
}

export type LeaveRoomService = (params: LeaveRoomServiceParams) => void;

export const leaveRoomService: LeaveRoomService = ({ roomId, peerId, ws }) => {
    if (!ws) {
        return () => {
            logData({
                title: "Failed to call web socket",
                type: "warn",
                data: {
                    message:
                        "Something during the setup of the events went wrong...",
                },
                layer: "room_ws",
                timeStamp: true,
            });
        };
    }

    ws.emit(Signals.LEAVE_ROOM, { peerId, roomId });
};
