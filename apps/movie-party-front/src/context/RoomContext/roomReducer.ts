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
                    myId: action.payload.participants[0].id,
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
                },
            };
        default:
            return state;
    }
};
