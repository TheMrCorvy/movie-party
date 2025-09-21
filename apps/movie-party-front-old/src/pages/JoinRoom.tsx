import { ChangeEvent, type FC } from "react";
import { useContext } from "react";

import { RoomContext } from "../context/RoomContext/RoomContext";

import Container from "@mui/material/Container";

import { Signals } from "@repo/type-definitions/rooms";
import GlassContainer from "../components/GlassContainer";
import GlassButton from "../components/GlassButton";
import GlassInput from "../components/GlassInput";
import { useNavigate, useParams } from "react-router-dom";

const JoinRoom: FC = () => {
    const context = useContext(RoomContext);
    const { roomId } = useParams();
    const navigate = useNavigate();

    if (!context) {
        return <div>Loading...</div>;
    }

    const createRoom = () => {
        if (context && roomId && context.me && context.myName) {
            context.ws.emit(Signals.ENTER_ROOM, {
                roomId,
                peerId: context.me.id,
                peerName: context.myName,
            });
            navigate(`/room/${roomId}`);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        context.setMyName(e.target.value);
    };

    return (
        <Container maxWidth="xl">
            <GlassContainer>
                <GlassInput
                    type="text"
                    kind="text input"
                    size="small"
                    onChange={handleChange}
                />
                <GlassButton onClick={createRoom}>Create Room</GlassButton>
            </GlassContainer>
        </Container>
    );
};

export default JoinRoom;
