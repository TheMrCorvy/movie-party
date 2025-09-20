import type { PeerAction } from "../context/RoomContext/peerReducer";

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
    const isCameraCall =
        call.metadata?.streamType === "camera-during-screenshare";
    const callerId = call.metadata?.peerId || call.peer;

    if (!stream) {
        console.error("[Incoming Call] No stream available to answer call!");
        return;
    }

    try {
        call.answer(stream);
        call.on("stream", (remoteStream: MediaStream) => {
            const peerId = isCameraCall ? `${callerId}-camera` : call.peer;

            dispatch({
                type: "ADD_PEER",
                payload: { peerId, stream: remoteStream },
            });
        });

        call.on("error", (err: any) => {
            console.error(`[Incoming Call] Error from peer ${callerId}:`, err);
        });

        call.on("close", () => {
            if (isCameraCall) {
                dispatch({
                    type: "REMOVE_PEER",
                    payload: { peerId: `${callerId}-camera` },
                });
            }
        });
    } catch (error) {
        console.error("[Incoming Call] Failed to answer call:", error);
    }
};

export default handleIncomingCall;
