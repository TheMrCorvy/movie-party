import { Participant } from "@repo/type-definitions";
import { LocalRoom } from "./roomReducer";

export enum ActionTypes {
    "SET_ROOM" = "SET_ROOM",
    "JOIN_ROOM" = "JOIN_ROOM",
    "UPDATE_PARTICIPANTS" = "UPDATE_PARTICIPANTS",
    "SEND_MESSAGE" = "SEND_MESSAGE",
    "MESSAGE_RECEIVED" = "MESSAGE_RECEIVED",
    "START_MY_CAMERA" = "START_MY_CAMERA",
}

export interface SetRoomAction {
    type: ActionTypes.SET_ROOM;
    payload: LocalRoom;
}

export interface UpdateParticipantsAction {
    type: ActionTypes.UPDATE_PARTICIPANTS;
    payload: Participant[];
}

export interface JoinRoomAction {
    type: ActionTypes.JOIN_ROOM;
    payload: {
        participants: Participant[];
        myId: string;
        roomId: string;
    };
}

export interface StartMyCameraAction {
    type: ActionTypes.START_MY_CAMERA;
    payload: {
        stream: MediaStream;
    };
}

export type RoomAction =
    | SetRoomAction
    | UpdateParticipantsAction
    | JoinRoomAction
    | StartMyCameraAction;
