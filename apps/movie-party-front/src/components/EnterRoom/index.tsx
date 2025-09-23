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
import { ActionTypes } from "../../context/RoomContext/roomActions";

const CreateRoom: FC = () => {
    const [myName, setMyName] = useState("");
    const { ws, dispatch } = useRoom();
    const { mainContainer } = styles();

    const createRoom = () => {
        if (!ws) {
            console.error("Websocket not found");
            return;
        }
        createRoomService({
            ws,
            peerName: myName,
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setMyName(e.target.value);
    };

    useEffect(() => {
        if (!ws) return;

        const removeEventListener = roomWasCreated({
            ws,
            callback: (params) =>
                dispatch({
                    type: ActionTypes.SET_ROOM,
                    payload: {
                        ...params.room,
                        myId: params.room.participants[0].id,
                    },
                }),
        });

        return () => removeEventListener();
    }, [ws]); // eslint-disable-line react-hooks/exhaustive-deps

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
