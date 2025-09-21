import { Socket, Server as SocketIOServer } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";
import { Message, Participant } from "@repo/type-definitions";
import { createRoom } from "./createRoom";
import { enterRoom } from "./enterRoom";
import { startSharing, stopSharing } from "./shareScreen";

export interface RoomParams {
    roomId: string;
    peerId: string;
}

export interface Rooms {
    [roomId: string]: {
        messages: Message[];
        participants: Participant[];
    };
}

const rooms: Rooms = {};

export const roomHandler = (socket: Socket, io: SocketIOServer) => {
    socket.on(Signals.CREATE_ROOM, () => createRoom({ rooms, socket }));
    socket.on(Signals.ENTER_ROOM, ({ roomId, peerId, peerName }) =>
        enterRoom({ roomId, peerId, peerName, rooms, io, socket })
    );
    socket.on(Signals.START_SHARING, ({ roomId, peerId }) =>
        startSharing({ roomId, peerId, io, socket })
    );
    socket.on(Signals.STOP_SHARING, ({ roomId, peerId }) =>
        stopSharing({ roomId, peerId, io })
    );
};
