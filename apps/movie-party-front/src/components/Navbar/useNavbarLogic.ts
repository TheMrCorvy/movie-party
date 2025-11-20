import useNotificationSound, {
    NotificationSounds,
} from "../../hooks/useNotificationSound";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { getUserCamera, stopAllTracks } from "../../utils/accessUserHardware";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import { emitToggleCamera } from "../../services/peerCameraService";
import { useGlassToast } from "../../context/GlassToastContext";
import fakeTimeout from "../../utils/fakeTimeout";

const useNavbarLogic = () => {
    const { room, ws, dispatch } = useRoom();
    const { playSound } = useNotificationSound();
    const { dispatch: dispatchToast } = useGlassToast();

    const toggleCamera = async () => {
        if (room.myCameraIsOn) {
            stopAllTracks(room.participants[0].stream);
            dispatch({
                type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                payload: {
                    peerId: room.myId,
                    stream: null,
                    myCameraIsOn: false,
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
            dispatch({
                type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                payload: {
                    peerId: room.myId,
                    stream: camStream,
                    myCameraIsOn: true,
                },
            });
            emitToggleCamera({
                roomId: room.id,
                peerId: room.myId,
                cameraStatus: true,
                ws,
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
        dispatch({
            type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
            payload: {
                peerId: room.myId,
                stream: null,
                myCameraIsOn: false,
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

    return { toggleCamera, endCall, cameraOn: room.myCameraIsOn };
};

export default useNavbarLogic;
