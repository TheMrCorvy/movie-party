import { RoomParams } from ".";
import type { Server as SocketIOServer } from "socket.io";
import { Signals, Rooms } from "@repo/type-definitions/rooms";

export interface LeaveRoomParams extends RoomParams {
    rooms: Rooms;
    io: SocketIOServer;
}

export type LeaveRoom = (params: LeaveRoomParams) => void;

export const leaveRoom: LeaveRoom = ({ peerId, roomId, rooms, io }) => {
    if (!rooms[roomId]) {
        console.log("User tryed to leave from a non existing room.");
        return;
    }

    rooms[roomId].participants = rooms[roomId].participants.filter(
        (participant) => participant.id !== peerId
    );

    if (rooms[roomId]?.participants.length === 0) {
        delete rooms[roomId];
        console.log("room deleted: ", roomId);
        return;
    }

    io.in(roomId).emit(Signals.GET_PARTICIPANTS, {
        roomId,
        participants: rooms[roomId].participants,
    });
};
