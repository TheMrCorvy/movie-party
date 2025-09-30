import { CreateRoomWsParams, Room } from "@repo/type-definitions/rooms";
import { Socket, Server as SocketIOServer } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";
import { leaveRoom } from "./leaveRoom";
import { generateId } from "@repo/shared-utils";
import { logData } from "@repo/shared-utils/log-data";

export interface CreateRoomParams extends CreateRoomWsParams {
    rooms: Room[];
    socket: Socket;
    io: SocketIOServer;
}

export type CreateRoom = (params: CreateRoomParams) => void;

export const createRoom: CreateRoom = ({
    rooms,
    socket,
    peerId,
    peerName,
    io,
    password,
}) => {
    const roomId = generateId();
    const room: Room = {
        id: roomId,
        messages: [],
        participants: [
            {
                id: peerId,
                name: peerName,
            },
        ],
        peerSharingScreen: "",
    };
    rooms.push(room);

    socket.join(roomId);
    socket.emit(Signals.ROOM_CREATED, { room });
    // console.log("user created a room", room);
    logData({
        title: "A user created a room",
        layer: "room_ws",
        addSpaceAfter: true,
        timeStamp: true,
        type: "info",
        data: {
            room,
            peer: {
                peerId,
                peerName,
            },
        },
    });

    socket.on("disconnect", (reason) => {
        // sudden disconnection
        logData({
            title: `${peerName} left the room, reason: ${reason}`,
            addSpaceAfter: true,
            layer: "room_ws",
            timeStamp: true,
            type: "info",
        });
        leaveRoom({ roomId, peerId, rooms, io, socket });
    });
};
