import { Room, Signals } from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";

export interface ShareScreenParams {
    roomId: string;
    peerId: string;
    status: boolean;
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

    io.emit(Signals.SCREEN_SHARING, { peerId, status });
};
