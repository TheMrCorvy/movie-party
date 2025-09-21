import { ChangeEvent, type FC } from "react";

import Container from "@mui/material/Container";

import GlassContainer from "../components/GlassContainer";
import GlassButton from "../components/GlassButton";
import GlassInput from "../components/GlassInput";

const JoinRoom: FC = () => {
    return (
        <Container maxWidth="xl">
            <GlassContainer>
                <GlassInput
                    type="text"
                    kind="text input"
                    size="small"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        console.log(e.target.value);
                    }}
                />
                <GlassButton onClick={() => console.log("create room")}>
                    Create Room
                </GlassButton>
            </GlassContainer>
        </Container>
    );
};

export default JoinRoom;
