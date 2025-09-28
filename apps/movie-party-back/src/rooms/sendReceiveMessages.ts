import { logData } from "@repo/shared-utils/log-data";
import { Message, MessageWithIndex } from "@repo/type-definitions";
import { Room, Signals } from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";

export interface SendReceiveMessagesParams {
    roomId: string;
    rooms: Room[];
    message: Message;
    io: SocketIOServer;
}

export type SendReceiveMessages = (params: SendReceiveMessagesParams) => void;

export const sendReceiveMessages: SendReceiveMessages = ({
    roomId,
    rooms,
    message,
    io,
}) => {
    const room = rooms.find((r) => r.id === roomId);

    if (!room) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    const messageReceived: MessageWithIndex = {
        ...message,
        index: room.messages.length - 1,
    };

    logData({
        timeStamp: true,
        addSpaceAfter: true,
        title: "Received message",
        layer: "messages",
        type: "info",
        data: messageReceived,
    });

    room.messages.push(messageReceived);

    io.emit(Signals.MESSAGE_RECEIVED, { messageReceived });
};
