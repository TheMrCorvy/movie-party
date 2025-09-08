const ADD_PEER = "ADD_PEER";
const REMOVE_PEER = "REMOVE_PEER";

const addPeerAction = (peerId: string, stream: MediaStream) => ({
    type: ADD_PEER,
    payload: { peerId, stream },
});

const removePeerAction = (peerId: string) => ({
    type: REMOVE_PEER,
    payload: { peerId },
});

export { ADD_PEER, REMOVE_PEER, addPeerAction, removePeerAction };
