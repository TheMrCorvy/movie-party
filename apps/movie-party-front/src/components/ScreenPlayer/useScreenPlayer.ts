import { RefObject, useEffect, useRef, useState } from "react";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import {
    listenScreenShareService,
    screenShareServcie,
} from "../../services/screenSharingService";
import { getUserScreen, stopAllTracks } from "../../utils/accessUserHardware";
import { startCall } from "../../services/callsService";
import { logData } from "@repo/shared-utils/log-data";
import { ScreenPlayerProps } from ".";
import { LocalRoom } from "../../context/RoomContext/roomReducer";

interface UseScreenPlayerResult {
    screenStream: MediaStream | undefined;
    room: LocalRoom;
    videoRef: RefObject<HTMLVideoElement | null>;
    shareScreen: () => Promise<void>;
}

type UseScreenPlayer = (props: ScreenPlayerProps) => UseScreenPlayerResult;

const useScreenPlayer: UseScreenPlayer = ({
    remoteScreen,
    me,
    clearRemoteScreen,
}) => {
    const { room, dispatch, ws } = useRoom();
    const [screenStream, setScreenStream] = useState<MediaStream>();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && screenStream) {
            videoRef.current.srcObject = screenStream;
            logData({
                title: "Local stream received",
                layer: "screen_sharing",
                timeStamp: true,
                type: "info",
                data: screenStream,
            });
            return;
        }

        if (videoRef.current && remoteScreen && !screenStream) {
            videoRef.current.srcObject = remoteScreen;
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
            screenShareServcie({
                roomId: room.id,
                peerId: room.myId,
                ws,
                status: false,
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

        screenShareServcie({
            roomId: room.id,
            peerId: room.myId,
            ws,
            status: true,
        });
    };

    useEffect(() => {
        const removeScreenSharingEventListener = listenScreenShareService({
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
                if (!params.status) {
                    clearRemoteScreen();
                }
            },
        });
        return () => {
            removeScreenSharingEventListener();
        };
    }, [screenStream, ws]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        screenStream,
        room,
        videoRef,
        shareScreen,
    };
};

export default useScreenPlayer;
