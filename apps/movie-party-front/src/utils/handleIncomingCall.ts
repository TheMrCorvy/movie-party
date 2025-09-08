import type { PeerAction } from "../context/peerReducer";

interface HandleIncomingCallParams {
    call: any;
    stream: MediaStream;
    dispatch: (payload: PeerAction) => void;
}

const handleIncomingCall = ({
    call,
    stream,
    dispatch,
}: HandleIncomingCallParams) => {
    if (!stream) {
        console.error("No stream available to answer call!");
        return;
    }

    try {
        call.answer(stream);
        call.on("stream", (remoteStream: MediaStream) => {
            dispatch({
                type: "ADD_PEER",
                payload: { peerId: call.peer, stream: remoteStream },
            });
        });

        call.on("error", (err: any) => {
            console.error(`!!! Answer call error from peer ${call.peer}:`, err);
        });

        call.on("close", () => {
            console.log(`Call closed from peer ${call.peer}`);
        });
    } catch (error) {
        console.error("Failed to answer call:", error);
    }
};

export default handleIncomingCall;
