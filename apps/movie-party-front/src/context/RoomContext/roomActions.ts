import { MessageWithIndex, Participant } from "@repo/type-definitions";
import { LocalRoom } from "./roomReducer";

export enum ActionTypes {
    "SET_ROOM" = "SET_ROOM",
    "JOIN_ROOM" = "JOIN_ROOM",
    "UPDATE_PARTICIPANTS" = "UPDATE_PARTICIPANTS",
    "MESSAGE_RECEIVED" = "MESSAGE_RECEIVED",
    "START_MY_CAMERA" = "START_MY_CAMERA",
    "TOGGLE_PARTICIPANT_CAMERA" = "TOGGLE_PARTICIPANT_CAMERA",
    "SETUP_PEER_ACTION" = "SETUP_PEER_ACTION",
    "TOGGLE_SCREEN_SHARING" = "TOGGLE_SCREEN_SHARING",
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
        messages: MessageWithIndex[];
        peerSharingScreen: string;
    };
}

export interface StartMyCameraAction {
    type: ActionTypes.START_MY_CAMERA;
    payload: {
        stream: MediaStream;
    };
}

export interface MessageReceivedAction {
    type: ActionTypes.MESSAGE_RECEIVED;
    payload: MessageWithIndex;
}

export interface ToggleParticipantCameraAction {
    type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA;
    payload: {
        stream: MediaStream | null;
        peerId: string;
    };
}

export interface ToggleScreenSharing {
    type: ActionTypes.TOGGLE_SCREEN_SHARING;
    payload: string;
}

export type RoomAction =
    | SetRoomAction
    | UpdateParticipantsAction
    | JoinRoomAction
    | StartMyCameraAction
    | MessageReceivedAction
    | ToggleParticipantCameraAction
    | ToggleScreenSharing;
