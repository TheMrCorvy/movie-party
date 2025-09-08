import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { Signals } from "@repo/type-definitions/rooms";

interface EnterRoomParams {
    roomId: string;
    peerId: string;
}

const rooms: Record<string, string[]> = {};

export const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuidv4();
        rooms[roomId] = [];
        socket.emit(Signals.ROOM_CREATED, { roomId });
        console.log("user created a room");
    };

    const enterRoom = ({ roomId, peerId }: EnterRoomParams) => {
        if (!rooms[roomId]) {
            socket.emit(Signals.ROOM_NOT_FOUND);
            return;
        }

        socket.join(roomId);

        if (!rooms[roomId].includes(peerId)) {
            rooms[roomId].push(peerId);
        }

        socket.to(roomId).emit(Signals.GET_PARTICIPANTS, {
            roomId,
            participants: rooms[roomId],
        });
        console.log("user joined the room: ", { roomId, peerId });
    };

    socket.on(Signals.CREATE_ROOM, createRoom);
    socket.on(Signals.ENTER_ROOM, enterRoom);
};
