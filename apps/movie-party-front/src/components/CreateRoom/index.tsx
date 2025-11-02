import { ChangeEvent, useState, type FC } from "react";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import Container from "@mui/material/Container";
import GlassContainer from "../GlassContainer";
import styles from "./styles";

import GlassButton from "../GlassButton";
import GlassInput from "../GlassInput";
import { createRoomService } from "../../services/createRoomService";
import { logData } from "@repo/shared-utils/log-data";
import { generateId } from "@repo/shared-utils";

const CreateRoom: FC = () => {
    const [myName, setMyName] = useState("");
    const { ws } = useRoom();
    const { mainContainer } = styles();
    const [roomPassword, setRoomPassword] = useState("");
    const [addPassword, setAddPassword] = useState(false);

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
            peerId: generateId(),
            password: roomPassword,
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.name === "name") {
            setMyName(e.target.value);
            return;
        }

        setRoomPassword(e.target.value);
    };

    return (
        <Container maxWidth="xl" sx={mainContainer}>
            <GlassContainer>
                <GlassInput
                    type="text"
                    kind="text input"
                    size="medium"
                    label="Nombre"
                    name="name"
                    onChange={handleChange}
                />
                <GlassButton onClick={() => setAddPassword(!addPassword)}>
                    {addPassword
                        ? "Quitar contraseña de sala"
                        : "Añadir contraseña a la sala"}
                </GlassButton>
                {addPassword && (
                    <GlassInput
                        type="password"
                        kind="text input"
                        label="Contraseña"
                        size="medium"
                        name="password"
                        onChange={handleChange}
                    />
                )}
                <GlassButton onClick={createRoomSubmit}>
                    Ingresar a la sala de conferencias
                </GlassButton>
            </GlassContainer>
        </Container>
    );
};

export default CreateRoom;
