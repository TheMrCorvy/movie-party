import type { Socket, Server as SocketIOServer } from "socket.io";
import {
    Signals,
    BackgroundUpdatedWsParams,
    BackgroundUpdatedWsCallbackParams,
    ServerRoom,
} from "@repo/type-definitions/rooms";
import { logData } from "@repo/shared-utils/log-data";
import roomValidation from "../utils/roomValidations";

export interface UpdateBackgroundParams extends BackgroundUpdatedWsParams {
    rooms: ServerRoom[];
    io: SocketIOServer;
    socket: Socket;
}

export const updateBackground = ({
    roomId,
    peerId,
    background,
    rooms,
    io,
    socket,
}: UpdateBackgroundParams) => {
    try {
        const { room, peer } = roomValidation({
            rooms,
            roomId,
            peerShouldBeParticipant: true,
            peerId,
        });

        if (!room) {
            socket.emit(Signals.ROOM_NOT_FOUND);
            return;
        }

        if (!peer) {
            socket.emit(Signals.ERROR, { message: "Peer not in room." });
            return;
        }

        room.hasCustomBg = background;

        const callback: BackgroundUpdatedWsCallbackParams = {
            background: room.hasCustomBg,
        };

        io.in(roomId).emit(Signals.BACKGROUND_UPDATED, callback);

        logData({
            title: "Background updated",
            layer: "room_ws",
            type: "info",
            timeStamp: true,
            addSpaceAfter: true,
            data: { roomId, peerId, background },
        });
    } catch (err) {
        logData({
            title: "Error updating background",
            layer: "room_ws",
            type: "error",
            timeStamp: true,
            addSpaceAfter: true,
            data: err,
        });
    }
};
