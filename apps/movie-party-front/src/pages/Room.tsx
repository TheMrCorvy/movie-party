import { lazy, Suspense, type FC } from "react";
import { Container, Grid, Skeleton } from "@mui/material";
import GlassContainer from "../components/GlassContainer";
import styles from "../styles/roomPageStyles";
import useRoomLogic from "../hooks/useRoomLogic";
import GlassBottomNavbar from "../components/GlassNavbar";

const Chat = lazy(() => import("../components/Chat"));
const PeerVideo = lazy(() => import("../components/PeerVideo"));
const ScreenPlayer = lazy(() => import("../components/ScreenPlayer"));
const RoomControls = lazy(() => import("../components/RoomControls"));

const Room: FC = () => {
    const {
        roomChatSectionStyles,
        roomContainerStyles,
        roomContainer,
        gridColFlex,
    } = styles();

    const { room, peerConnection, remoteScreen, setremoteScreen } =
        useRoomLogic();

    return (
        <>
            <Container maxWidth="xl" sx={roomContainerStyles}>
                <Grid container sx={roomContainer}>
                    <Grid
                        size={{
                            md: 12,
                            lg: 9,
                        }}
                        sx={gridColFlex}
                    >
                        <Suspense
                            fallback={
                                <Skeleton
                                    variant="rounded"
                                    width="100%"
                                    height={50}
                                />
                            }
                        >
                            <RoomControls />
                        </Suspense>
                        <GlassContainer width={"100%"}>
                            <GlassContainer
                                height={"auto"}
                                width={"100%"}
                                direction="row"
                            >
                                <>
                                    {room.participants.map((participant) => (
                                        <Suspense
                                            key={`peer-video-${participant.id}`}
                                            fallback={
                                                <Skeleton
                                                    variant="rounded"
                                                    width="100%"
                                                    height={300}
                                                    sx={{ borderRadius: 2 }}
                                                />
                                            }
                                        >
                                            <PeerVideo
                                                peerName={participant.name}
                                                stream={participant.stream}
                                                isMyCamera={
                                                    participant.id === room.myId
                                                }
                                                me={peerConnection}
                                            />
                                        </Suspense>
                                    ))}
                                </>
                            </GlassContainer>
                            <Suspense
                                fallback={
                                    <Skeleton
                                        variant="rounded"
                                        width="100%"
                                        height={200}
                                    />
                                }
                            >
                                <ScreenPlayer
                                    remoteScreen={remoteScreen}
                                    me={peerConnection}
                                    clearRemoteScreen={() =>
                                        setremoteScreen(null)
                                    }
                                />
                            </Suspense>
                        </GlassContainer>
                    </Grid>
                    <Grid
                        size={{
                            md: 12,
                            lg: 3,
                        }}
                        sx={roomChatSectionStyles}
                    >
                        <Suspense
                            fallback={
                                <Skeleton
                                    variant="rounded"
                                    width="100%"
                                    height="100%"
                                    sx={{ borderRadius: 2 }}
                                />
                            }
                        >
                            <Chat />
                        </Suspense>
                    </Grid>
                </Grid>
            </Container>
            <GlassBottomNavbar />
        </>
    );
};
export default Room;
