import { useEffect, useRef, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./styles";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import Fab from "@mui/material/Fab";

interface PeerVideoProps {
    stream?: MediaStream | null;
    peerName: string;
    isMyCamera: boolean;
    useFullHeight: boolean;
    screenSharingTime: boolean;
    useFullWidth: boolean;
}

const PeerVideo: FC<PeerVideoProps> = ({
    stream,
    peerName,
    isMyCamera,
    useFullHeight,
    useFullWidth,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const {
        videoContainerStyles,
        videoStyles,
        peerLabelStyles,
        peerTextStyles,
    } = styles();

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream || null;
        }
    }, [stream]);

    return (
        <Box
            sx={{
                ...videoContainerStyles,
                width: useFullWidth ? "100%" : "200px",
                height: useFullHeight ? "100%" : "45%",
            }}
        >
            {stream ? (
                <Box
                    component="video"
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isMyCamera}
                    sx={{
                        ...videoStyles,
                    }}
                />
            ) : useFullWidth ? (
                <Box
                    height="100%"
                    width="100%"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                        verticalAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <Fab disabled>
                        <VideocamOffIcon />
                    </Fab>
                </Box>
            ) : null}

            <Box
                sx={{
                    ...peerLabelStyles,
                    position: useFullWidth ? "absolute" : undefined,
                }}
            >
                <Typography variant="caption" sx={peerTextStyles}>
                    {peerName}
                </Typography>
            </Box>
        </Box>
    );
};

export default PeerVideo;
