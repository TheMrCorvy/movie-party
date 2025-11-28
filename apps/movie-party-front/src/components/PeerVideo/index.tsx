import { useEffect, useRef, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./styles";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import Fab from "@mui/material/Fab";

interface PeerVideoProps {
    videoStream?: MediaStream | null;
    audioStream?: MediaStream | null;
    peerName: string;
    isMyCamera: boolean;
    useFullHeight: boolean;
    screenSharingTime: boolean;
    useFullWidth: boolean;
}

const PeerVideo: FC<PeerVideoProps> = ({
    videoStream,
    audioStream,
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
            const combinedStream = new MediaStream();

            if (videoStream) {
                videoStream
                    .getVideoTracks()
                    .forEach((track) => combinedStream.addTrack(track));
            }

            if (audioStream) {
                audioStream
                    .getAudioTracks()
                    .forEach((track) => combinedStream.addTrack(track));
            }

            videoRef.current.srcObject =
                combinedStream.getTracks().length > 0 ? combinedStream : null;
        }
    }, [videoStream, audioStream]);

    return (
        <Box
            sx={{
                ...videoContainerStyles,
                width: useFullWidth ? "100%" : "200px",
                height: useFullHeight ? "100%" : "45%",
            }}
        >
            {videoStream || audioStream ? (
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
