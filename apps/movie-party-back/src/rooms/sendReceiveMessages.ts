import { logData } from "@repo/shared-utils/log-data";
import { MessageWithIndex } from "@repo/type-definitions";
import {
    MessageReceivedWsCallbackParams,
    MessagesWsParams,
    ServerRoom,
    Signals,
} from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";
import roomValidation from "../utils/roomValidations";

export interface SendReceiveMessagesParams extends MessagesWsParams {
    rooms: ServerRoom[];
    io: SocketIOServer;
}

export type SendReceiveMessages = (params: SendReceiveMessagesParams) => void;

export const sendReceiveMessages: SendReceiveMessages = ({
    roomId,
    rooms,
    message,
    io,
}) => {
    const { room, roomIndex, roomExists, peerIsParticipant } = roomValidation({
        rooms,
        roomId,
        peerId: message.peerId,
        peerShouldBeParticipant: true,
    });

    if (!room || !roomExists || roomIndex === -1 || !peerIsParticipant) {
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

    rooms[roomIndex].messages.push(messageReceived);
    const callbackParams: MessageReceivedWsCallbackParams = { messageReceived };
    io.emit(Signals.MESSAGE_RECEIVED, callbackParams);
};
