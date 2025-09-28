import { RoomParams } from ".";
import type { Server as SocketIOServer } from "socket.io";
import { Signals, Room } from "@repo/type-definitions/rooms";
import { logData } from "@repo/shared-utils/log-data";

export interface LeaveRoomParams extends RoomParams {
    rooms: Room[];
    io: SocketIOServer;
}

export type LeaveRoom = (params: LeaveRoomParams) => void;

export const leaveRoom: LeaveRoom = ({ peerId, roomId, rooms, io }) => {
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
    io.in(roomId).emit(Signals.GET_PARTICIPANTS, {
        roomId,
        participants: room.participants,
        messages: room.messages,
        peerSharingScreen: room.peerSharingScreen,
    });

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
