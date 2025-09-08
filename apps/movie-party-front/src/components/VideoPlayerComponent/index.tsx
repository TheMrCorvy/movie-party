import { useEffect, useRef, type FC } from "react";

interface props {
    stream: MediaStream;
}

const VideoPlayerComponent: FC<props> = ({ stream }) => {
    const videoref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoref.current) {
            videoref.current.srcObject = stream;
        }
    }, [stream]);
    return <video autoPlay ref={videoref} />;
};
export default VideoPlayerComponent;
