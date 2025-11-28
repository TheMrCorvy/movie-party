import { stringIsEmpty } from "@repo/shared-utils";
import { logData } from "@repo/shared-utils/log-data";
import {
    Signals,
    ToggleCameraWsCallbackParams,
    ToggleCameraWsParams,
    ToggleMicrophoneWsParams,
    ToggleMicrophoneWsCallbackParams,
} from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";

export interface EmitToggleCameraParams extends ToggleCameraWsParams {
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

    logData({
        type: "info",
        title: "Emitting toggle camera event",
        timeStamp: true,
        layer: "room_ws",
        data: {
            roomId,
            peerId,
            cameraStatus,
        },
    });

    const toggleCameraParams: ToggleCameraWsParams = {
        roomId,
        peerId,
        cameraStatus,
    };

    ws.emit(Signals.PEER_TOGGLED_CAMERA, toggleCameraParams);
};

export interface EmitToggleMicrophoneParams extends ToggleMicrophoneWsParams {
    ws: Socket | null;
}

export type EmitToggleMicrophone = (params: EmitToggleMicrophoneParams) => void;

export const emitToggleMicrophone: EmitToggleMicrophone = ({
    roomId,
    peerId,
    microphoneStatus,
    ws,
}) => {
    if (!ws || stringIsEmpty(roomId) || stringIsEmpty(peerId)) {
        return;
    }

    logData({
        type: "info",
        title: "Emitting toggle microphone event",
        timeStamp: true,
        layer: "room_ws",
        data: {
            roomId,
            peerId,
            microphoneStatus,
        },
    });

    const toggleMicrophoneParams: ToggleMicrophoneWsParams = {
        roomId,
        peerId,
        microphoneStatus,
    };

    ws.emit(Signals.PEER_TOGGLED_MICROPHONE, toggleMicrophoneParams);
};

export interface ListenPeerToggledCameraParams {
    ws: Socket | null;
    callback: (params: ToggleCameraWsCallbackParams) => void;
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
            logData({
                title: "Nothing to unmount",
                type: "warn",
                data: {
                    message:
                        "Something during the setup of the events went wrong...",
                },
                layer: "room_ws",
                timeStamp: true,
            });
        };
    }

    ws.on(Signals.PEER_TOGGLED_CAMERA, callback);

    return () => {
        ws.off(Signals.PEER_TOGGLED_CAMERA);
    };
};

export interface ListenPeerToggledMicrophoneParams {
    ws: Socket | null;
    callback: (params: ToggleMicrophoneWsCallbackParams) => void;
}

export type ListenPeerToggledMicrophone = (
    params: ListenPeerToggledMicrophoneParams
) => () => void;

export const listenPeerToggledMicrophone: ListenPeerToggledMicrophone = ({
    ws,
    callback,
}) => {
    if (!ws) {
        return () => {
            logData({
                title: "Nothing to unmount",
                type: "warn",
                data: {
                    message:
                        "Something during the setup of microphone events went wrong...",
                },
                layer: "room_ws",
                timeStamp: true,
            });
        };
    }

    ws.on(Signals.PEER_TOGGLED_MICROPHONE, callback);

    return () => {
        ws.off(Signals.PEER_TOGGLED_MICROPHONE);
    };
};
