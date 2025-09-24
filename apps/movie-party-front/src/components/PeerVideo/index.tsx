import { Dispatch, useEffect, useRef, useState, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./styles";
import GlassButton from "../GlassButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { ActionTypes, RoomAction } from "../../context/RoomContext/roomActions";

interface PeerVideoProps {
    stream?: MediaStream | null;
    peerName: string;
    peerId: string;
    isMyCamera: boolean;
    dispatch: Dispatch<RoomAction>;
}

const PeerVideo: FC<PeerVideoProps> = ({
    stream,
    peerName,
    isMyCamera,
    dispatch,
    peerId,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraIsOn, setCameraIsOn] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream || null;
        }
    }, [stream]);

    const {
        videoContainerStyles,
        videoStyles,
        peerLabelStyles,
        peerTextStyles,
    } = styles();

    const toggleCamera = async () => {
        if (cameraIsOn) {
            stream?.getTracks().forEach((track) => track.stop());
            setCameraIsOn(false);
            dispatch({
                type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                payload: {
                    peerId,
                    stream: null,
                },
            });
        } else {
            try {
                const camStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
                setCameraIsOn(true);
                dispatch({
                    type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                    payload: {
                        peerId,
                        stream: camStream,
                    },
                });
            } catch (error) {
                console.error("getUserMedia error:", error);
            }
        }
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
                    <GlassButton variant="icon-btn" onClick={toggleCamera}>
                        {cameraIsOn ? <VideocamOffIcon /> : <VideocamIcon />}
                    </GlassButton>
                )}
            </Box>
        </Box>
    );
};

export default PeerVideo;
