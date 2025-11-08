import { logData } from "@repo/shared-utils/log-data";
import { MessageWithIndex, Poll } from "@repo/type-definitions";
import {
    CreatePollWsParams,
    MessageReceivedWsCallbackParams,
    ServerRoom,
    Signals,
} from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";
import roomValidation from "../utils/roomValidations";

export interface CreatePollParams extends CreatePollWsParams {
    rooms: ServerRoom[];
    io: SocketIOServer;
}

export type CreatePoll = (params: CreatePollParams) => void;

export const createPoll: CreatePoll = ({
    roomId,
    peerId,
    pollId,
    pollOptions,
    rooms,
    title,
    io,
}) => {
    const { roomIndex, roomExists, room, peerIsParticipant, peer } =
        roomValidation({
            roomId,
            rooms,
            peerShouldBeParticipant: true,
            peerId,
        });

    if (roomIndex === -1 || !room || !roomExists) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    if (!peer || !peerIsParticipant) {
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
        title,
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
