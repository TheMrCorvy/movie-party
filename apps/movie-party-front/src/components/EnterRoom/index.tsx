import { ChangeEvent, useEffect, useState, type FC } from "react";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import Container from "@mui/material/Container";
import GlassContainer from "../GlassContainer";
import styles from "./styles";

import GlassButton from "../GlassButton";
import GlassInput from "../GlassInput";
import {
    createRoomService,
    roomWasCreated,
} from "../../services/createRoomService";
// import { ActionTypes } from "../../context/RoomContext/roomReducer";

const CreateRoom: FC = () => {
    const [myName, setMyName] = useState("");
    const { ws } = useRoom();

    const createRoom = () => {
        if (!ws) {
            console.log("websocket not found");
            return;
        }
        createRoomService({
            ws,
            peerName: myName,
        });
        // dispatch({ type: ActionTypes.SET_ROOM_ID, payload: newRoom });
    };

    const { mainContainer } = styles();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setMyName(e.target.value);
    };

    useEffect(() => {
        // hay que escuchar por el evento room created
        if (!ws) return;

        const removeEventListener = roomWasCreated({
            ws,
            callback: (params: any) => console.log(params),
        });

        return () => removeEventListener();
    }, [ws]);

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
