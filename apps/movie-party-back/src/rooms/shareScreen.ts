import { logData } from "@repo/shared-utils/log-data";
import {
    Room,
    ScreenShareWsCallbackParams,
    ShareScreenWsParams,
    Signals,
} from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";

export interface ShareScreenParams extends ShareScreenWsParams {
    io: SocketIOServer;
    rooms: Room[];
}

export type ShareScreen = (params: ShareScreenParams) => void;

export const shareScreen: ShareScreen = ({
    roomId,
    peerId,
    status,
    io,
    rooms,
}) => {
    if (!roomId) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    const roomIndex = rooms.findIndex((r) => r.id === roomId);

    if (roomIndex === -1) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    const peer = rooms[roomIndex].participants.find((p) => p.id === peerId);

    if (!peer) {
        io.emit(Signals.ERROR);
        return;
    }

    rooms[roomIndex] = {
        ...rooms[roomIndex],
        peerSharingScreen: peerId,
    };

    const callbackParams: ScreenShareWsCallbackParams = { peerId, status };

    io.emit(Signals.SCREEN_SHARING, callbackParams);

    logData({
        title: "Someone toggled their screen share",
        addSpaceAfter: true,
        type: "info",
        layer: "screen_sharing",
        data: { peerId, status },
        timeStamp: true,
    });
};
