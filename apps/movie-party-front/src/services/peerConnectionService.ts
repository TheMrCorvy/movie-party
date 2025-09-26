import Peer, { PeerError } from "peerjs";
import { answerCall, AnswerCallCallbackParams } from "./callsService";
import { Participant } from "@repo/type-definitions";

export interface PeerConnectionServiceParams {
    myId: string;
}

export type PeerConnectionService = (
    params: PeerConnectionServiceParams
) => Peer;

export const peerConnectionService: PeerConnectionService = ({ myId }) => {
    return new Peer(myId, {
        host: "localhost",
        port: 9000,
        path: "/",
        secure: false,
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
}) => {
    let removeCallListeners = () => {};
    peerConnection.on("open", () => onPeerOpen(peerConnection));
    peerConnection.on("error", onPeerError);
    peerConnection.on("disconnected", () => onPeerDisconnect(peerConnection));
    peerConnection.on("close", onPeerClose);
    peerConnection.on("call", (call) => {
        console.log("Incoming call", call);
        removeCallListeners = answerCall({
            call,
            stream: me.stream as MediaStream,
            callback: onCallEvent,
            peerName: me.name,
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
    console.log("Peer opened.", peer);
};

export const defaultPeerError = (err: PeerError<PeerErrorTypes>) => {
    console.error("❌ PeerJS error:", err);
    console.error("Error type:", err.type);
};

export const defaultPeerClose = () => {
    console.log("🔴 PeerJS connection closed");
};

export const defaultPeerDesconnected = (peer: Peer) => {
    peer.reconnect();
    console.log("Peer is reconnecting...");
};
