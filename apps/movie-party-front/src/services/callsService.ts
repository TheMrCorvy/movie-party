import { logData } from "@repo/shared-utils/log-data";
import { Participant } from "@repo/type-definitions";
import Peer, { MediaConnection } from "peerjs";

export type StreamType = "camera" | "screen";

export interface StartCallParams {
    me: Peer | null;
    otherParticipants: Participant[];
    callback: (params: StartCallCallbackParams) => void;
    errorCallback: (message: string) => void;
    stream: MediaStream;
    streamType: StreamType;
}

export interface StartCallCallbackParams {
    peerId: string;
    stream: MediaStream | null;
    videoStream?: MediaStream | null;
    audioStream?: MediaStream | null;
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

    if (!me) {
        logData({
            title: "Peer connection is not available in the global state",
            layer: "*",
            type: "error",
            timeStamp: true,
            data: {
                otherParticipants,
                me,
                stream,
                streamType,
            },
        });
        errorCallback(`Something failed when trying to start the call...`);
        return;
    }

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
                const videoTracks = peerStream.getVideoTracks();
                const audioTracks = peerStream.getAudioTracks();

                const videoStream =
                    videoTracks.length > 0
                        ? new MediaStream(videoTracks)
                        : null;
                const audioStream =
                    audioTracks.length > 0
                        ? new MediaStream(audioTracks)
                        : null;

                callback({
                    peerId: participant.id,
                    stream: peerStream,
                    videoStream,
                    audioStream,
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
                    videoStream: null,
                    audioStream: null,
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
    videoStream?: MediaStream | null;
    audioStream?: MediaStream | null;
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
            const videoTracks = remoteStream.getVideoTracks();
            const audioTracks = remoteStream.getAudioTracks();

            const videoStream =
                videoTracks.length > 0 ? new MediaStream(videoTracks) : null;
            const audioStream =
                audioTracks.length > 0 ? new MediaStream(audioTracks) : null;

            logData({
                title: "Received stream from another user",
                data: { remoteStream, streamType, videoStream, audioStream },
                timeStamp: true,
                type: "info",
                layer: "camera",
            });
            callback({
                remoteStream,
                peerId: callerId,
                streamType,
                videoStream,
                audioStream,
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
                videoStream: null,
                audioStream: null,
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
