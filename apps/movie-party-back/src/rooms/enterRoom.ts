import type { Socket, Server as SocketIOServer } from "socket.io";
import { Signals, Room, EnterRoomWsParams } from "@repo/type-definitions/rooms";
import { leaveRoom } from "./leaveRoom";
import { logData } from "@repo/shared-utils/log-data";

export interface EnterRoomParams extends EnterRoomWsParams {
    rooms: Room[];
    socket: Socket;
    io: SocketIOServer;
}

export type EnterRoom = (params: EnterRoomParams) => void;

export const enterRoom: EnterRoom = ({
    roomId,
    peerId,
    peerName,
    rooms,
    io,
    socket,
    password,
}) => {
    const room = rooms.find((room) => room.id === roomId);
    if (!room) {
        socket.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    const participantIndex = room.participants.findIndex(
        (participant) => participant.id === peerId
    );

    if (participantIndex === -1) {
        room.participants.push({
            id: peerId,
            name: peerName,
        });

        socket.join(roomId);
    }

    logData({
        title: "Emitting get participants",
        layer: "participants_update",
        addSpaceAfter: true,
        timeStamp: true,
        data: {
            room,
            payload: {
                roomId,
                participants: room.participants,
                messages: room.messages,
                peerSharingScreen: room.peerSharingScreen,
            },
        },
        type: "info",
    });
    io.in(roomId).emit(Signals.GET_PARTICIPANTS, {
        roomId,
        participants: room.participants,
        messages: room.messages,
        peerSharingScreen: room.peerSharingScreen,
    });

    socket.to(roomId).emit(Signals.NEW_PEER_JOINED, { peerId, peerName });

    logData({
        title: "User joined the room",
        layer: "participants_update",
        addSpaceAfter: true,
        timeStamp: true,
        data: { roomId, peerId, peerName },
        type: "info",
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
