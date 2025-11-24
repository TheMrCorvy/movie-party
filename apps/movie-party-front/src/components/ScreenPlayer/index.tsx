import { type FC } from "react";
import GlassButton from "../GlassButton";
import useScreenPlayer from "./useScreenPlayer";

export interface ScreenPlayerProps {
    remoteScreen?: MediaStream | null;
    clearRemoteScreen: () => void;
}

const ScreenPlayer: FC<ScreenPlayerProps> = ({
    remoteScreen,
    clearRemoteScreen,
}) => {
    const { screenStream, videoRef, shareScreen, room } = useScreenPlayer({
        remoteScreen,
        clearRemoteScreen,
    });

    return (
        <>
            {(screenStream || remoteScreen) && (
                <video
                    style={{
                        maxHeight: "45vh",
                        objectFit: "cover",
                    }}
                    autoPlay
                    ref={videoRef}
                />
            )}
            <GlassButton
                onClick={shareScreen}
                disabled={
                    room.peerSharingScreen &&
                    room.myId !== room.peerSharingScreen
                        ? true
                        : false
                }
            >
                {screenStream && room.myId === room.peerSharingScreen
                    ? "Dejar de compartir pantalla"
                    : "Compartir pantalla"}
            </GlassButton>
        </>
    );
};
export default ScreenPlayer;
