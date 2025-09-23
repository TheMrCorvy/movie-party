import { v4 as uuidv4 } from "uuid";
import { Room } from "@repo/type-definitions/rooms";
import { Socket, Server as SocketIOServer } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";
import { leaveRoom } from "./leaveRoom";

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
    const roomId = uuidv4();
    const room = {
        id: roomId,
        messages: [],
        participants: [
            {
                id: peerId,
                name: peerName,
            },
        ],
    };
    rooms.push(room);

    socket.emit(Signals.ROOM_CREATED, { room });
    console.log("user created a room", room);

    socket.on("disconnect", (reason) => {
        // sudden disconnection
        console.log(`${peerName} left the room, reason: ${reason}`);
        leaveRoom({ roomId, peerId, rooms, io });
    });
};
