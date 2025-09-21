import { Socket, Server as SocketIOServer } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";
import { Rooms } from "@repo/type-definitions/rooms";
import { createRoom } from "./createRoom";
import { enterRoom } from "./enterRoom";
import { leaveRoom } from "./leaveRoom";

export interface RoomParams {
    roomId: string;
    peerId: string;
}

const rooms: Rooms = {};

export const roomHandler = (socket: Socket, io: SocketIOServer) => {
    socket.on(Signals.CREATE_ROOM, () => createRoom({ rooms, socket }));
    socket.on(Signals.ENTER_ROOM, ({ roomId, peerId, peerName }) =>
        enterRoom({ roomId, peerId, peerName, rooms, io, socket })
    );
    socket.on(Signals.LEAVE_ROOM, ({ peerId, roomId }) => {
        // the user clicked to leave the room
        console.log("user left the room", peerId);
        leaveRoom({ roomId, peerId, rooms, io });
    });
};
