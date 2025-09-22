import { Socket, Server as SocketIOServer } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";
import { Room } from "@repo/type-definitions/rooms";
import { createRoom } from "./createRoom";
import { enterRoom } from "./enterRoom";
import { leaveRoom } from "./leaveRoom";
import { roomExists } from "./roomExists";

export interface RoomParams {
    roomId: string;
    peerId: string;
}

let rooms: Room[] = []; // eslint-disable-line prefer-const

export const roomHandler = (socket: Socket, io: SocketIOServer) => {
    socket.on(Signals.CREATE_ROOM, ({ peerName, peerId }) =>
        createRoom({ rooms, socket, peerName, peerId })
    );
    socket.on(Signals.ENTER_ROOM, ({ roomId, peerId, peerName }) =>
        enterRoom({ roomId, peerId, peerName, rooms, io, socket })
    );
    socket.on(Signals.LEAVE_ROOM, ({ peerId, roomId }) => {
        // the user clicked to leave the room
        console.log("user left the room", peerId);
        leaveRoom({ roomId, peerId, rooms, io });
    });
    socket.on(Signals.DOES_ROOM_EXISTS, ({ roomId }) =>
        roomExists({ rooms, roomId, io })
    );
};
