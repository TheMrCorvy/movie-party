import { useContext, useEffect, type FC } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { Signals } from "@repo/type-definitions/rooms";
import { Button, Container } from "@mui/material";
import VideoPlayerComponent from "../components/VideoPlayerComponent";
import PeerVideo from "../components/PeerVideo";

const Room: FC = () => {
    const { roomId } = useParams();
    const context = useContext(RoomContext);

    useEffect(() => {
        if (context && roomId && context.me) {
            console.log(
                "Entering room:",
                roomId,
                "with peer ID:",
                context.me.id
            );
            context.ws.emit(Signals.ENTER_ROOM, {
                roomId,
                peerId: context.me.id,
            });
        }
    }, [roomId, context?.me?.id, context?.ws]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!context) {
        return <div>Loading...</div>;
    }

    const peersArr = Object.entries(context.peers);
    const video = () => {
        if (context.screenSharingId) {
            if (context.me?.id === context.screenSharingId && context.stream) {
                return context.stream;
            }
            const peer = context.peers[context.screenSharingId];
            if (peer) {
                return peer.stream;
            }
            return undefined;
        }
        if (context.stream) {
            return context.stream;
        }
        return undefined;
    };
    const videoStream = video();

    const shouldShowOwnPeerVideo = () => {
        if (context.screenSharingId) {
            if (!context.me || !context.stream) {
                return false;
            }

            if (context.screenSharingId !== context.me.id) {
                return true;
            }
        }

        return false;
    };

    const ownCamera = shouldShowOwnPeerVideo()
        ? {
              stream: context.stream as MediaStream,
              peerId: context.me!.id,
          }
        : null;

    const filteredPeersArr = peersArr.filter(
        ([peerId]) => peerId !== context.screenSharingId
    );

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
                    onClick={context.shareScreen}
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
                    <h3>
                        Connected Peers: {Object.keys(context.peers).length}
                    </h3>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        {peersArr.length < 1 && !context.screenSharingId ? (
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
