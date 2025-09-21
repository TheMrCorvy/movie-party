import { RoomParams, Rooms } from ".";
import type { Socket, Server as SocketIOServer } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";
import { leaveRoom } from "./leaveRoom";

export interface EnterRoomParams extends RoomParams {
    peerName: string;
    rooms: Rooms;
    socket: Socket;
    io: SocketIOServer;
}

export type EnterRoom = (params: EnterRoomParams) => void;

export const enterRoom: EnterRoom = ({
    roomId,
    peerId,
    peerName,
    rooms,
    io,
    socket,
}) => {
    if (!rooms[roomId]) {
        socket.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    socket.join(roomId);

    const participantIndex = rooms[roomId].participants.findIndex(
        (participant) => participant.id === peerId
    );

    if (participantIndex === -1) {
        rooms[roomId].participants.push({
            id: peerId,
            name: peerName,
        });
    }

    io.in(roomId).emit(Signals.GET_PARTICIPANTS, {
        roomId,
        participants: rooms[roomId].participants,
    });

    socket.to(roomId).emit(Signals.USER_JOINED, { peerId, peerName });

    console.log("user joined the room: ", { roomId, peerId, peerName });

    socket.on("disconnect", () => {
        console.log("user left the room", peerId);
        leaveRoom({ roomId, peerId, rooms, socket });
    });
};
