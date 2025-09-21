import { RoomParams, Rooms } from ".";
import { Socket } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";

export interface LeaveRoomParams extends RoomParams {
    rooms: Rooms;
    socket: Socket;
}

export type LeaveRoom = (params: LeaveRoomParams) => void;

export const leaveRoom: LeaveRoom = ({ peerId, roomId, rooms, socket }) => {
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

    socket.to(roomId).emit(Signals.USER_LEFT, peerId);
};
