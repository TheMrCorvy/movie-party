import { RoomParams } from ".";
import type { Socket, Server as SocketIOServer } from "socket.io";
import { Signals } from "@repo/type-definitions/rooms";

export interface StartSharingParams extends RoomParams {
    socket: Socket;
    io: SocketIOServer;
}

export type StartSharing = (params: StartSharingParams) => void;

export const startSharing: StartSharing = ({ roomId, peerId, io }) => {
    io.in(roomId).emit(Signals.STARTED_SHARING, { peerId });
    console.log("user started sharing: ", peerId);
};

export interface StopSharingParams extends RoomParams {
    io: SocketIOServer;
}

export type StopSharing = (params: StopSharingParams) => void;
export const stopSharing: StopSharing = ({ roomId, peerId, io }) => {
    io.in(roomId).emit(Signals.STOPPED_SHARING, { peerId });
    console.log("user stopped sharing: ", peerId);
};
