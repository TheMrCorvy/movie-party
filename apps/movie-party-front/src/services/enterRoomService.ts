import { Signals } from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";
export interface EnterRoomParams {
    ws: Socket | null;
    peerId: string;
    peerName: string;
    roomId: string;
}

export type EnterRoomService = (params: EnterRoomParams) => void;

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
