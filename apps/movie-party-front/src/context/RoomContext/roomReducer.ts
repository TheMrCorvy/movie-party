import { Room } from "@repo/type-definitions/rooms";
import { Socket } from "socket.io-client";

export interface LocalRoom extends Room {
    myId: string;
}
export interface RoomState {
    room: LocalRoom;
    ws: Socket | null;
}

export enum ActionTypes {
    "SET_ROOM" = "SET_ROOM",
    "ADD_PEER" = "ADD_PEER",
    "REMOVE_PEER" = "REMOVE_PEER",
    "SEND_MESSAGE" = "SEND_MESSAGE",
    "MESSAGE_RECEIVED" = "MESSAGE_RECEIVED",
}

export type RoomAction = { type: ActionTypes; payload: LocalRoom };

// Reducer function to handle state updates
export const roomReducer = (
    state: RoomState,
    action: RoomAction
): RoomState => {
    switch (action.type) {
        case "SET_ROOM":
            return {
                ...state,
                room: {
                    ...action.payload,
                    myId: action.payload.participants[0].id,
                },
            };
        default:
            return state;
    }
};
