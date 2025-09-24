import { Room } from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";
import { ActionTypes, RoomAction } from "./roomActions";
import { putMeFirst } from "../../utils/putMeFirst";

export interface LocalRoom extends Room {
    myId: string;
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
        case ActionTypes.START_MY_CAMERA:
            return {
                ...state,
                room: {
                    ...state.room,
                    participants: state.room.participants.map((p, i) => ({
                        ...p,
                        stream: i === 0 ? action.payload.stream : p.stream,
                    })),
                },
            };
        case ActionTypes.TOGGLE_PARTICIPANT_CAMERA:
            return {
                ...state,
                room: {
                    ...state.room,
                    participants: putMeFirst({
                        participants: state.room.participants.map(
                            (participant) => {
                                if (participant.id !== action.payload.peerId) {
                                    return participant;
                                }

                                return {
                                    ...participant,
                                    stream: action.payload.stream,
                                };
                            }
                        ),
                        myId: state.room.myId,
                    }),
                },
            };

        default:
            return state;
    }
};
