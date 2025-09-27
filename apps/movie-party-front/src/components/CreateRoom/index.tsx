import { ChangeEvent, useState, type FC } from "react";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import Container from "@mui/material/Container";
import GlassContainer from "../GlassContainer";
import styles from "./styles";

import GlassButton from "../GlassButton";
import GlassInput from "../GlassInput";
import { createRoomService } from "../../services/createRoomService";
import { logData } from "@repo/shared-utils/log-data";

const CreateRoom: FC = () => {
    const [myName, setMyName] = useState("");
    const { ws } = useRoom();
    const { mainContainer } = styles();

    const createRoomSubmit = () => {
        logData({
            data: "Creating room...",
            layer: "room_ws",
            timeStamp: true,
            type: "info",
        });
        createRoomService({
            ws,
            peerName: myName,
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setMyName(e.target.value);
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
                <GlassButton onClick={createRoomSubmit}>
                    Create Room
                </GlassButton>
            </GlassContainer>
        </Container>
    );
};

export default CreateRoom;
