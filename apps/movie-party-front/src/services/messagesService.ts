import { stringIsEmpty } from "@repo/shared-utils";
import { logData } from "@repo/shared-utils/log-data";
import { Message, MessageWithIndex } from "@repo/type-definitions";
import { Signals } from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";

export interface SendMessageServiceParams {
    ws: Socket | null;
    message: Message;
    roomId: string;
}

export type SendMessageService = (params: SendMessageServiceParams) => void;

export const sendMessageService: SendMessageService = ({
    message,
    ws,
    roomId,
}) => {
    if (!ws) {
        logData({
            title: "Couldn't send message. Websocket not found",
            type: "warn",
            data: {
                message,
                ws,
                roomId,
            },
            layer: "messages",
            timeStamp: true,
        });
        return;
    }

    if (
        stringIsEmpty(roomId) ||
        stringIsEmpty(message.id) ||
        stringIsEmpty(message.message) ||
        stringIsEmpty(message.peerId) ||
        stringIsEmpty(message.peerName)
    ) {
        logData({
            title: "Couldn't send empty message",
            type: "error",
            data: {
                message,
                ws,
                roomId,
            },
            layer: "messages",
            timeStamp: true,
        });
    }

    ws.emit(Signals.SEND_MESSAGE, { message, roomId });
};

export interface MessageReceivedServiceParams {
    ws: Socket | null;
    callback: MessageReceivedCallback;
}

export interface MessageReceivedCallbackParams {
    messageReceived: MessageWithIndex;
}

export type MessageReceivedCallback = (
    params: MessageReceivedCallbackParams
) => void;

export type MessageReceivedService = (
    params: MessageReceivedServiceParams
) => () => void;

export const messageReceivedService: MessageReceivedService = ({
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

    ws.on(Signals.MESSAGE_RECEIVED, callback);

    return () => {
        ws.off(Signals.MESSAGE_RECEIVED);
    };
};
