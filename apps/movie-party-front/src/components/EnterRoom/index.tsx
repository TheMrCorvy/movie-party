import { ChangeEvent, type FC } from "react";

// import { RoomContext } from "../../context/RoomContext/RoomContext";

import Container from "@mui/material/Container";

import GlassContainer from "../GlassContainer";
import styles from "./styles";
import GlassButton from "../GlassButton";
import GlassInput from "../GlassInput";

const CreateRoom: FC = () => {
    // const context = useContext(RoomContext);

    // if (!context) {
    //     return <div>Loading...</div>;
    // }

    const createRoom = () => {
        // console.log(context.myName);
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
