import { stringIsEmpty } from "@repo/shared-utils";
import { logData } from "@repo/shared-utils/log-data";
import {
    CreatePollWsParams,
    PollUpdatedWsParams,
    Signals,
} from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";

export interface CreatePollServiceParams extends CreatePollWsParams {
    ws: Socket | null;
}

export type CreatePollService = (params: CreatePollServiceParams) => void;

export const createPollSerice: CreatePollService = ({
    ws,
    roomId,
    peerId,
    pollOptions,
    pollId,
    title,
}) => {
    if (!ws) {
        logData({
            title: "Couldn't create the poll. Websocket not found",
            type: "warn",
            data: {
                pollOptions,
                ws,
                roomId,
                peerId,
            },
            layer: "poll",
            timeStamp: true,
        });
        return;
    }

    if (
        stringIsEmpty(roomId) ||
        stringIsEmpty(peerId) ||
        stringIsEmpty(title)
    ) {
        logData({
            title: "Couldn't create the poll. Data provided was incomplete",
            type: "error",
            data: {
                pollOptions,
                roomId,
                peerId,
            },
            layer: "poll",
            timeStamp: true,
        });
        return;
    }

    ws.emit(Signals.CREATE_POLL, {
        roomId,
        peerId,
        pollOptions,
        pollId,
        title,
    });
};

export interface ListenPollUpdateServiceParams {
    ws: Socket | null;
    callback: (params: PollUpdatedWsParams) => void;
}

export type ListenPollUpdateService = (
    params: ListenPollUpdateServiceParams
) => () => void;

export const listenPollUpdateService: ListenPollUpdateService = ({
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

    ws.on(Signals.POLL_UPDATED, callback);

    return () => {
        ws.off(Signals.POLL_UPDATED);
    };
};

export interface VoteInPollServiceParams {
    peerId: string;
    roomId: string;
    pollOptionId: string;
    pollId: string;
    ws: Socket | null;
}

export type VoteInPollService = (params: VoteInPollServiceParams) => void;

export const voteInPollService: VoteInPollService = ({
    ws,
    peerId,
    roomId,
    pollOptionId,
    pollId,
}) => {
    if (!ws) {
        logData({
            title: "Couldn't send your vote to the poll. Websocket not found",
            type: "warn",
            data: {
                pollOptionId,
                ws,
                roomId,
                peerId,
                pollId,
            },
            layer: "poll",
            timeStamp: true,
        });
        return;
    }

    if (stringIsEmpty(roomId) || stringIsEmpty(peerId)) {
        logData({
            title: "Couldn't send your vote to the poll. Data provided was incomplete",
            type: "error",
            data: {
                pollOptionId,
                roomId,
                peerId,
                pollId,
            },
            layer: "poll",
            timeStamp: true,
        });
        return;
    }

    ws.emit(Signals.VOTE_IN_POLL, { roomId, peerId, pollOptionId, pollId });
};
