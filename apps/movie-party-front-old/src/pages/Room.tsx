import { type FC } from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import VideoPlayerComponent from "../components/VideoPlayerComponent";
import PeerVideo from "../components/PeerVideo";
import Chat from "../components/Chat";
import { useRoom } from "../hooks/useRoom";
import {
    roomContainerStyles,
    roomGridContainerStyles,
    roomMainContentStyles,
    roomChatSectionStyles,
    roomVideoSectionStyles,
    peerVideosContainerStyles,
} from "../styles/pages";
import GlassContainer from "../components/GlassContainer";
import GlassButton from "../components/GlassButton";

const Room: FC = () => {
    const {
        loading,
        roomId,
        shareScreen,
        videoStream,
        ownCamera,
        filteredPeersArr,
        peers,
        peersArr,
    } = useRoom();

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                "http://localhost:5173/join-room/" + roomId
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
                            Room
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Room ID: {roomId}
                        </Typography>

                        <GlassButton onClick={shareScreen}>
                            Compartir pantalla
                        </GlassButton>

                        <GlassButton onClick={handleCopy}>
                            Compartir sala
                        </GlassButton>

                        <Box sx={roomVideoSectionStyles}>
                            <Typography
                                variant="h5"
                                component="h3"
                                gutterBottom
                            >
                                Tu cámara
                            </Typography>
                            {videoStream && (
                                <VideoPlayerComponent stream={videoStream} />
                            )}
                        </Box>

                        <Box>
                            <Typography
                                variant="h5"
                                component="h3"
                                gutterBottom
                            >
                                Participantes conectados:{" "}
                                {Object.keys(peers).length}
                            </Typography>
                            <Box sx={peerVideosContainerStyles}>
                                {peersArr.length < 1 && !ownCamera ? (
                                    <Typography>loading...</Typography>
                                ) : (
                                    <>
                                        {ownCamera && (
                                            <PeerVideo
                                                key={ownCamera.peerId}
                                                peerName={ownCamera.peerName}
                                                stream={ownCamera.stream}
                                            />
                                        )}
                                        {filteredPeersArr.map(
                                            ([peerId, peer]) => (
                                                <PeerVideo
                                                    key={peerId}
                                                    peerName={peer.peerName}
                                                    stream={peer.stream}
                                                />
                                            )
                                        )}
                                    </>
                                )}
                            </Box>
                        </Box>
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
