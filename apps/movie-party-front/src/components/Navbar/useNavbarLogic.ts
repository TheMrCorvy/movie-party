import useNotificationSound, {
    NotificationSounds,
} from "../../hooks/useNotificationSound";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { getUserCamera, stopAllTracks } from "../../utils/accessUserHardware";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import { emitToggleCamera } from "../../services/peerCameraService";
import { useGlassToast } from "../../context/GlassToastContext";
import fakeTimeout from "../../utils/fakeTimeout";
import { useState } from "react";
import { logData } from "@repo/shared-utils/log-data";
import { startCall } from "../../services/callsService";

const useNavbarLogic = () => {
    const { room, ws, dispatch } = useRoom();
    const { playSound } = useNotificationSound();
    const { dispatch: dispatchToast } = useGlassToast();
    const [cameraOn, setCameraOn] = useState(false);

    const toggleCamera = async () => {
        if (cameraOn) {
            stopAllTracks(room.participants[0].stream);
            setCameraOn(false);
            dispatch({
                type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                payload: {
                    peerId: room.myId,
                    stream: null,
                },
            });
            emitToggleCamera({
                roomId: room.id,
                peerId: room.myId,
                cameraStatus: false,
                ws,
            });
            return;
        }

        try {
            const camStream = await getUserCamera();
            setCameraOn(true);
            dispatch({
                type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                payload: {
                    peerId: room.myId,
                    stream: camStream,
                },
            });
            emitToggleCamera({
                roomId: room.id,
                peerId: room.myId,
                cameraStatus: true,
                ws,
            });
            logData({
                title: "I am calling everyone",
                layer: "camera_caller",
                timeStamp: true,
                data: {
                    stream: camStream,
                    me: undefined,
                    cameraIsOn: cameraOn,
                },
                type: "info",
            });

            const otherParticipants = [...room.participants].filter(
                (participant) => participant.id !== room.myId
            );

            startCall({
                callback: (params) => {
                    logData({
                        title: "Someone answered the call",
                        timeStamp: true,
                        data: params,
                        layer: "camera_receiver",
                        type: "info",
                    });
                    dispatch({
                        type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                        payload: { ...params },
                    });
                },
                otherParticipants,
                me: room.me,
                stream: camStream,
                streamType: "camera",
                errorCallback: (message) =>
                    dispatchToast({
                        type: "SHOW_TOAST",
                        payload: {
                            message,
                            severity: "error",
                        },
                    }),
            });
        } catch (error) {
            dispatchToast({
                type: "SHOW_TOAST",
                payload: {
                    message:
                        "Error: la cámara o el micrófono no están disponibles para utilizarse.",
                    severity: "error",
                },
            });
            console.error("getUserMedia error:", error);
        }
    };

    const endCall = async () => {
        stopAllTracks(room.participants[0].stream);
        setCameraOn(false);
        dispatch({
            type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
            payload: {
                peerId: room.myId,
                stream: null,
            },
        });
        emitToggleCamera({
            roomId: room.id,
            peerId: room.myId,
            cameraStatus: false,
            ws,
        });
        playSound({
            filename: NotificationSounds.LEFT_THE_ROOM,
        });
        await fakeTimeout(1000);
        window.location.href = "/";
    };

    return { toggleCamera, endCall, cameraOn: cameraOn };
};

export default useNavbarLogic;
