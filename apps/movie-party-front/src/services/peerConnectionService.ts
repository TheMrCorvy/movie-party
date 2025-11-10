import Peer, { PeerError } from "peerjs";
import { answerCall, AnswerCallCallbackParams } from "./callsService";
import { Participant } from "@repo/type-definitions";
import { logData } from "@repo/shared-utils/log-data";

export interface PeerConnectionServiceParams {
    myId: string;
}

export type PeerConnectionService = (
    params: PeerConnectionServiceParams
) => Peer;

export const peerConnectionService: PeerConnectionService = ({ myId }) => {
    return new Peer(myId, {
        host: process.env.PEERJS_HOST || "localhost",
        port: parseInt(process.env.PEERJS_PORT || "9000"),
        path: process.env.PEERJS_PATH || "/",
        secure: process.env.PEERJS_SECURE === "true" || false,
    });
};

type PeerErrorTypes =
    | "disconnected"
    | "browser-incompatible"
    | "invalid-id"
    | "invalid-key"
    | "network"
    | "peer-unavailable"
    | "ssl-unavailable"
    | "server-error"
    | "socket-error"
    | "socket-closed"
    | "unavailable-id"
    | "webrtc";

export interface ListenPeerEventsParams {
    peerConnection: Peer;
    onCallEvent: (params: AnswerCallCallbackParams) => void;
    onPeerOpen: (peer: Peer) => void;
    onPeerError: (error: PeerError<PeerErrorTypes>) => void;
    onPeerClose: () => void;
    onPeerDisconnect: (peer: Peer) => void;
    me: Participant;
    errorCallback: (message: string) => void;
}

export type ListenPeerEventsService = (
    params: ListenPeerEventsParams
) => () => void;

export const listenPeerEventsService: ListenPeerEventsService = ({
    peerConnection,
    onCallEvent,
    onPeerOpen,
    onPeerClose,
    onPeerDisconnect,
    onPeerError,
    me,
    errorCallback,
}) => {
    let removeCallListeners = () => {};
    peerConnection.on("open", () => onPeerOpen(peerConnection));
    peerConnection.on("error", onPeerError);
    peerConnection.on("disconnected", () => onPeerDisconnect(peerConnection));
    peerConnection.on("close", onPeerClose);
    peerConnection.on("call", (call) => {
        logData({
            title: "Incoming call",
            data: call,
            type: "info",
            timeStamp: true,
            layer: "camera_receiver",
        });
        removeCallListeners = answerCall({
            call,
            stream: me.stream as MediaStream,
            callback: onCallEvent,
            peerName: me.name,
            errorCallback: errorCallback,
        });
    });

    return () => {
        peerConnection.off("call");
        peerConnection.off("close");
        peerConnection.off("open");
        peerConnection.off("disconnected");
        peerConnection.off("error");
        removeCallListeners();
    };
};

export const defaultPeerOpenEvent = (peer: Peer) => {
    logData({
        title: "Peer opened",
        data: peer,
        type: "info",
        timeStamp: true,
        layer: "camera",
    });
};

export const defaultPeerError = (err: PeerError<PeerErrorTypes>) => {
    logData({
        timeStamp: true,
        title: "❌ PeerJS error",
        data: {
            ...err,
            type: err.type,
        },
        layer: "camera",
        type: "info",
    });
};

export const defaultPeerClose = () => {
    logData({
        title: "🔴 PeerJS connection closed",
        timeStamp: true,
        type: "info",
        layer: "camera",
    });
};

export const defaultPeerDesconnected = (peer: Peer) => {
    peer.reconnect();
    logData({
        title: "Peer is reconnecting",
        type: "warn",
        layer: "camera",
        timeStamp: true,
        data: peer,
    });
};
