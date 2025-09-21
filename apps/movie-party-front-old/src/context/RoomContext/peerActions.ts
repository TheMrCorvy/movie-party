import { AddPeerActionPayload } from "./peerReducer";

const ADD_PEER = "ADD_PEER";
const REMOVE_PEER = "REMOVE_PEER";

const addPeerAction = ({ peerId, stream, peerName }: AddPeerActionPayload) => ({
    type: ADD_PEER,
    payload: { peerId, stream, peerName },
});

const removePeerAction = (peerId: string) => ({
    type: REMOVE_PEER,
    payload: { peerId },
});

export { ADD_PEER, REMOVE_PEER, addPeerAction, removePeerAction };
