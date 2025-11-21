import { MessageWithIndex, Participant, Poll } from "@repo/type-definitions";
import { LocalRoom } from "./roomReducer";

export enum ActionTypes {
    "SET_ROOM" = "SET_ROOM",
    "JOIN_ROOM" = "JOIN_ROOM",
    "UPDATE_PARTICIPANTS" = "UPDATE_PARTICIPANTS",
    "MESSAGE_RECEIVED" = "MESSAGE_RECEIVED",
    "TOGGLE_PARTICIPANT_CAMERA" = "TOGGLE_PARTICIPANT_CAMERA",
    "SETUP_PEER_ACTION" = "SETUP_PEER_ACTION",
    "TOGGLE_SCREEN_SHARING" = "TOGGLE_SCREEN_SHARING",
    "USER_VOTED" = "USER_VOTED",
    "FINISHED_POLL" = "FINISHED_POLL",
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

export interface MessageReceivedAction {
    type: ActionTypes.MESSAGE_RECEIVED;
    payload: MessageWithIndex;
}

export interface ToggleParticipantCameraAction {
    type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA;
    payload: {
        stream: MediaStream | null;
        peerId: string;
        myCameraIsOn: boolean;
    };
}

export interface ToggleScreenSharing {
    type: ActionTypes.TOGGLE_SCREEN_SHARING;
    payload: string;
}

export interface UserVotedAction {
    type: ActionTypes.USER_VOTED;
    payload: {
        poll: Poll;
    };
}

export interface FinishedPollAction {
    type: ActionTypes.FINISHED_POLL;
    payload: {
        message: MessageWithIndex;
    };
}

export type RoomAction =
    | SetRoomAction
    | UpdateParticipantsAction
    | JoinRoomAction
    | MessageReceivedAction
    | ToggleParticipantCameraAction
    | ToggleScreenSharing
    | UserVotedAction
    | FinishedPollAction;
