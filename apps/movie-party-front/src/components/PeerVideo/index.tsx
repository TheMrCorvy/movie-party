import { useEffect, useRef, useState, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./styles";
import GlassButton from "../GlassButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import { emitToggleCamera } from "../../services/peerCameraService";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import Peer from "peerjs";
import { startCall } from "../../services/callsService";
import fakeTimeout from "../../utils/fakeTimeout";
import { getUserCamera, stopAllTracks } from "../../utils/accessUserHardware";
import { logData } from "@repo/shared-utils/log-data";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import useNotificationSound, {
    NotificationSounds,
} from "../../hooks/useNotificationSound";
import { useGlassToast } from "../../context/GlassToastContext";

interface PeerVideoProps {
    stream?: MediaStream | null;
    peerName: string;
    isMyCamera: boolean;
    me: Peer | null;
}

const PeerVideo: FC<PeerVideoProps> = ({
    stream,
    peerName,
    isMyCamera,
    me,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraIsOn, setCameraIsOn] = useState(false);
    const { dispatch, room, ws } = useRoom();
    const otherParticipants = [...room.participants].filter(
        (participant) => participant.id !== room.myId
    );
    const { playSound } = useNotificationSound();
    const { dispatch: dispatchToast } = useGlassToast();

    useEffect(() => {
        logData({
            title: "Re-render in PeerVideo",
            layer: "camera",
            timeStamp: true,
            data: { stream, me, cameraIsOn },
            type: "info",
        });
        if (videoRef.current) {
            videoRef.current.srcObject = stream || null;
        }

        if (cameraIsOn && stream && me) {
            logData({
                title: "I am calling everyone",
                layer: "camera_caller",
                timeStamp: true,
                data: { stream, me, cameraIsOn },
                type: "info",
            });

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
                        payload: params,
                    });
                },
                otherParticipants,
                me,
                stream: stream,
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
        }
    }, [stream, me, cameraIsOn]); // eslint-disable-line react-hooks/exhaustive-deps

    const {
        videoContainerStyles,
        videoStyles,
        peerLabelStyles,
        peerTextStyles,
    } = styles();

    const toggleCamera = async () => {
        if (cameraIsOn) {
            stopAllTracks(stream);

            setCameraIsOn(false);
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

            fakeTimeout(2000).then(() => setCameraIsOn(true));
        } catch (error) {
            dispatchToast({
                type: "SHOW_TOAST",
                payload: {
                    message:
                        "Error: la cámara o el micrófono no están disponibles para utilizar.",
                    severity: "error",
                },
            });
            console.error("getUserMedia error:", error);
        }
    };

    const endCall = async () => {
        stopAllTracks(stream);
        setCameraIsOn(false);
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

    return (
        <Box sx={videoContainerStyles}>
            {stream && (
                <Box
                    component="video"
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isMyCamera}
                    sx={videoStyles}
                />
            )}

            <Box sx={peerLabelStyles}>
                <Typography variant="caption" sx={peerTextStyles}>
                    {peerName}
                </Typography>
                {isMyCamera && (
                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                        }}
                    >
                        <GlassButton variant="icon-btn" onClick={toggleCamera}>
                            {cameraIsOn ? (
                                <VideocamOffIcon />
                            ) : (
                                <VideocamIcon />
                            )}
                        </GlassButton>
                        <GlassButton variant="icon-btn" onClick={endCall}>
                            <PhoneDisabledIcon />
                        </GlassButton>
                    </div>
                )}
            </Box>
        </Box>
    );
};

export default PeerVideo;
