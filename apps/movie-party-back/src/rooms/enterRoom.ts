import { RoomParams } from ".";
import type { Socket, Server as SocketIOServer } from "socket.io";
import { Signals, Room } from "@repo/type-definitions/rooms";
import { leaveRoom } from "./leaveRoom";

export interface EnterRoomParams extends RoomParams {
    peerName: string;
    rooms: Room[];
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
    const room = rooms.find((room) => room.id === roomId);
    if (!room) {
        socket.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    socket.join(roomId);

    const participantIndex = room.participants.findIndex(
        (participant) => participant.id === peerId
    );

    if (participantIndex === -1) {
        room.participants.push({
            id: peerId,
            name: peerName,
        });
    }

    io.in(roomId).emit(Signals.GET_PARTICIPANTS, {
        roomId,
        participants: room.participants,
    });

    console.log("user joined the room: ", { roomId, peerId, peerName });

    socket.on("disconnect", () => {
        // sudden disconnection
        console.log("user left the room", peerId);
        leaveRoom({ roomId, peerId, rooms, io });
    });
};
