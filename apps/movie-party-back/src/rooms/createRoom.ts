import { v4 as uuidv4 } from "uuid";
import { Room } from "@repo/type-definitions/rooms";
import { Socket } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";

export interface CreateRoomParams {
    rooms: Room[];
    socket: Socket;
}

export type CreateRoom = (params: CreateRoomParams) => void;

export const createRoom: CreateRoom = ({ rooms, socket }) => {
    const roomId = uuidv4();

    rooms.push({
        id: roomId,
        messages: [],
        participants: [],
    });

    socket.emit(Signals.ROOM_CREATED, { roomId });
    console.log("user created a room", rooms[0]);
};
