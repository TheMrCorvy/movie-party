import type { Socket, Server as SocketIOServer } from "socket.io";
import {
    Signals,
    Room,
    LeaveRoomWsParams,
    UpdateParticipantsWsCallback,
    PollUpdatedWsParams,
    MessageReceivedWsCallbackParams,
} from "@repo/type-definitions/rooms";
import { logData } from "@repo/shared-utils/log-data";
import { MessageWithIndex, Poll } from "@repo/type-definitions";
import { generateId } from "@repo/shared-utils";

export interface LeaveRoomParams extends LeaveRoomWsParams {
    rooms: Room[];
    io: SocketIOServer;
    socket: Socket;
}

export type LeaveRoom = (params: LeaveRoomParams) => void;

export const leaveRoom: LeaveRoom = ({ peerId, roomId, rooms, io, socket }) => {
    const room = rooms.find((room) => room.id === room.id);
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    if (!room || roomIndex === -1) {
        logData({
            title: "User tryed to leave from a non existing room",
            type: "error",
            layer: "*",
            data: {
                room,
                params: {
                    peerId,
                    roomId,
                    rooms,
                },
            },
            addSpaceAfter: true,
            timeStamp: true,
        });
        return;
    }

    const peerName =
        room.participants.find((peer) => peer.id === peerId)?.name || "Mr. X";

    room.participants = room.participants.filter(
        (participant) => participant.id !== peerId
    );

    if (room?.participants.length === 0) {
        rooms = rooms.filter((room) => room.id !== roomId);
        logData({
            title: "Deleted empty room",
            layer: "room_ws",
            type: "info",
            timeStamp: true,
            addSpaceAfter: true,
            data: {
                roomId,
                peerId,
            },
        });
        return;
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
    };
    io.in(roomId).emit(Signals.GET_PARTICIPANTS, getParticipantsCallback);

    const newMessage: MessageWithIndex = {
        peerId,
        peerName,
        id: generateId(),
        index: room.messages.length - 1,
        message: peerName + " ha abandonado la sala de conferencias.",
    };

    rooms[roomIndex].messages.push(newMessage);
    const callbackParams: MessageReceivedWsCallbackParams = {
        messageReceived: newMessage,
    };

    io.emit(Signals.MESSAGE_RECEIVED, callbackParams);

    logData({
        title: "User left",
        addSpaceAfter: true,
        layer: "room_ws",
        timeStamp: true,
        type: "info",
        data: {
            roomId,
            peerId,
        },
    });

    let emitPollUpdate = false;
    let updatedPoll: Poll | undefined = undefined;

    room.messages.map((message, i) => {
        if (
            message.isPoll &&
            message.poll &&
            message.poll.status === "live" &&
            message.poll.amountOfVotes >= room.participants.length
        ) {
            const newMessage = {
                ...message,
                poll: {
                    ...message.poll,
                    status: "ended",
                },
            };
            emitPollUpdate = true;
            updatedPoll = newMessage.poll as Poll;
            room.messages[i] = newMessage as MessageWithIndex;
        }
    });

    if (emitPollUpdate && updatedPoll) {
        io.in(roomId).emit(Signals.POLL_UPDATED, {
            poll: updatedPoll,
        } as PollUpdatedWsParams);
    }

    socket.leave(roomId);
};
