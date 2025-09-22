import { useEffect, type FC } from "react";
import { Container, Grid, Typography } from "@mui/material";
import Chat from "../components/Chat";
import {
    roomContainerStyles,
    roomGridContainerStyles,
    roomMainContentStyles,
    roomChatSectionStyles,
} from "../styles/pages";
import GlassContainer from "../components/GlassContainer";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import {
    UpdateParticipantsCallback,
    updateParticipantsService,
} from "../services/updateParticipantsService";
import { ActionTypes } from "../context/RoomContext/roomActions";
import GlassButton from "../components/GlassButton";

const Room: FC = () => {
    const { ws, room, dispatch } = useRoom();

    const handleParticipantsUpdate = (params: UpdateParticipantsCallback) => {
        if (room.id === params.roomId) {
            dispatch({
                type: ActionTypes.UPDATE_PARTICIPANTS,
                payload: params.participants,
            });
        }
    };

    useEffect(() => {
        const unmountEventListener = updateParticipantsService({
            ws,
            callback: handleParticipantsUpdate,
        });

        return () => {
            unmountEventListener();
        };
    }, [ws]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                "http://localhost:5173/join-room/" + room.id
            );
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <Container maxWidth="xl" sx={roomContainerStyles}>
            <Grid container sx={roomGridContainerStyles}>
                <Grid
                    size={{
                        xs: 12,
                        md: 9,
                    }}
                    sx={roomMainContentStyles}
                >
                    <GlassContainer width={"100%"}>
                        <Typography variant="h3" component="h1" gutterBottom>
                            Room page
                        </Typography>
                        <GlassButton onClick={handleCopy}>
                            Compartir sala
                        </GlassButton>
                    </GlassContainer>
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        md: 3,
                    }}
                    sx={roomChatSectionStyles}
                >
                    <Chat />
                </Grid>
            </Grid>
        </Container>
    );
};
export default Room;
