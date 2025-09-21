import type Peer from "peerjs";
import type { PeerAction } from "../context/RoomContext/peerReducer";
import { Participant } from "@repo/type-definitions";

interface Participants {
    participants: Participant[];
    roomId: string;
    me: Peer;
    stream: MediaStream;
    dispatch: (payload: PeerAction) => void;
}

const filterOtherParticipants = (
    participants: Participant[],
    meId: string
): Participant[] => {
    return participants.filter((participant) => participant.id !== meId);
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

    otherParticipants.forEach((participant) =>
        handleCallSent({
            peerId: participant.id,
            me,
            stream,
            dispatch,
            peerName: participant.name,
        })
    );
};

interface HandleCallParams {
    peerId: string;
    me: Peer;
    stream: MediaStream;
    dispatch: (payload: PeerAction) => void;
    peerName: string;
}

const handleCallSent = ({
    peerId,
    me,
    stream,
    dispatch,
    peerName,
}: HandleCallParams) => {
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
                payload: { peerId, stream: peerStream, peerName },
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
