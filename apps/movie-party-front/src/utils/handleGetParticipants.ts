import type Peer from "peerjs";
import type { PeerAction } from "../context/peerReducer";

const bufferTime = 1000; //1 sec

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

    otherParticipants.forEach((peerId) => {
        setTimeout(() => {
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
        }, bufferTime);
    });
};

export default handleGetParticipants;
