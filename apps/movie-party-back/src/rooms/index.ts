import { Socket, Server as SocketIOServer } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";
import { Room } from "@repo/type-definitions/rooms";
import { createRoom } from "./createRoom";
import { enterRoom } from "./enterRoom";
import { leaveRoom } from "./leaveRoom";
import { roomExists } from "./roomExists";
import { sendReceiveMessages } from "./sendReceiveMessages";
import { togglePeerCamera } from "./togglePeerCamera";
import { shareScreen } from "./shareScreen";
import { logData } from "@repo/shared-utils/log-data";

export interface RoomParams {
    roomId: string;
    peerId: string;
}

const rooms: Room[] = [];

export const roomHandler = (socket: Socket, io: SocketIOServer) => {
    socket.on(Signals.CREATE_ROOM, ({ peerName, peerId }) =>
        createRoom({ rooms, socket, peerName, peerId, io })
    );
    socket.on(Signals.ENTER_ROOM, ({ roomId, peerId, peerName }) =>
        enterRoom({ roomId, peerId, peerName, rooms, io, socket })
    );
    socket.on(Signals.LEAVE_ROOM, ({ peerId, roomId }) => {
        // the user clicked to leave the room
        logData({
            title: "User opted out or was kicked out",
            timeStamp: true,
            addSpaceAfter: true,
            layer: "room_ws",
            type: "info",
            data: { peerId, roomId },
        });
        leaveRoom({ roomId, peerId, rooms, io });
    });
    socket.on(Signals.DOES_ROOM_EXISTS, ({ roomId }) =>
        roomExists({ rooms, roomId, io })
    );
    socket.on(Signals.SEND_MESSAGE, ({ roomId, message }) =>
        sendReceiveMessages({ roomId, message, rooms, io })
    );
    socket.on(Signals.PEER_TOGGLED_CAMERA, ({ roomId, peerId, cameraStatus }) =>
        togglePeerCamera({ roomId, peerId, io, cameraStatus })
    );
    socket.on(Signals.SCREEN_SHARING, ({ peerId, status, roomId }) =>
        shareScreen({ peerId, status, rooms, roomId, io })
    );
};
