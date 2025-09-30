import { logData } from "@repo/shared-utils/log-data";
import {
    Signals,
    ToggleCameraWsCallbackParams,
    ToggleCameraWsParams,
} from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";

export interface TogglePeerCameraParams extends ToggleCameraWsParams {
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
