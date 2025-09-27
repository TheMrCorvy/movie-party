import { useEffect, useRef, useState, type FC } from "react";
import GlassButton from "../GlassButton";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import { screenShareServcie } from "../../services/screenSharingService";
import { getUserScreen, stopAllTracks } from "../../utils/accessUserHardware";
import Peer from "peerjs";
import { startCall } from "../../services/callsService";
import { logData } from "@repo/shared-utils/log-data";

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
            logData({
                title: "Local stream received",
                layer: "screen_sharing",
                timeStamp: true,
                type: "info",
                data: screenStream,
            });
            return;
        }

        if (videoref.current && remoteScreen && !screenStream) {
            videoref.current.srcObject = remoteScreen;
            logData({
                title: "Remote stream received",
                layer: "screen_sharing",
                timeStamp: true,
                type: "info",
                data: remoteScreen,
            });
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
            logData({
                title: "Stopped screen sharing",
                layer: "screen_sharing",
                timeStamp: true,
                type: "info",
                data: remoteScreen,
            });
            return;
        }

        const displayStream = await getUserScreen();

        setScreenStream(displayStream);

        logData({
            title: "Started screen sharing",
            layer: "screen_sharing",
            timeStamp: true,
            type: "info",
            data: screenStream,
        });

        dispatch({
            type: ActionTypes.TOGGLE_SCREEN_SHARING,
            payload: room.myId,
        });

        logData({
            title: "Sending screen",
            layer: "screen_sharing_sender",
            timeStamp: true,
            type: "info",
            data: screenStream,
        });

        startCall({
            me,
            callback: (params) =>
                logData({
                    title: "Someone answered the screen-sharing call",
                    data: params,
                    layer: "screen_sharing_receiver",
                    timeStamp: true,
                    type: "info",
                }),
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
            callback: (params) => {
                logData({
                    layer: "screen_sharing",
                    title: "Received notification from ws server",
                    type: "info",
                    timeStamp: true,
                    data: {
                        ...params,
                        info: "This notification came from the ws socket backend and means that someone started sharing their screen.",
                    },
                });
                dispatch({
                    type: ActionTypes.TOGGLE_SCREEN_SHARING,
                    payload: params.status ? params.peerId : "",
                });
            },
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
