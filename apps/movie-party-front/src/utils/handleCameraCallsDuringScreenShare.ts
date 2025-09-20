import type { MediaConnection } from "peerjs";
import type Peer from "peerjs";
import type { RefObject } from "react";
import type { PeerAction } from "../context/RoomContext/peerReducer";

interface HandleCameraCallsProps {
    me: Peer;
    cameraStream: MediaStream;
    participants: string[];
    dispatch: (payload: PeerAction) => void;
    cameraCalls: RefObject<MediaConnection[]>;
}

interface CleanupCameraCallsProps {
    cameraCalls: RefObject<MediaConnection[]>;
}

export const initiateCameraCallsDuringScreenShare = ({
    me,
    cameraStream,
    participants,
    dispatch,
    cameraCalls,
}: HandleCameraCallsProps) => {
    cleanupCameraCalls({ cameraCalls });

    const otherParticipants = participants.filter((peerId) => peerId !== me.id);

    if (otherParticipants.length === 0) {
        console.log(
            "[Camera Calls] No other participants to send camera stream to"
        );
        return;
    }

    otherParticipants.forEach((peerId) => {
        try {
            const call = me.call(peerId, cameraStream, {
                metadata: {
                    peerId: me.id,
                    streamType: "camera-during-screenshare",
                },
            });

            if (!call) {
                console.error(
                    `[Camera Calls] Failed to create camera call to peer ${peerId}`
                );
                return;
            }

            cameraCalls.current.push(call);

            call.on("stream", (peerStream) => {
                dispatch({
                    type: "ADD_PEER",
                    payload: {
                        peerId: `${peerId}-camera`,
                        stream: peerStream,
                    },
                });
            });

            call.on("error", (err) => {
                console.error(`[Camera Calls] Error with peer ${peerId}:`, err);
            });

            call.on("close", () => {
                if (cameraCalls.current) {
                    cameraCalls.current = cameraCalls.current.filter(
                        (c) => c !== call
                    );
                }

                dispatch({
                    type: "REMOVE_PEER",
                    payload: { peerId: `${peerId}-camera` },
                });
            });
        } catch (error) {
            console.error(
                `[Camera Calls] Failed to initiate call to peer ${peerId}:`,
                error
            );
        }
    });
};

export const cleanupCameraCalls = ({
    cameraCalls,
}: CleanupCameraCallsProps) => {
    console.log("[Camera Calls] Cleaning up camera calls");
    if (cameraCalls.current && cameraCalls.current.length > 0) {
        console.log(
            `[Camera Calls] Closing ${cameraCalls.current.length} camera calls`
        );
        cameraCalls.current.forEach((call) => {
            try {
                call.close();
            } catch (error) {
                console.error(
                    "[Camera Calls] Error closing camera call:",
                    error
                );
            }
        });
        cameraCalls.current = [];
    } else {
        console.log("[Camera Calls] No camera calls to clean up");
    }
};
