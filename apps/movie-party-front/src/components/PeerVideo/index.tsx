import { useEffect, useRef, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./styles";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import Peer from "peerjs";
import { startCall } from "../../services/callsService";
import { logData } from "@repo/shared-utils/log-data";
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
    const { dispatch, room } = useRoom();
    const otherParticipants = [...room.participants].filter(
        (participant) => participant.id !== room.myId
    );
    const { dispatch: dispatchToast } = useGlassToast();

    useEffect(() => {
        logData({
            title: "Re-render in PeerVideo",
            layer: "camera",
            timeStamp: true,
            data: { stream, me, cameraIsOn: room.myCameraIsOn },
            type: "info",
        });
        if (videoRef.current) {
            videoRef.current.srcObject = stream || null;
        }

        if (room.myCameraIsOn && stream && me) {
            logData({
                title: "I am calling everyone",
                layer: "camera_caller",
                timeStamp: true,
                data: { stream, me, cameraIsOn: room.myCameraIsOn },
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
                        payload: { ...params, myCameraIsOn: room.myCameraIsOn },
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
    }, [stream, me, room.myCameraIsOn]); // eslint-disable-line react-hooks/exhaustive-deps

    const {
        videoContainerStyles,
        videoStyles,
        peerLabelStyles,
        peerTextStyles,
    } = styles();

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
            </Box>
        </Box>
    );
};

export default PeerVideo;
