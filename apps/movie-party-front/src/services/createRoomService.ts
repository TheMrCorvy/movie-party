import {
    CreateRoomWsParams,
    RoomCreatedWsCallbackParams,
    Signals,
} from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";

import { generateId, stringIsEmpty } from "@repo/shared-utils";
import { logData } from "@repo/shared-utils/log-data";

export interface CreateRoomServiceParams extends CreateRoomWsParams {
    ws: Socket | null;
}

export const createRoomService = ({
    ws,
    peerName,
    password,
}: CreateRoomServiceParams) => {
    if (!peerName || stringIsEmpty(peerName)) {
        logData({
            title: "Peer name was not found",
            type: "error",
            data: {
                message:
                    "Something during the setup of the events went wrong...",
                peerName,
            },
            layer: "room_ws",
            timeStamp: true,
        });
    }
    if (!ws) {
        logData({
            title: "Websocket not found",
            type: "error",
            data: {
                message:
                    "Something during the setup of the events went wrong...",
                ws,
            },
            layer: "room_ws",
            timeStamp: true,
        });
        return;
    }
    const createRoomParams: CreateRoomWsParams = {
        peerId: generateId(),
        peerName,
        password,
    };
    ws.emit(Signals.CREATE_ROOM, createRoomParams);
};

export interface RoomWasCreatedParams {
    ws: Socket | null;
    callback: (params: RoomCreatedWsCallbackParams) => void;
}

export const roomWasCreated = ({ ws, callback }: RoomWasCreatedParams) => {
    if (ws) {
        ws.on(Signals.ROOM_CREATED, callback);
        return () => {
            ws.off(Signals.ROOM_CREATED, callback);
        };
    } else {
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
};
