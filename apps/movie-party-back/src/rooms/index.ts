import { Socket, Server as SocketIOServer } from "socket.io";
import { ServerRoom, Signals } from "@repo/type-definitions/rooms";
import { createRoom } from "./createRoom";
import { enterRoom } from "./enterRoom";
import { leaveRoom } from "./leaveRoom";
import { roomExists } from "./roomExists";
import { sendReceiveMessages } from "./sendReceiveMessages";
import { togglePeerCamera } from "./togglePeerCamera";
import { shareScreen } from "./shareScreen";
import { logData } from "@repo/shared-utils/log-data";
import { createPoll } from "./createPoll";
import { voteInPoll } from "./voteInPoll";
import { updateBackground } from "./updateBackground";

export interface RoomHandlerParams {
    socket: Socket;
    io: SocketIOServer;
    rooms: ServerRoom[];
}

export type RoomHandler = (params: RoomHandlerParams) => void;

export const roomHandler: RoomHandler = ({ socket, io, rooms }) => {
    socket.on(Signals.CREATE_ROOM, ({ peerName, peerId, password }) =>
        createRoom({ rooms, socket, peerName, peerId, io, password })
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
        leaveRoom({ roomId, peerId, rooms, io, socket });
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
    socket.on(
        Signals.CREATE_POLL,
        ({ roomId, peerId, pollOptions, pollId, title }) =>
            createPoll({
                io,
                rooms,
                roomId,
                peerId,
                pollId,
                pollOptions,
                title,
            })
    );

    socket.on(Signals.VOTE_IN_POLL, ({ roomId, peerId, pollId, optionId }) =>
        voteInPoll({
            roomId,
            peerId,
            rooms,
            io,
            pollId,
            optionId,
        })
    );
    socket.on(Signals.BACKGROUND_UPDATED, ({ roomId, peerId, background }) =>
        updateBackground({ roomId, peerId, background, rooms, io, socket })
    );
};
