import { MessageWithIndex, Participant } from "@repo/type-definitions";
import { Signals } from "@repo/type-definitions/rooms";
import Peer from "peerjs";
import { Socket } from "socket.io-client";

export interface UpdateParticipantsCallback {
    roomId: string;
    participants: Participant[];
    messages: MessageWithIndex[];
    peerSharingScreen: string;
}

export interface UpdateParticipantsParam {
    callback: (callbackParams: UpdateParticipantsCallback) => void;
    ws: Socket | null;
}

export type UpdateParticipantsService = (
    params: UpdateParticipantsParam
) => () => void;

export const updateParticipantsService: UpdateParticipantsService = ({
    callback,
    ws,
}) => {
    if (ws) {
        ws.on(Signals.GET_PARTICIPANTS, callback);

        return () => {
            ws.off(Signals.GET_PARTICIPANTS);
        };
    }

    return () => {
        console.log("Nothing to unmount.");
    };
};

export interface NewPeerJoinedParams {
    ws: Socket | null;
    peer: Peer | null;
    me: Participant;
}

export type NewPeerJoined = (params: NewPeerJoinedParams) => () => void;

export const newPeerJoinedListener: NewPeerJoined = ({ ws, peer, me }) => {
    if (ws) {
        ws.on(Signals.NEW_PEER_JOINED, ({ peerId, peerName }) => {
            if (!peer) {
                console.error("No peer available...");
                return;
            }

            if (me.stream) {
                console.log("Calling: ", peerName);
                peer.call(peerId, me.stream);
            }
        });

        return () => {
            ws.off(Signals.NEW_PEER_JOINED);
        };
    }

    return () => {
        console.log("Nothing to unmount.");
    };
};
