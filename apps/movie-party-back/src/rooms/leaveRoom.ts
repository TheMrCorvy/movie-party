import { RoomParams } from ".";
import type { Server as SocketIOServer } from "socket.io";
import { Signals, Room } from "@repo/type-definitions/rooms";

export interface LeaveRoomParams extends RoomParams {
    rooms: Room[];
    io: SocketIOServer;
}

export type LeaveRoom = (params: LeaveRoomParams) => void;

export const leaveRoom: LeaveRoom = ({ peerId, roomId, rooms, io }) => {
    const room = rooms.find((room) => room.id === room.id);
    if (!room) {
        console.log("User tryed to leave from a non existing room.");
        return;
    }

    room.participants = room.participants.filter(
        (participant) => participant.id !== peerId
    );

    if (room?.participants.length === 0) {
        rooms = rooms.filter((room) => room.id !== roomId);
        console.log("room deleted: ", roomId);
        return;
    }

    console.log("Emitting get participants...");
    io.in(roomId).emit(Signals.GET_PARTICIPANTS, {
        roomId,
        participants: room.participants,
    });
    console.log("User left: ", peerId);
    console.log("New room: ", room);
};
