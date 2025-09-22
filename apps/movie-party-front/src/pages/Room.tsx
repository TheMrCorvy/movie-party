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
import { enterRoomService } from "../services/enterRoomService";
import {
    UpdateParticipantsCallback,
    updateParticipantsService,
} from "../services/updateParticipantsService";
import { ActionTypes } from "../context/RoomContext/roomActions";

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
        enterRoomService({
            peerId: room.myId,
            peerName:
                room.participants.find((peer) => peer.id === room.myId)?.name ||
                "Invitado",
            roomId: room.id,
            ws,
        });

        const unmountEventListener = updateParticipantsService({
            ws,
            callback: handleParticipantsUpdate,
        });

        return () => {
            unmountEventListener();
        };
    }, [ws, room]); // eslint-disable-line react-hooks/exhaustive-deps

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
