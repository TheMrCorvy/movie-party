import { Signals } from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";

export interface ScreenShareServiceCallbackParams {
    peerId: string;
    status: boolean;
}

export interface ScreenShareServiceParams {
    roomId: string;
    peerId: string;
    status: boolean;
    ws: Socket | null;
    callback: (params: ScreenShareServiceCallbackParams) => void;
}

export type ScreenShareServcie = (
    params: ScreenShareServiceParams
) => () => void;

export const screenShareServcie: ScreenShareServcie = ({
    roomId,
    ws,
    callback,
    status,
    peerId,
}) => {
    if (!ws) {
        return () => {
            console.log("Nothing to unmount.");
        };
    }

    ws.emit(Signals.SCREEN_SHARING, { roomId, peerId, status });
    ws.on(Signals.SCREEN_SHARING, callback);

    return () => {
        ws.off(Signals.SCREEN_SHARING);
    };
};
