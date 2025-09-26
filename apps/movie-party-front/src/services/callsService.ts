import { Participant } from "@repo/type-definitions";
import Peer, { MediaConnection } from "peerjs";

export type StreamType = "camera" | "screen";

export interface StartCallParams {
    me: Peer;
    otherParticipants: Participant[];
    callback: (params: StartCallCallbackParams) => void;
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
}) => {
    otherParticipants.forEach((participant) => {
        try {
            const call = me.call(participant.id, stream as MediaStream, {
                metadata: {
                    peerId: me.id,
                    streamType,
                },
            });

            if (!call) {
                console.error(
                    `[Camera Calls] Failed to create camera call to peer ${participant.id}`
                );
                console.log(call);
                console.log(me);
                console.log(stream);
                return;
            }

            call.on("stream", (peerStream) => {
                callback({
                    peerId: participant.id,
                    stream: peerStream,
                });
            });

            call.on("error", (err) => {
                console.error(
                    `[Camera Calls] Error with peer ${participant.name}:`,
                    err
                );
            });

            call.on("close", () => {
                callback({
                    peerId: participant.id,
                    stream: null,
                });
            });
        } catch (error) {
            console.error(
                `[Camera Calls] Failed to initiate call to peer ${participant.name}:`,
                error
            );
        }
    });
};

export interface AnswerCallParams {
    call: MediaConnection;
    stream: MediaStream;
    callback: (payload: AnswerCallCallbackParams) => void;
    peerName: string;
}

export interface AnswerCallCallbackParams {
    remoteStream: MediaStream | null;
    peerId: string;
    streamType: StreamType;
}

export type AnswerCall = (params: AnswerCallParams) => () => void;

export const answerCall: AnswerCall = ({ call, stream, callback }) => {
    const callerId = call.metadata?.peerId || call.peer;
    const streamType = call.metadata?.streamType || "camera";

    try {
        call.answer(stream);
        call.on("stream", (remoteStream: MediaStream) => {
            callback({
                remoteStream,
                peerId: callerId,
                streamType,
            });
        });

        call.on("error", (err: any) => {
            console.error(`[Incoming Call] Error from peer ${callerId}:`, err);
        });

        call.on("close", () => {
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
        console.error("[Incoming Call] Failed to answer call:", error);

        return () => {
            console.log(
                "Something during the setup of call events went wrong..."
            );
            console.log("Nothing to unmount.");
        };
    }
};
