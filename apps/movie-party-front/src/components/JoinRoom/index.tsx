import { type FC } from "react";

import Container from "@mui/material/Container";

import GlassContainer from "../GlassContainer";
import { Typography } from "@mui/material";

import EnterRoom from "../EnterRoom";
import useJoinRoom from "./useJoinRoom";

const JoinRoom: FC = () => {
    const { roomExists, roomId } = useJoinRoom();

    return (
        <Container
            maxWidth="xl"
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <GlassContainer>
                {!roomId ? (
                    <Typography>Loading...</Typography>
                ) : (
                    <EnterRoom
                        roomHasPassword={roomExists.password}
                        roomExists={roomExists.roomExists}
                    />
                )}
            </GlassContainer>
        </Container>
    );
};

export default JoinRoom;
