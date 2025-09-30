import type { Socket, Server as SocketIOServer } from "socket.io";
import {
    Signals,
    Room,
    LeaveRoomWsParams,
    UpdateParticipantsWsCallback,
} from "@repo/type-definitions/rooms";
import { logData } from "@repo/shared-utils/log-data";

export interface LeaveRoomParams extends LeaveRoomWsParams {
    rooms: Room[];
    io: SocketIOServer;
    socket: Socket;
}

export type LeaveRoom = (params: LeaveRoomParams) => void;

export const leaveRoom: LeaveRoom = ({ peerId, roomId, rooms, io, socket }) => {
    const room = rooms.find((room) => room.id === room.id);
    if (!room) {
        logData({
            title: "User tryed to leave from a non existing room",
            type: "error",
            layer: "*",
            data: {
                room,
                params: {
                    peerId,
                    roomId,
                    rooms,
                },
            },
            addSpaceAfter: true,
            timeStamp: true,
        });
        return;
    }

    room.participants = room.participants.filter(
        (participant) => participant.id !== peerId
    );

    if (room?.participants.length === 0) {
        rooms = rooms.filter((room) => room.id !== roomId);
        logData({
            title: "Deleted empty room",
            layer: "room_ws",
            type: "info",
            timeStamp: true,
            addSpaceAfter: true,
            data: {
                roomId,
                peerId,
            },
        });
        return;
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
    const getParticipantsCallback: UpdateParticipantsWsCallback = {
        roomId,
        participants: room.participants,
        messages: room.messages,
        peerSharingScreen: room.peerSharingScreen,
    };
    io.in(roomId).emit(Signals.GET_PARTICIPANTS, getParticipantsCallback);

    socket.leave(roomId);

    logData({
        title: "User left",
        addSpaceAfter: true,
        layer: "room_ws",
        timeStamp: true,
        type: "info",
        data: {
            roomId,
            peerId,
        },
    });
};
