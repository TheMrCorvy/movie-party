import type { Participant } from "@repo/type-definitions";
import { Socket } from "socket.io-client";
import { ActionTypes, RoomAction } from "./roomActions";
import { putMeFirst } from "../../utils/putMeFirst";
import Peer from "peerjs";

export interface LocalRoom {
    id: string;
    messages: any[];
    participants: Array<
        Participant & {
            videoStream?: MediaStream | null;
            audioStream?: MediaStream | null;
        }
    >;
    screenSharing?: MediaStream;
    peerSharingScreen: string;
    hasCustomBg?: any;
    myId: string;
    imRoomOwner: boolean;
    password?: string;
    me: Peer | null;
}
export interface RoomState {
    room: LocalRoom;
    ws: Socket | null;
}

export const roomReducer = (
    state: RoomState,
    action: RoomAction
): RoomState => {
    switch (action.type) {
        case ActionTypes.SET_ROOM:
            return {
                ...state,
                room: {
                    ...action.payload,
                },
            };
        case ActionTypes.UPDATE_PARTICIPANTS:
            return {
                ...state,
                room: {
                    ...state.room,
                    participants: putMeFirst({
                        participants: action.payload,
                        myId: state.room.myId,
                        oldVersionOfMe: state.room.participants[0],
                    }).map((updatedParticipant) => {
                        const roomP = state.room.participants.find(
                            (p) => p.id === updatedParticipant.id
                        );
                        if (roomP === undefined) {
                            return updatedParticipant;
                        }
                        return roomP;
                    }),
                },
            };
        case ActionTypes.JOIN_ROOM:
            return {
                ...state,
                room: {
                    ...state.room,
                    myId: action.payload.myId,
                    participants: putMeFirst({
                        participants: action.payload.participants,
                        myId: action.payload.myId,
                    }),
                    id: action.payload.roomId,
                    messages: action.payload.messages,
                    peerSharingScreen: action.payload.peerSharingScreen,
                },
            };
        case ActionTypes.MESSAGE_RECEIVED:
            return {
                ...state,
                room: {
                    ...state.room,
                    messages: [...state.room.messages, action.payload],
                },
            };
        case ActionTypes.TOGGLE_PARTICIPANT_CAMERA:
            return {
                ...state,
                room: {
                    ...state.room,
                    participants: state.room.participants.map((participant) => {
                        if (participant.id !== action.payload.peerId) {
                            return participant;
                        }
                        return {
                            ...participant,
                            videoStream: action.payload.videoStream,
                        };
                    }),
                },
            };
        case ActionTypes.TOGGLE_PARTICIPANT_MICROPHONE:
            return {
                ...state,
                room: {
                    ...state.room,
                    participants: state.room.participants.map((participant) => {
                        if (participant.id !== action.payload.peerId) {
                            return participant;
                        }
                        return {
                            ...participant,
                            audioStream: action.payload.audioStream,
                        };
                    }),
                },
            };
        case ActionTypes.TOGGLE_SCREEN_SHARING:
            return {
                ...state,
                room: {
                    ...state.room,
                    peerSharingScreen: action.payload,
                },
            };
        case ActionTypes.FINISHED_POLL:
            return {
                ...state,
                room: {
                    ...state.room,
                    messages: state.room.messages.map((message) => {
                        if (message.id === action.payload.message.id) {
                            return action.payload.message;
                        }
                        return message;
                    }),
                },
            };
        case ActionTypes.USER_VOTED:
            return {
                ...state,
                room: {
                    ...state.room,
                    messages: state.room.messages.map((message) => {
                        if (
                            message.isPoll &&
                            message.poll &&
                            message.poll.status === "live"
                        ) {
                            return {
                                ...message,
                                poll: action.payload.poll,
                            };
                        }
                        return message;
                    }),
                },
            };
        case ActionTypes.SETUP_PEER_ACTION:
            return {
                ...state,
                room: {
                    ...state.room,
                    me: action.payload,
                },
            };
        default:
            return state;
    }
};
