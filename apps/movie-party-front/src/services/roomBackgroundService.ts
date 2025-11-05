import {
    RoomBackground,
    Signals,
    BackgroundUpdatedWsParams,
    BackgroundUpdatedWsCallbackParams,
} from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";
import { logData } from "@repo/shared-utils/log-data";
import { PatternClass } from "@repo/type-definitions";

interface UploadBackgroundParams {
    file: File;
    roomId: string;
    peerId: string;
}

interface UploadBackgroundResponse {
    message: string;
    background: RoomBackground;
}

export const uploadRoomBackground = async ({
    file,
    roomId,
    peerId,
}: UploadBackgroundParams): Promise<UploadBackgroundResponse> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("roomId", roomId);
    formData.append("peerId", peerId);

    const response = await fetch("http://localhost:4000/room-background", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al subir la imagen");
    }

    return response.json();
};

interface SendBackgroundPatternParams {
    ws: Socket | null;
    roomId: string;
    peerId: string;
    pattern: PatternClass;
}

export const sendBackgroundPattern = ({
    ws,
    roomId,
    peerId,
    pattern,
}: SendBackgroundPatternParams) => {
    if (!ws) {
        logData({
            title: "Couldn't update background. WebSocket not found",
            type: "warn",
            data: {
                roomId,
                peerId,
                pattern,
            },
            layer: "room_ws",
            timeStamp: true,
        });
        return;
    }

    if (!Object.values(PatternClass).includes(pattern)) {
        logData({
            title: "Invalid pattern class provided",
            type: "error",
            data: { pattern, validPatterns: PatternClass },
            layer: "room_ws",
            timeStamp: true,
        });
        return;
    }

    const background: RoomBackground = {
        isCssPattern: true,
        src: pattern,
    };

    const params: BackgroundUpdatedWsParams = {
        roomId,
        peerId,
        background,
    };

    ws.emit(Signals.BACKGROUND_UPDATED, params);
};

interface ListenBackgroundUpdatesParams {
    ws: Socket | null;
    callback: (params: BackgroundUpdatedWsCallbackParams) => void;
}

export const listenBackgroundUpdates = ({
    ws,
    callback,
}: ListenBackgroundUpdatesParams) => {
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

    ws.on(Signals.BACKGROUND_UPDATED, callback);

    return () => {
        ws.off(Signals.BACKGROUND_UPDATED);
    };
};
