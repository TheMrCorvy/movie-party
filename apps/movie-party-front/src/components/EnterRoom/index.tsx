import { ChangeEvent, type FC } from "react";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import Container from "@mui/material/Container";
import GlassContainer from "../GlassContainer";
import styles from "./styles";
import GlassButton from "../GlassButton";
import GlassInput from "../GlassInput";
// import { ActionTypes } from "../../context/RoomContext/roomReducer";
import { Signals } from "@repo/type-definitions/rooms";

const CreateRoom: FC = () => {
    const { ws } = useRoom();

    const createRoom = () => {
        if (!ws) {
            console.log("websocket not found");
            return;
        }
        // const newRoom = {
        //     ...room,
        //     id: "new-room-id",
        // };
        ws.emit(Signals.CREATE_ROOM);
        // dispatch({ type: ActionTypes.SET_ROOM_ID, payload: newRoom });
    };

    const { mainContainer } = styles();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
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
