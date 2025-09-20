import type { MediaConnection } from "peerjs";
import type Peer from "peerjs";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { Signals } from "@repo/type-definitions/rooms";
import type { PeerAction } from "../context/RoomContext/peerReducer";
import {
    initiateCameraCallsDuringScreenShare,
    cleanupCameraCalls,
} from "./handleCameraCallsDuringScreenShare";

interface HandleShareScreenProps {
    me: Peer;
    setStream: Dispatch<SetStateAction<MediaStream | undefined>>;
    setScreenSharingId: Dispatch<SetStateAction<string>>;
    callsRef: RefObject<MediaConnection[]>;
    cameraStream: MediaStream | undefined;
    screenSharingId: string;
    ws: Socket;
    roomId: string;
    dispatch: (payload: PeerAction) => void;
    cameraCalls: RefObject<MediaConnection[]>;
    peers: Record<string, { stream: MediaStream }>;
}

interface HandleSwitchStreamProps {
    newStream: MediaStream;
    isScreen?: boolean;
    setStream: Dispatch<SetStateAction<MediaStream | undefined>>;
    setScreenSharingId: Dispatch<SetStateAction<string>>;
    callsRef: RefObject<MediaConnection[]>;
    me: Peer;
}

const switchStream = ({
    newStream,
    isScreen,
    setStream,
    setScreenSharingId,
    callsRef,
    me,
}: HandleSwitchStreamProps) => {
    setStream(newStream);
    setScreenSharingId(isScreen ? me?.id || "" : "");

    const videoTrack = newStream.getVideoTracks()[0];

    callsRef.current.forEach((call) => {
        const sender = call.peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");

        if (sender && videoTrack) {
            sender.replaceTrack(videoTrack).catch((error) => {
                console.error(
                    `[Switch Stream] Error replacing track for peer ${call.peer}:`,
                    error
                );
            });
        } else {
            console.warn(
                `[Switch Stream] Could not replace track - sender: ${!!sender}, videoTrack: ${!!videoTrack}`
            );
        }
    });
};

export const handleShareScreen = async ({
    me,
    setStream,
    setScreenSharingId,
    callsRef,
    cameraStream,
    screenSharingId,
    ws,
    roomId,
    dispatch,
    cameraCalls,
    peers,
}: HandleShareScreenProps) => {
    if (screenSharingId) {
        if (cameraStream) {
            switchStream({
                newStream: cameraStream,
                isScreen: false,
                setStream,
                setScreenSharingId,
                callsRef,
                me,
            });
            ws.emit(Signals.STOP_SHARING, { peerId: me.id, roomId });
        }

        cleanupCameraCalls({ cameraCalls });
        setScreenSharingId("");
    } else {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false,
        });
        switchStream({
            newStream: displayStream,
            isScreen: true,
            setStream,
            setScreenSharingId,
            callsRef,
            me,
        });

        ws.emit(Signals.START_SHARING, { peerId: me.id, roomId });

        if (cameraStream) {
            const otherPeerIds = Object.keys(peers);

            initiateCameraCallsDuringScreenShare({
                me,
                cameraStream,
                participants: otherPeerIds,
                dispatch,
                cameraCalls,
            });
        }

        displayStream.getVideoTracks()[0].onended = () => {
            if (cameraStream) {
                switchStream({
                    newStream: cameraStream,
                    isScreen: false,
                    setStream,
                    setScreenSharingId,
                    callsRef,
                    me,
                });
                ws.emit(Signals.STOP_SHARING, { peerId: me.id, roomId });
            }
            cleanupCameraCalls({ cameraCalls });
            setScreenSharingId("");
        };
    }
};
