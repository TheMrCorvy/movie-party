import { useEffect, useRef, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./styles";

interface PeerVideoProps {
    stream?: MediaStream | null;
    peerName: string;
    isMyCamera: boolean;
    isLgUp: boolean;
}

const PeerVideo: FC<PeerVideoProps> = ({
    stream,
    peerName,
    isMyCamera,
    isLgUp,
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
        <Box sx={{ ...videoContainerStyles, width: isLgUp ? "200px" : "93%" }}>
            {stream && (
                <Box
                    component="video"
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isMyCamera}
                    sx={{
                        ...videoStyles,
                        maxHeight: isLgUp || isMyCamera ? "200px" : "auto",
                    }}
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
