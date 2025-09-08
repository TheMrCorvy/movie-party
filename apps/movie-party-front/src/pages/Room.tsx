import { useContext, useEffect, type FC } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { Signals } from "@repo/type-definitions/rooms";
import { Container } from "@mui/material";
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

                <div style={{ marginBottom: "20px" }}>
                    <h3>Your Video</h3>
                    {context.stream && (
                        <VideoPlayerComponent stream={context.stream} />
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
                        {peersArr.length < 1 ? (
                            <p>loading...</p>
                        ) : (
                            peersArr.map(([peerId, peer]) => (
                                <PeerVideo
                                    key={peerId}
                                    peerId={peerId}
                                    stream={peer.stream}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};
export default Room;
