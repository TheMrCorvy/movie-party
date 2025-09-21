import { ADD_PEER, REMOVE_PEER } from "./peerActions";
import { PeerState } from "./RoomContext";

type PeersState = Record<string, PeerState>;

export interface AddPeerActionPayload {
    peerId: string;
    stream: MediaStream;
    peerName: string;
}

export type PeerAction =
    | {
          type: typeof ADD_PEER;
          payload: AddPeerActionPayload;
      }
    | { type: typeof REMOVE_PEER; payload: { peerId: string } };

export const peerReducer = (
    state: PeersState,
    action: PeerAction
): PeersState => {
    switch (action.type) {
        case ADD_PEER:
            return {
                ...state,
                [action.payload.peerId]: {
                    stream: action.payload.stream,
                    peerName: action.payload.peerName,
                },
            };

        case REMOVE_PEER: {
            const { [action.payload.peerId]: deleted, ...rest } = state;
            return rest;
        }

        default:
            return { ...state };
    }
};
