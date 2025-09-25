import { Signals } from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";

export interface TogglePeerCameraParams {
    roomId: string;
    peerId: string;
    cameraStatus: boolean;
    io: SocketIOServer;
}

export type TogglePeerCamera = (params: TogglePeerCameraParams) => void;

export const togglePeerCamera: TogglePeerCamera = ({
    roomId,
    peerId,
    cameraStatus,
    io,
}) => {
    if (!roomId) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    io.emit(Signals.PEER_TOGGLED_CAMERA, { peerId, cameraStatus });
};
