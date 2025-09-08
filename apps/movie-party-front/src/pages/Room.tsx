import { useContext, useEffect, type FC } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { Signals } from "@repo/type-definitions/rooms";
import { Container } from "@mui/material";
import VideoPlayerComponent from "../components/VideoPlayerComponent";

const Room: FC = () => {
    const { roomId } = useParams();
    const { ws, me, stream } = useContext(RoomContext);

    useEffect(() => {
        if (roomId && me) {
            ws.emit(Signals.ENTER_ROOM, { roomId, peerId: me._id });
        }
    }, [roomId, ws, me]);

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
            <div>
                <h1>Room</h1>
                <p>Room ID: {roomId}</p>
                <VideoPlayerComponent stream={stream} />
            </div>
        </Container>
    );
};
export default Room;
