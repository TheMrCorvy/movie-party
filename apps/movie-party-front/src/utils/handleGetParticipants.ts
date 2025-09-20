import type Peer from "peerjs";
import type { PeerAction } from "../context/RoomContext/peerReducer";

interface Participants {
    participants: string[];
    roomId: string;
    me: Peer;
    stream: MediaStream;
    dispatch: (payload: PeerAction) => void;
}

const filterOtherParticipants = (
    participants: string[],
    meId: string
): string[] => {
    return participants.filter((peerId) => peerId !== meId);
};

const handleGetParticipants = ({
    participants,
    me,
    stream,
    dispatch,
}: Participants) => {
    const otherParticipants = filterOtherParticipants(participants, me.id);

    if (otherParticipants.length < 1) {
        console.log("No new participants to connect with");
        return;
    }

    otherParticipants.forEach((peerId) =>
        handleCallSent({ peerId, me, stream, dispatch })
    );
};

interface HandleCallParams {
    peerId: string;
    me: Peer;
    stream: MediaStream;
    dispatch: (payload: PeerAction) => void;
}

const handleCallSent = ({ peerId, me, stream, dispatch }: HandleCallParams) => {
    try {
        const call = me.call(peerId, stream, {
            metadata: { peerId: me.id },
        });

        if (!call) {
            console.error("Failed to create call object");
            return;
        }

        call.on("stream", (peerStream) => {
            dispatch({
                type: "ADD_PEER",
                payload: { peerId, stream: peerStream },
            });
        });

        call.on("error", (err) => {
            console.error(`!!! Call error with peer ${peerId}:`, err);
        });

        call.on("close", () => {
            console.log(`Call closed with peer ${peerId}`);
        });
    } catch (error) {
        console.error(`Failed to call peer ${peerId}:`, error);
    }
};

export default handleGetParticipants;
