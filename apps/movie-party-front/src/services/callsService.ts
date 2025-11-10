import { logData } from "@repo/shared-utils/log-data";
import { Participant } from "@repo/type-definitions";
import Peer, { MediaConnection } from "peerjs";

export type StreamType = "camera" | "screen";

export interface StartCallParams {
    me: Peer;
    otherParticipants: Participant[];
    callback: (params: StartCallCallbackParams) => void;
    errorCallback: (message: string) => void;
    stream: MediaStream;
    streamType: StreamType;
}

export interface StartCallCallbackParams {
    peerId: string;
    stream: MediaStream | null;
}

export type StartCall = (params: StartCallParams) => void;

export const startCall: StartCall = ({
    otherParticipants,
    me,
    stream,
    callback,
    streamType = "camera",
    errorCallback,
}) => {
    logData({
        title: "Starting call to everyone else in the room",
        type: "info",
        layer: "camera_caller",
        timeStamp: true,
        data: {
            otherParticipants,
            me,
            stream,
            streamType,
        },
    });
    otherParticipants.forEach((participant) => {
        try {
            const call = me.call(participant.id, stream as MediaStream, {
                metadata: {
                    peerId: me.id,
                    streamType,
                },
            });

            if (!call) {
                logData({
                    type: "error",
                    title: `Failed to create camera call to peer ${participant.id}`,
                    timeStamp: true,
                    layer: "camera_caller",
                    data: {
                        call,
                        me,
                        stream,
                    },
                });
                return;
            }

            call.on("stream", (peerStream) => {
                callback({
                    peerId: participant.id,
                    stream: peerStream,
                });
            });

            call.on("error", (err) => {
                logData({
                    type: "error",
                    title: `Error with peer ${participant.name}`,
                    timeStamp: true,
                    layer: "camera_caller",
                    data: err,
                });
            });

            call.on("close", () => {
                callback({
                    peerId: participant.id,
                    stream: null,
                });
            });
        } catch (error) {
            logData({
                type: "error",
                title: `Failed to initiate call to peer ${participant.name}`,
                timeStamp: true,
                layer: "camera_caller",
                data: error,
            });
            errorCallback(
                `Failed to initiate call to peer ${participant.name}`
            );
        }
    });
};

export interface AnswerCallParams {
    call: MediaConnection;
    stream: MediaStream;
    callback: (payload: AnswerCallCallbackParams) => void;
    peerName: string;
    errorCallback: (message: string) => void;
}

export interface AnswerCallCallbackParams {
    remoteStream: MediaStream | null;
    peerId: string;
    streamType: StreamType;
}

export type AnswerCall = (params: AnswerCallParams) => () => void;

export const answerCall: AnswerCall = ({
    call,
    stream,
    callback,
    errorCallback,
}) => {
    const callerId = call.metadata?.peerId || call.peer;
    const streamType = call.metadata?.streamType || "camera";

    logData({
        title: "Listening to call event",
        data: {
            call,
            stream,
        },
        timeStamp: true,
        type: "info",
        layer: "camera",
    });

    try {
        call.answer(stream);
        call.on("stream", (remoteStream: MediaStream) => {
            logData({
                title: "Received stream from another user",
                data: { remoteStream, streamType },
                timeStamp: true,
                type: "info",
                layer: "camera",
            });
            callback({
                remoteStream,
                peerId: callerId,
                streamType,
            });
        });

        call.on("error", (err: any) => {
            logData({
                type: "error",
                title: `[Incoming Call] Error from peer ${callerId}`,
                data: err,
                layer: "camera",
                timeStamp: true,
            });
        });

        call.on("close", () => {
            logData({
                title: "Someone stopped their camera " + callerId,
                type: "info",
                layer: "camera_receiver",
                timeStamp: true,
                data: {
                    streamType,
                },
            });
            callback({
                remoteStream: null,
                peerId: callerId,
                streamType,
            });
        });

        return () => {
            call.off("close");
            call.off("error");
            call.off("stream");
        };
    } catch (error) {
        logData({
            timeStamp: true,
            type: "error",
            title: "[Incoming Call] Failed to answer call",
            layer: "camera",
            data: error,
        });

        errorCallback("[Incoming Call] Failed to answer call");

        return () => {
            logData({
                title: "Nothing to unmount",
                type: "warn",
                data: {
                    message:
                        "Something during the setup of call events went wrong...",
                },
                layer: "camera",
                timeStamp: true,
            });
        };
    }
};
