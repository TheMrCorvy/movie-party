import { stringIsEmpty } from "@repo/shared-utils";
import { Participant } from "@repo/type-definitions";
import { ServerRoom } from "@repo/type-definitions/rooms";

export interface RoomValidationParams {
    rooms: ServerRoom[];
    peerId?: string;
    roomId: string;
    peerShouldBeParticipant?: boolean;
}

export interface RoomValidationResult {
    roomExists: boolean;
    room: ServerRoom | undefined;
    roomIndex: number;
    peerIsParticipant: boolean;
    peerIsOwner: boolean;
    peerIndex: number;
    message: string;
    peer: Participant | undefined;
}

export type RoomValidation = (
    params: RoomValidationParams
) => RoomValidationResult;

const roomValidation: RoomValidation = ({
    roomId,
    rooms,
    peerId,
    peerShouldBeParticipant,
}) => {
    if (rooms.length < 1) {
        return {
            roomExists: false,
            room: undefined,
            roomIndex: -1,
            peerIsParticipant: false,
            peerIsOwner: false,
            peer: undefined,
            peerIndex: -1,
            message: "Room does not exist.",
        };
    }

    if (!roomId || stringIsEmpty(roomId)) {
        return {
            roomExists: false,
            room: undefined,
            roomIndex: -1,
            peerIsParticipant: false,
            peerIsOwner: false,
            peer: undefined,
            peerIndex: -1,
            message: "Room ID is empty.",
        };
    }

    const roomIndex = rooms.findIndex((r) => r.id === roomId);

    if (roomIndex === -1) {
        return {
            roomExists: false,
            room: undefined,
            roomIndex: -1,
            peerIsParticipant: false,
            peerIsOwner: false,
            peer: undefined,
            peerIndex: -1,
            message: "Room was not found.",
        };
    }

    const room = rooms[roomIndex];

    if (peerShouldBeParticipant && (!peerId || stringIsEmpty(peerId))) {
        return {
            roomExists: true,
            room,
            roomIndex,
            peerIsParticipant: false,
            peerIsOwner: false,
            peer: undefined,
            peerIndex: -1,
            message: "Peer ID is not present.",
        };
    }

    const peerIndex = room.participants.findIndex((p) => p.id === peerId);

    if (peerIndex === -1 && peerShouldBeParticipant) {
        return {
            roomExists: true,
            room,
            roomIndex,
            peerIsParticipant: false,
            peerIsOwner: false,
            peer: undefined,
            peerIndex: -1,
            message: "Peer is not a participant in the selected room.",
        };
    }

    const peer = room.participants[peerIndex];

    return {
        roomExists: true,
        room,
        roomIndex,
        peerIsParticipant: true,
        peerIsOwner: peer !== undefined ? room.roomOwner === peer.id : false,
        peer,
        peerIndex,
        message: "All validations passed.",
    };
};

export default roomValidation;
