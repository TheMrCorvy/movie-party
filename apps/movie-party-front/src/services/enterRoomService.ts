import { logData } from "@repo/shared-utils/log-data";
import { Signals } from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";
export interface EnterRoomServiceParams {
    ws: Socket | null;
    peerId: string;
    peerName: string;
    roomId: string;
}

export type EnterRoomService = (params: EnterRoomServiceParams) => void;

export const enterRoomService: EnterRoomService = ({
    ws,
    peerId,
    peerName,
    roomId,
}) => {
    if (ws) {
        ws.emit(Signals.ENTER_ROOM, {
            peerId,
            peerName,
            roomId,
        });
    }
};

export interface VerifyRoomServiceCallbackParams {
    roomExists: boolean;
    password: boolean;
}

export interface VerifyRoomServiceParams {
    roomId: string;
    ws: Socket | null;
    callback: (params: VerifyRoomServiceCallbackParams) => void;
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

    ws.emit(Signals.DOES_ROOM_EXISTS, { roomId });
    ws.on(Signals.ROOM_EXISTS, callback);
    ws.on(Signals.ROOM_NOT_FOUND, callback);

    return () => {
        ws.off(Signals.ROOM_EXISTS);
        ws.off(Signals.ROOM_NOT_FOUND);
    };
};
