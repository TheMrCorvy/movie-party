import { Participant } from "@repo/type-definitions";
import { LocalRoom } from "./roomReducer";

export enum ActionTypes {
    "SET_ROOM" = "SET_ROOM",
    "UPDATE_PARTICIPANTS" = "UPDATE_PARTICIPANTS",
    "SEND_MESSAGE" = "SEND_MESSAGE",
    "MESSAGE_RECEIVED" = "MESSAGE_RECEIVED",
}

export interface SetRoomAction {
    type: ActionTypes.SET_ROOM;
    payload: LocalRoom;
}

export interface UpdateParticipantsAction {
    type: ActionTypes.UPDATE_PARTICIPANTS;
    payload: Participant[];
}

export type RoomAction = SetRoomAction | UpdateParticipantsAction;
