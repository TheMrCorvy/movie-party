import {
    CreateRoomWsParams,
    Room,
    RoomCreatedWsCallbackParams,
} from "@repo/type-definitions/rooms";
import { Socket, Server as SocketIOServer } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";
import { leaveRoom } from "./leaveRoom";
import { generateId } from "@repo/shared-utils";
import { logData } from "@repo/shared-utils/log-data";
import { hashPassword } from "../utils/passwordVerification";

export interface CreateRoomParams extends CreateRoomWsParams {
    rooms: Room[];
    socket: Socket;
    io: SocketIOServer;
}

export type CreateRoom = (params: CreateRoomParams) => void;

export const createRoom: CreateRoom = async ({
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

    rooms.push({
        ...room,
        password: password ? await hashPassword(password) : undefined,
    });

    socket.join(roomId);

    const roomCreatedCallbackParams: RoomCreatedWsCallbackParams = {
        room,
    };

    socket.emit(Signals.ROOM_CREATED, roomCreatedCallbackParams);
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
