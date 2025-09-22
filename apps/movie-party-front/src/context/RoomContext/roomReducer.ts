import { Room } from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";
import { ActionTypes, RoomAction } from "./roomActions";

export interface LocalRoom extends Room {
    myId: string;
}
export interface RoomState {
    room: LocalRoom;
    ws: Socket | null;
}

// Reducer function to handle state updates
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
                    participants: [],
                },
            };
        case ActionTypes.UPDATE_PARTICIPANTS:
            return {
                ...state,
                room: {
                    ...state.room,
                    participants: action.payload,
                },
            };
        default:
            return state;
    }
};
