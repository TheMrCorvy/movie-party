import { stringIsEmpty } from "@repo/shared-utils";
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
        console.error("Couldn't send message. Websocket not found...");
        return;
    }

    if (
        stringIsEmpty(roomId) ||
        stringIsEmpty(message.id) ||
        stringIsEmpty(message.message) ||
        stringIsEmpty(message.peerId) ||
        stringIsEmpty(message.peerName)
    ) {
        console.error("Couldn't send empty message...");
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
            console.log("Nothing to unmount.");
        };
    }

    ws.on(Signals.MESSAGE_RECEIVED, callback);

    return () => {
        ws.off(Signals.MESSAGE_RECEIVED);
    };
};
