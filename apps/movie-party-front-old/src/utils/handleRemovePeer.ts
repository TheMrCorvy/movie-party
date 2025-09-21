import type { PeerAction } from "../context/RoomContext/peerReducer";

interface HandleRemovePeerParams {
    peerId: string;
    dispatch: (payload: PeerAction) => void;
}

const handleRemovePeer = ({ peerId, dispatch }: HandleRemovePeerParams) => {
    console.log("peer left: ", peerId);
    dispatch({
        type: "REMOVE_PEER",
        payload: { peerId },
    });
};

export default handleRemovePeer;
