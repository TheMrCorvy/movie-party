import { ChangeEvent, type FC, useState } from "react";
import { useContext } from "react";

import { RoomContext } from "../../context/RoomContext/RoomContext";

import Container from "@mui/material/Container";

import { Signals } from "@repo/type-definitions/rooms";
import GlassContainer from "../GlassContainer";
import styles from "./styles";
import GlassButton from "../GlassButton";
import GlassInput from "../GlassInput";

const CreateRoom: FC = () => {
    const context = useContext(RoomContext);
    const [peerName, setPeerName] = useState("");

    if (!context) {
        return <div>Loading...</div>;
    }

    const createRoom = () => {
        context.setMyName(peerName);
        context.ws.emit(Signals.CREATE_ROOM);
        console.log(context.myName);
    };

    const { mainContainer } = styles();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setPeerName(e.target.value);
    };

    return (
        <Container maxWidth="xl" sx={mainContainer}>
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

export default CreateRoom;
