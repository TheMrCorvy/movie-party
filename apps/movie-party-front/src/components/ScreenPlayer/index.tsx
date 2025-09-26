import { useEffect, useRef, useState, type FC } from "react";
import GlassButton from "../GlassButton";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import { screenShareServcie } from "../../services/screenSharingService";
import { getUserScreen, stopAllTracks } from "../../utils/accessUserHardware";
import Peer from "peerjs";
import { startCall } from "../../services/callsService";

export interface ScreenPlayerProps {
    me: Peer;
    remoteScreen?: MediaStream | null;
}

const ScreenPlayer: FC<ScreenPlayerProps> = ({ me, remoteScreen }) => {
    const { room, dispatch, ws } = useRoom();
    const [screenStream, setScreenStream] = useState<MediaStream>();
    const videoref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoref.current && screenStream) {
            videoref.current.srcObject = screenStream;
            return;
        }

        if (videoref.current && remoteScreen && !screenStream) {
            videoref.current.srcObject = remoteScreen;
            return;
        }
    }, [screenStream, remoteScreen]);

    const shareScreen = async () => {
        if (screenStream) {
            setScreenStream(undefined);
            dispatch({
                type: ActionTypes.TOGGLE_SCREEN_SHARING,
                payload: "",
            });
            stopAllTracks(screenStream);
            return;
        }

        const displayStream = await getUserScreen();

        setScreenStream(displayStream);
        dispatch({
            type: ActionTypes.TOGGLE_SCREEN_SHARING,
            payload: room.myId,
        });

        startCall({
            me,
            callback: (params) => console.log(params),
            otherParticipants: room.participants.filter(
                (p) => p.id !== room.myId
            ),
            stream: displayStream,
            streamType: "screen",
        });
    };

    useEffect(() => {
        const removeScreenSharingEventListener = screenShareServcie({
            roomId: room.id,
            peerId: room.myId,
            ws,
            status: screenStream ? true : false,
            callback: (params) =>
                dispatch({
                    type: ActionTypes.TOGGLE_SCREEN_SHARING,
                    payload: params.status ? params.peerId : "",
                }),
        });

        return () => {
            removeScreenSharingEventListener();
        };
    }, [screenStream, ws]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {(screenStream || remoteScreen) && (
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
