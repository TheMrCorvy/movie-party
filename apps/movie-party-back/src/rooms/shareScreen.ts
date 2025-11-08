import { logData } from "@repo/shared-utils/log-data";
import {
    ScreenShareWsCallbackParams,
    ServerRoom,
    ShareScreenWsParams,
    Signals,
} from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";
import roomValidation from "../utils/roomValidations";

export interface ShareScreenParams extends ShareScreenWsParams {
    io: SocketIOServer;
    rooms: ServerRoom[];
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

    const { roomIndex, roomExists, peer, peerIsParticipant } = roomValidation({
        roomId,
        rooms,
        peerId,
        peerShouldBeParticipant: true,
    });

    if (roomIndex === -1 || !roomExists) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    if (!peer || !peerIsParticipant) {
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
