import type Peer from "peerjs";

interface HandleUserJoinedParams {
    peerId: string;
    me: Peer;
    peerName: string;
}

const handleUserJoined = ({ peerId, me }: HandleUserJoinedParams) => {
    if (peerId === me.id) {
        return;
    }
};

export default handleUserJoined;
