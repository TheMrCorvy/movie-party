import { Participant } from "@repo/type-definitions";
import { Signals } from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";

export interface UpdateParticipantsCallback {
    roomId: string;
    participants: Participant[];
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
            websocketOff(ws);
        };
    }

    return () => {
        console.log("Nothing to unmount.");
    };
};

const websocketOff = (ws: Socket) => {
    ws.off(Signals.GET_PARTICIPANTS);
};
