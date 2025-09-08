import { Socket, Server as SocketIOServer } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { Signals } from "@repo/type-definitions/rooms";

interface RoomParams {
    roomId: string;
    peerId: string;
}

const rooms: Record<string, string[]> = {};

export const roomHandler = (socket: Socket, io: SocketIOServer) => {
    const createRoom = () => {
        const roomId = uuidv4();
        rooms[roomId] = [];
        socket.emit(Signals.ROOM_CREATED, { roomId });
        console.log("user created a room");
    };

    const enterRoom = ({ roomId, peerId }: RoomParams) => {
        if (!rooms[roomId]) {
            socket.emit(Signals.ROOM_NOT_FOUND);
            return;
        }

        socket.join(roomId);

        if (!rooms[roomId].includes(peerId)) {
            rooms[roomId].push(peerId);
        }

        io.in(roomId).emit(Signals.GET_PARTICIPANTS, {
            roomId,
            participants: rooms[roomId],
        });

        console.log("user joined the room: ", { roomId, peerId });

        socket.on("disconnect", () => {
            console.log("user left the room", peerId);
            leaveRoom({ roomId, peerId });
        });
    };

    const leaveRoom = ({ peerId, roomId }: RoomParams) => {
        rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);

        if (rooms[roomId]?.length === 0) {
            delete rooms[roomId];
            console.log("room deleted: ", roomId);
            return;
        }

        socket.to(roomId).emit(Signals.USER_LEFT, peerId);
    };

    socket.on(Signals.CREATE_ROOM, createRoom);
    socket.on(Signals.ENTER_ROOM, enterRoom);
};
