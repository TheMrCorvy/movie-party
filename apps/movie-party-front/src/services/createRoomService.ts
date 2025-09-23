import { Signals } from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";

import { generateId, stringIsEmpty } from "@repo/shared-utils";

export interface CreateRoomServiceParams {
    ws: Socket | null;
    peerName: string;
}

export const createRoomService = ({
    ws,
    peerName,
}: CreateRoomServiceParams) => {
    if (!peerName || stringIsEmpty(peerName)) {
        throw new Error("Peer name was not found.");
    }
    if (!ws) {
        console.error("Websocket not found");
        return;
    }
    ws.emit(Signals.CREATE_ROOM, {
        peerId: generateId(),
        peerName,
    });
};

export interface RoomWasCreatedParams {
    ws: Socket | null;
    callback: (params: any) => void;
}

export const roomWasCreated = ({ ws, callback }: RoomWasCreatedParams) => {
    if (ws) {
        ws.on(Signals.ROOM_CREATED, callback);
        return () => {
            ws.off(Signals.ROOM_CREATED, callback);
        };
    } else {
        return () => {
            console.log("Nothing to unmount.");
        };
    }
};
