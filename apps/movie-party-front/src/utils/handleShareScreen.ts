import type { MediaConnection } from "peerjs";
import type Peer from "peerjs";
import type { Dispatch, RefObject, SetStateAction } from "react";

interface HandleShareScreenProps {
    me: Peer;
    setStream: Dispatch<SetStateAction<MediaStream | undefined>>;
    setScreenSharingId: Dispatch<SetStateAction<string>>;
    callsRef: RefObject<MediaConnection[]>;
    cameraStream: MediaStream | undefined;
    screenSharingId: string;
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
            sender.replaceTrack(videoTrack).catch(console.error);
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
}: HandleShareScreenProps) => {
    if (screenSharingId) {
        if (cameraStream)
            switchStream({
                newStream: cameraStream,
                isScreen: false,
                setStream,
                setScreenSharingId,
                callsRef,
                me,
            });
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

        displayStream.getVideoTracks()[0].onended = () => {
            if (cameraStream)
                switchStream({
                    newStream: cameraStream,
                    isScreen: false,
                    setStream,
                    setScreenSharingId,
                    callsRef,
                    me,
                });
            setScreenSharingId("");
        };
    }
};
