import { Room } from "@repo/type-definitions/rooms";
import { Socket, Server as SocketIOServer } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";
import { leaveRoom } from "./leaveRoom";
import { generateId } from "@repo/shared-utils";

export interface CreateRoomParams {
    rooms: Room[];
    socket: Socket;
    peerId: string;
    peerName: string;
    io: SocketIOServer;
}

export type CreateRoom = (params: CreateRoomParams) => void;

export const createRoom: CreateRoom = ({
    rooms,
    socket,
    peerId,
    peerName,
    io,
}) => {
    const roomId = generateId();
    const room = {
        id: roomId,
        messages: [],
        participants: [
            {
                id: peerId,
                name: peerName,
                index: 0,
            },
        ],
    };
    rooms.push(room);

    socket.join(roomId);
    socket.emit(Signals.ROOM_CREATED, { room });
    console.log("user created a room", room);

    socket.on("disconnect", (reason) => {
        // sudden disconnection
        console.log(`${peerName} left the room, reason: ${reason}`);
        leaveRoom({ roomId, peerId, rooms, io });
    });
};
