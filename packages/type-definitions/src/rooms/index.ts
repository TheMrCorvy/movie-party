import { Message, Participant } from "..";

export enum Signals {
    "CREATE_ROOM" = "CREATE_ROOM",
    "ENTER_ROOM" = "ENTER_ROOM",
    "LEAVE_ROOM" = "LEAVE_ROOM",
    "ROOM_CREATED" = "ROOM_CREATED",
    "GET_PARTICIPANTS" = "GET_PARTICIPANTS",
    "ROOM_NOT_FOUND" = "ROOM_NOT_FOUND",
    "START_SHARING" = "START_SHARING",
    "STOP_SHARING" = "STOP_SHARING",
    "STARTED_SHARING" = "STARTED_SHARING",
    "STOPPED_SHARING" = "STOPPED_SHARING",
}

export interface Room {
    id: string;
    messages: Message[];
    participants: Participant[];
}
