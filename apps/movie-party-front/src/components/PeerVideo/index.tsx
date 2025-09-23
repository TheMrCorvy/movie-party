import { useEffect, useRef, useState, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./styles";
import GlassButton from "../GlassButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

interface PeerVideoProps {
    stream?: MediaStream;
    peerName: string;
    isMyCamera: boolean;
}

const PeerVideo: FC<PeerVideoProps> = ({ stream, peerName, isMyCamera }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraIsOn, setCameraIsOn] = useState(false);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

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
                    sx={videoStyles}
                />
            )}

            <Box sx={peerLabelStyles}>
                <Typography variant="caption" sx={peerTextStyles}>
                    {peerName}
                </Typography>
                {isMyCamera && (
                    <GlassButton
                        variant="icon-btn"
                        onClick={() => setCameraIsOn(!cameraIsOn)}
                    >
                        {cameraIsOn ? <VideocamOffIcon /> : <VideocamIcon />}
                    </GlassButton>
                )}
            </Box>
        </Box>
    );
};

export default PeerVideo;
