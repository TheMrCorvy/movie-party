import { logData } from "@repo/shared-utils/log-data";
import {
    ServerRoom,
    Signals,
    ToggleMicrophoneWsCallbackParams,
    ToggleMicrophoneWsParams,
} from "@repo/type-definitions/rooms";
import { Server as SocketIOServer } from "socket.io";
import roomValidation from "../utils/roomValidations";

export interface TogglePeerMicrophoneParams extends ToggleMicrophoneWsParams {
    io: SocketIOServer;
    rooms: ServerRoom[];
}

export type TogglePeerMicrophone = (params: TogglePeerMicrophoneParams) => void;

export const togglePeerMicrophone: TogglePeerMicrophone = ({
    roomId,
    peerId,
    microphoneStatus,
    io,
    rooms,
}) => {
    if (!roomId) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    const { room, roomIndex, roomExists, peerIsParticipant, peer } =
        roomValidation({
            rooms,
            roomId,
            peerId,
            peerShouldBeParticipant: true,
        });

    if (!room || roomIndex === -1 || !roomExists) {
        io.emit(Signals.ROOM_NOT_FOUND);
        return;
    }

    if (!peer || !peerIsParticipant) {
        io.emit(Signals.ERROR);
        return;
    }

    logData({
        title: "Peer toggled microphone",
        type: "info",
        timeStamp: true,
        addSpaceAfter: true,
        layer: "camera",
        data: { peerId, microphoneStatus },
    });

    const callbackParams: ToggleMicrophoneWsCallbackParams = {
        peerId,
        microphoneStatus,
    };

    io.emit(Signals.PEER_TOGGLED_MICROPHONE, callbackParams);
};
