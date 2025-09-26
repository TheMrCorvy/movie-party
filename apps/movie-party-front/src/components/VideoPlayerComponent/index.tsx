import { useEffect, useRef, useState, type FC } from "react";
import GlassButton from "../GlassButton";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { ActionTypes } from "../../context/RoomContext/roomActions";

const VideoPlayerComponent: FC = () => {
    const { room, dispatch } = useRoom();
    const [screenStream, setScreenStream] = useState<MediaStream>();
    const videoref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoref.current && screenStream) {
            videoref.current.srcObject = screenStream;
        }
    }, [screenStream]);

    const shareScreen = async () => {
        if (screenStream) {
            setScreenStream(undefined);
            dispatch({
                type: ActionTypes.TOGGLE_SCREEN_SHARING,
                payload: "",
            });
            return;
        }

        const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false, // to do: implement FF
        });

        setScreenStream(displayStream);
        dispatch({
            type: ActionTypes.TOGGLE_SCREEN_SHARING,
            payload: room.myId,
        });
    };

    useEffect(() => {
        console.log(room.peerSharingScreen);
    }, [room.peerSharingScreen]);

    return (
        <>
            {screenStream && (
                <video
                    style={{
                        maxHeight: "45vh",
                        objectFit: "cover",
                    }}
                    autoPlay
                    ref={videoref}
                />
            )}
            <GlassButton
                onClick={shareScreen}
                disabled={screenStream && room.myId !== room.peerSharingScreen}
            >
                {screenStream && room.myId === room.peerSharingScreen
                    ? "Dejar de compartir pantalla"
                    : "Compartir pantalla"}
            </GlassButton>
        </>
    );
};
export default VideoPlayerComponent;
