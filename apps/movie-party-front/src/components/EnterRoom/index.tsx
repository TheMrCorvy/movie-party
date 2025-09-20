import type { FC } from "react";
import { useContext } from "react";

import { RoomContext } from "../../context/RoomContext";

import Container from "@mui/material/Container";

import { Signals } from "@repo/type-definitions/rooms";
import GlassContainer from "../GlassContainer";
import styles from "./styles";
import GlassButton from "../GlassButton";

const CreateRoom: FC = () => {
    const context = useContext(RoomContext);

    if (!context) {
        return <div>Loading...</div>;
    }

    const { ws } = context;

    const createRoom = () => {
        ws.emit(Signals.CREATE_ROOM);
    };

    const { mainContainer } = styles();

    return (
        <Container maxWidth="xl" sx={mainContainer}>
            <GlassContainer>
                <GlassButton onClick={createRoom}>Create Room</GlassButton>
            </GlassContainer>
        </Container>
    );
};

export default CreateRoom;
