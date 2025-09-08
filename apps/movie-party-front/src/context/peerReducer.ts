import { ADD_PEER, REMOVE_PEER } from "./peerActions";

type PeersState = Record<string, { stream: MediaStream }>;

type PeerAction =
    | {
          type: typeof ADD_PEER;
          payload: { peerId: string; stream: MediaStream };
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
                [action.payload.peerId]: { stream: action.payload.stream },
            };

        case REMOVE_PEER: {
            const { [action.payload.peerId]: deleted, ...rest } = state;
            return rest;
        }

        default:
            return { ...state };
    }
};
