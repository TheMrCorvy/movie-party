import { Message, Participant } from "..";

export enum Signals {
    "CREATE_ROOM" = "CREATE_ROOM",
    "ENTER_ROOM" = "ENTER_ROOM",
    "LEAVE_ROOM" = "LEAVE_ROOM",
    "ROOM_CREATED" = "ROOM_CREATED",
    "GET_PARTICIPANTS" = "GET_PARTICIPANTS",
    "DOES_ROOM_EXISTS" = "DOES_ROOM_EXISTS",
    "ROOM_NOT_FOUND" = "ROOM_NOT_FOUND",
    "ROOM_EXISTS" = "ROOM_EXISTS",
}

export interface Room {
    id: string;
    messages: Message[];
    participants: Participant[];
}
