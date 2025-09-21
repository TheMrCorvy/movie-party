import { Room } from "@repo/type-definitions/rooms";

export interface RoomState {
    room: Room;
}

export enum ActionTypes {
    "SET_ROOM_ID" = "SET_ROOM_ID",
    "ADD_PEER" = "ADD_PEER",
    "REMOVE_PEER" = "REMOVE_PEER",
    "SEND_MESSAGE" = "SEND_MESSAGE",
    "MESSAGE_RECEIVED" = "MESSAGE_RECEIVED",
}

export type RoomAction = { type: ActionTypes; payload: Room };

// Reducer function to handle state updates
export const roomReducer = (
    state: RoomState,
    action: RoomAction
): RoomState => {
    switch (action.type) {
        case "SET_ROOM_ID":
            return { ...state, room: action.payload };
        default:
            return state;
    }
};
