import { stringIsEmpty } from "@repo/shared-utils";
import { Signals } from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";

export interface EmitToggleCameraParams {
    roomId: string;
    peerId: string;
    cameraStatus: boolean;
    ws: Socket | null;
}

export type EmitToggleCamera = (params: EmitToggleCameraParams) => void;

export const emitToggleCamera: EmitToggleCamera = ({
    roomId,
    peerId,
    cameraStatus,
    ws,
}) => {
    if (!ws || stringIsEmpty(roomId) || stringIsEmpty(peerId)) {
        return;
    }

    ws.emit(Signals.PEER_TOGGLED_CAMERA, { roomId, peerId, cameraStatus });
};

export interface ListenPeerToggledCameraParams {
    ws: Socket | null;
    callback: (params: ListenPeerToggledCameraCallbackParams) => void;
}

export interface ListenPeerToggledCameraCallbackParams {
    peerId: string;
}

export type ListenPeerToggledCamera = (
    params: ListenPeerToggledCameraParams
) => () => void;

export const listenPeerToggledCamera: ListenPeerToggledCamera = ({
    ws,
    callback,
}) => {
    if (!ws) {
        return () => {
            console.log("Nothing to unmount.");
        };
    }

    ws.on(Signals.PEER_TOGGLED_CAMERA, callback);

    return () => {
        ws.off(Signals.PEER_TOGGLED_CAMERA);
    };
};
