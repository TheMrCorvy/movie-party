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

    const participantIndex = room.participants.findIndex(
        (participant) => participant.id === peerId
    );

    if (participantIndex === -1) {
        room.participants.push({
            id: peerId,
            name: peerName,
        });

        socket.join(roomId);
    }

    console.log("Emitting get participants...");
    io.in(roomId).emit(Signals.GET_PARTICIPANTS, {
        roomId,
        participants: room.participants,
        messages: room.messages,
    });

    console.log("user joined the room: ", { roomId, peerId, peerName });

    socket.on("disconnect", (reason) => {
        // sudden disconnection
        console.log(`${peerName} left the room, reason: ${reason}`);
        leaveRoom({ roomId, peerId, rooms, io });
    });
};
