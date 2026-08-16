import { type FC } from "react";
import GlassButton from "../GlassButton";
import useScreenPlayer from "./useScreenPlayer";
import { useTranslation } from "@salvatore.hakase/hgts/react";

export interface ScreenPlayerProps {
    remoteScreen?: MediaStream | null;
    clearRemoteScreen: () => void;
}

const ScreenPlayer: FC<ScreenPlayerProps> = ({
    remoteScreen,
    clearRemoteScreen,
}) => {
    const { t } = useTranslation();
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
                    ? t("screenShare.stop")
                    : t("screenShare.start")}
            </GlassButton>
        </>
    );
};
export default ScreenPlayer;
