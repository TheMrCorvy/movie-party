import { type FC } from "react";
import { Button, Container } from "@mui/material";
import VideoPlayerComponent from "../components/VideoPlayerComponent";
import PeerVideo from "../components/PeerVideo";
import { useRoom } from "../hooks/useRoom";

const Room: FC = () => {
    const {
        loading,
        roomId,
        shareScreen,
        videoStream,
        ownCamera,
        filteredPeersArr,
        peers,
        peersArr,
    } = useRoom();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container
            maxWidth="xl"
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
            }}
        >
            <div style={{ textAlign: "center" }}>
                <h1>Room</h1>
                <p>Room ID: {roomId}</p>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={shareScreen}
                >
                    Share screen
                </Button>

                <div style={{ marginBottom: "20px" }}>
                    <h3>Your Video</h3>
                    {videoStream && (
                        <VideoPlayerComponent stream={videoStream} />
                    )}
                </div>

                <div>
                    <h3>Connected Peers: {Object.keys(peers).length}</h3>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        {peersArr.length < 1 && !ownCamera ? (
                            <p>loading...</p>
                        ) : (
                            <>
                                {ownCamera && (
                                    <PeerVideo
                                        key={ownCamera.peerId}
                                        peerId={ownCamera.peerId}
                                        stream={ownCamera.stream}
                                    />
                                )}
                                {filteredPeersArr.map(([peerId, peer]) => (
                                    <PeerVideo
                                        key={peerId}
                                        peerId={peerId}
                                        stream={peer.stream}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};
export default Room;
