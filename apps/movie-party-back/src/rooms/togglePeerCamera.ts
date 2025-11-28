import { logData } from "@repo/shared-utils/log-data";
import {
    ServerRoom,
    Signals,
    ToggleCameraWsCallbackParams,
    ToggleCameraWsParams,
} from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";
import roomValidation from "../utils/roomValidations";

export interface TogglePeerCameraParams extends ToggleCameraWsParams {
    io: SocketIOServer;
    rooms: ServerRoom[];
}

export type TogglePeerCamera = (params: TogglePeerCameraParams) => void;

export const togglePeerCamera: TogglePeerCamera = ({
    roomId,
    peerId,
    cameraStatus,
    io,
    rooms,
}) => {
    if (!roomId) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    const { room, roomIndex, roomExists, peerIsParticipant, peer } =
        roomValidation({
            rooms,
            roomId,
            peerId,
            peerShouldBeParticipant: true,
        });

    if (!room || roomIndex === -1 || !roomExists) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    if (!peer || !peerIsParticipant) {
        io.emit(Signals.ERROR);
        return;
    }

    logData({
        title: "Peer toggled camera",
        type: "info",
        timeStamp: true,
        addSpaceAfter: true,
        layer: "camera",
        data: { peerId, cameraStatus },
    });

    const callbackParams: ToggleCameraWsCallbackParams = {
        peerId,
        cameraStatus,
    };

    io.emit(Signals.PEER_TOGGLED_CAMERA, callbackParams);
};
