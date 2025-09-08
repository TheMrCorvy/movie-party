import { useEffect, useRef, type FC } from "react";

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

    return (
        <div
            style={{
                display: "inline-block",
                margin: "10px",
                border: "2px solid #333",
                borderRadius: "8px",
                overflow: "hidden",
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                    width: "300px",
                    height: "200px",
                    objectFit: "cover",
                }}
            />
            <div
                style={{
                    padding: "5px",
                    backgroundColor: "#333",
                    color: "white",
                    fontSize: "12px",
                    textAlign: "center",
                }}
            >
                Peer: {peerId.substring(0, 8)}...
            </div>
        </div>
    );
};

export default PeerVideo;
