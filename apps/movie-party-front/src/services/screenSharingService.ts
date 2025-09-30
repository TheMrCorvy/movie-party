import { logData } from "@repo/shared-utils/log-data";
import {
    ScreenShareWsCallbackParams,
    ShareScreenWsParams,
    Signals,
} from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";

export interface ScreenShareServiceParams extends ShareScreenWsParams {
    ws: Socket | null;
    callback: (params: ScreenShareWsCallbackParams) => void;
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

    const shareScreenParams: ShareScreenWsParams = { roomId, peerId, status };

    ws.emit(Signals.SCREEN_SHARING, shareScreenParams);
    ws.on(Signals.SCREEN_SHARING, callback);

    return () => {
        ws.off(Signals.SCREEN_SHARING);
    };
};
