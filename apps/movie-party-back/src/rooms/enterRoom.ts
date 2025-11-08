import type { Socket, Server as SocketIOServer } from "socket.io";
import {
    Signals,
    EnterRoomWsParams,
    UpdateParticipantsWsCallback,
    MessageReceivedWsCallbackParams,
    ServerRoom,
} from "@repo/type-definitions/rooms";
import { leaveRoom } from "./leaveRoom";
import { logData } from "@repo/shared-utils/log-data";
import { MessageWithIndex } from "@repo/type-definitions";
import { generateId } from "@repo/shared-utils";
import roomValidation from "../utils/roomValidations";

export interface EnterRoomParams extends EnterRoomWsParams {
    rooms: ServerRoom[];
    socket: Socket;
    io: SocketIOServer;
}

export type EnterRoom = (params: EnterRoomParams) => void;

export const enterRoom: EnterRoom = async ({
    roomId,
    peerId,
    peerName,
    rooms,
    io,
    socket,
}) => {
    const { peerIndex, peerIsParticipant, roomExists, roomIndex, room } =
        roomValidation({
            rooms,
            roomId,
            peerShouldBeParticipant: true,
            peerId,
        });

    if (!room || roomIndex === -1 || !roomExists) {
        socket.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    if (peerIndex === -1 && !peerIsParticipant) {
        room.participants.push({
            id: peerId,
            name: peerName,
        });

        socket.join(roomId);
    }

    logData({
        title: "Emitting get participants",
        layer: "participants_update",
        addSpaceAfter: true,
        timeStamp: true,
        data: {
            room,
            payload: {
                roomId,
                participants: room.participants,
                messages: room.messages,
                peerSharingScreen: room.peerSharingScreen,
            },
        },
        type: "info",
    });
    const getParticipantsCallback: UpdateParticipantsWsCallback = {
        roomId,
        participants: room.participants,
        messages: room.messages,
        peerSharingScreen: room.peerSharingScreen,
        hasCustomBg: room.hasCustomBg,
    };

    const newMessage: MessageWithIndex = {
        peerId,
        peerName,
        id: generateId(),
        index: room.messages.length - 1,
        message: peerName + " se ha unido a la sala de conferencias.",
    };

    rooms[roomIndex].messages.push(newMessage);

    io.in(roomId).emit(Signals.GET_PARTICIPANTS, getParticipantsCallback);
    socket.to(roomId).emit(Signals.NEW_PEER_JOINED, { peerId, peerName });

    const callbackParams: MessageReceivedWsCallbackParams = {
        messageReceived: newMessage,
    };
    io.emit(Signals.MESSAGE_RECEIVED, callbackParams);

    logData({
        title: "User joined the room",
        layer: "participants_update",
        addSpaceAfter: true,
        timeStamp: true,
        data: { roomId, peerId, peerName },
        type: "info",
    });

    socket.on("disconnect", (reason) => {
        // sudden disconnection
        logData({
            title: `${peerName} left the room, reason: ${reason}`,
            addSpaceAfter: true,
            layer: "room_ws",
            timeStamp: true,
            type: "info",
        });
        leaveRoom({ roomId, peerId, rooms, io, socket });
    });
};
