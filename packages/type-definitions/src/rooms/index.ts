import { MessageWithIndex, Participant } from "..";

export enum Signals {
    "CREATE_ROOM" = "CREATE_ROOM",
    "ENTER_ROOM" = "ENTER_ROOM",
    "LEAVE_ROOM" = "LEAVE_ROOM",
    "ROOM_CREATED" = "ROOM_CREATED",
    "GET_PARTICIPANTS" = "GET_PARTICIPANTS",
    "DOES_ROOM_EXISTS" = "DOES_ROOM_EXISTS",
    "ROOM_NOT_FOUND" = "ROOM_NOT_FOUND",
    "ROOM_EXISTS" = "ROOM_EXISTS",
    "SEND_MESSAGE" = "SEND_MESSAGE",
    "MESSAGE_RECEIVED" = "MESSAGE_RECEIVED",
    "ERROR" = "ERROR",
    "PEER_TOGGLED_CAMERA" = "PEER_TOGGLED_CAMERA",
    "NEW_PEER_JOINED" = "NEW_PEER_JOINED",
    "SCREEN_SHARING" = "SCREEN_SHARING",
}

export interface Room {
    id: string;
    messages: MessageWithIndex[];
    participants: Participant[];
    password?: string;
    screenSharing?: MediaStream;
    peerSharingScreen: string; //id of the peer
}
