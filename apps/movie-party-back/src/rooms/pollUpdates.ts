import { stringIsEmpty } from "@repo/shared-utils";
import { logData } from "@repo/shared-utils/log-data";
import { MessageWithIndex, Poll } from "@repo/type-definitions";
import {
    CreatePollWsParams,
    MessageReceivedWsCallbackParams,
    Room,
    Signals,
} from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";

export interface CreatePollParams extends CreatePollWsParams {
    rooms: Room[];
    io: SocketIOServer;
}

export type CreatePoll = (params: CreatePollParams) => void;

export const createPoll: CreatePoll = ({
    roomId,
    peerId,
    pollId,
    pollOptions,
    rooms,
    io,
}) => {
    const roomIndex = rooms.findIndex((r) => r.id === roomId);

    if (roomIndex === -1 || !rooms[roomIndex]) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    if (!peerId || !pollId || stringIsEmpty(peerId) || stringIsEmpty(pollId)) {
        io.emit(Signals.ERROR, {
            message: "Some data was corrupted or empty.",
        });

        logData({
            type: "error",
            layer: "poll",
            addSpaceAfter: true,
            timeStamp: true,
            title: "Some data was corrupted or empty",
            data: {
                peerId,
                pollId,
            },
        });

        return;
    }

    const peer = rooms[roomIndex].participants.find((p) => p.id === peerId);

    if (!peer) {
        io.emit(Signals.ERROR, { message: "The peer is not in the room." });
        logData({
            type: "error",
            timeStamp: true,
            addSpaceAfter: true,
            title: "Someone tried to create a Poll without being in the room",
            data: {
                room: rooms[roomIndex],
                peerId,
                peer,
            },
            layer: "poll",
        });
        return;
    }

    const pollAlreadyInProcess = rooms[roomIndex].messages.find(
        (po) => po.id === pollId
    );

    if (
        pollAlreadyInProcess &&
        pollAlreadyInProcess.isPoll &&
        pollAlreadyInProcess.poll?.status === "live"
    ) {
        logData({
            title: "Cannot create another poll until last one is finished",
            type: "warn",
            layer: "poll",
            data: pollAlreadyInProcess,
            addSpaceAfter: true,
            timeStamp: true,
        });

        io.emit(Signals.ERROR, {
            message: "Another poll is already taking place.",
        });

        return;
    }

    logData({
        timeStamp: true,
        addSpaceAfter: true,
        title: "Received request to create a poll",
        layer: "poll",
        type: "info",
        data: {
            roomId,
            peerId,
            pollId,
            pollOptions,
        },
    });

    const poll: Poll = {
        id: pollId,
        options: pollOptions,
        amountOfVotes: 0,
        status: "live",
    };

    const pollMessage: MessageWithIndex = {
        id: pollId,
        message: "Poll created",
        peerId,
        peerName: peer.name,
        index: rooms[roomIndex].messages.length - 1,
        isPoll: true,
        poll,
    };

    rooms[roomIndex].messages.push(pollMessage);

    const callbackParams: MessageReceivedWsCallbackParams = {
        messageReceived: pollMessage,
    };

    io.emit(Signals.MESSAGE_RECEIVED, callbackParams);
};
