import { logData } from "@repo/shared-utils/log-data";
import { Participant } from "@repo/type-definitions";
import {
    Signals,
    UpdateParticipantsWsCallback,
} from "@repo/type-definitions/rooms";
import Peer from "peerjs";
import { Socket } from "socket.io-client";

export interface UpdateParticipantsParam {
    callback: (callbackParams: UpdateParticipantsWsCallback) => void;
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
                logData({
                    layer: "camera",
                    title: "No peer available",
                    data: {
                        peerId,
                        peer,
                        peerName,
                        ws,
                        me,
                    },
                    timeStamp: true,
                    type: "error",
                });
                return;
            }

            if (me.stream) {
                logData({
                    timeStamp: true,
                    title: "Calling peer: " + peerName,
                    layer: "camera_caller",
                    type: "info",
                });
                peer.call(peerId, me.stream);
            }
        });

        return () => {
            ws.off(Signals.NEW_PEER_JOINED);
        };
    }

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
};
