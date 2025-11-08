import { stringIsEmpty } from "@repo/shared-utils";
import { logData } from "@repo/shared-utils/log-data";
import { Poll, PollOption } from "@repo/type-definitions";
import {
    PollUpdatedWsParams,
    ServerRoom,
    Signals,
    VoteWsParams,
} from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";
import roomValidation from "../utils/roomValidations";

export interface VoteInPollParams extends VoteWsParams {
    rooms: ServerRoom[];
    io: SocketIOServer;
}

export type VoteInPoll = (params: VoteInPollParams) => void;

export const voteInPoll: VoteInPoll = ({
    roomId,
    peerId,
    rooms,
    io,
    pollId,
    optionId,
}) => {
    const { roomIndex, roomExists, peer, room } = roomValidation({
        rooms,
        roomId,
        peerShouldBeParticipant: true,
        peerId,
    });

    if (roomIndex === -1 || !roomExists || !room) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    if (
        !peerId ||
        !pollId ||
        stringIsEmpty(peerId) ||
        stringIsEmpty(pollId) ||
        stringIsEmpty(optionId)
    ) {
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

    if (!peer) {
        io.emit(Signals.ERROR, { message: "The peer is not in the room." });
        logData({
            type: "error",
            timeStamp: true,
            addSpaceAfter: true,
            title: "Someone tried to create a Poll without being in the room",
            data: {
                room: room,
                peerId,
                peer,
            },
            layer: "poll",
        });
        return;
    }

    const pollIndex = room.messages.findIndex(
        (po) => po.id === pollId && po.isPoll && po.poll?.status === "live"
    );

    if (pollIndex === -1) {
        logData({
            title: "The poll is already finished or doesn't exists",
            type: "warn",
            layer: "poll",
            data: { pollIndex },
            addSpaceAfter: true,
            timeStamp: true,
        });

        io.emit(Signals.ERROR, {
            message: "The poll is already finished or doesn't exists.",
        });

        return;
    }

    const option = room.messages[pollIndex].poll?.options.find(
        (op) => op.id === optionId
    );

    if (!option || typeof option === "undefined") {
        logData({
            title: "Option the user is trying to vote for doesn't exists",
            type: "warn",
            layer: "poll",
            data: { pollIndex },
            addSpaceAfter: true,
            timeStamp: true,
        });

        io.emit(Signals.ERROR, {
            message: "The option doesn't exists.",
        });

        return;
    }

    logData({
        timeStamp: true,
        addSpaceAfter: true,
        title: "Voting for option " + option.title,
        layer: "poll",
        type: "info",
        data: option,
    });

    const poll = room.messages[pollIndex].poll as Poll;
    poll.amountOfVotes++;
    (poll.options.find((po) => po.id === optionId) as PollOption).votes++;

    if (room.participants.length <= poll.amountOfVotes) {
        poll.status = "ended";
    }

    io.emit(Signals.POLL_UPDATED, { poll } as PollUpdatedWsParams);
};
