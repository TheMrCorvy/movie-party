import { useEffect, useRef, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./styles";

interface PeerVideoProps {
    stream: MediaStream;
    peerId: string;
}

const PeerVideo: FC<PeerVideoProps> = ({ stream, peerId }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

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
            <Box
                component="video"
                ref={videoRef}
                autoPlay
                playsInline
                sx={videoStyles}
            />
            <Box sx={peerLabelStyles}>
                <Typography variant="caption" sx={peerTextStyles}>
                    Peer: {peerId.substring(0, 8)}...
                </Typography>
            </Box>
        </Box>
    );
};

export default PeerVideo;
