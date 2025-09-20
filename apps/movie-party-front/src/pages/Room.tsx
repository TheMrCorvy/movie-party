import { type FC } from "react";
import { Button, Container, Grid, Box, Typography } from "@mui/material";
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

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={shareScreen}
                        >
                            Share screen
                        </Button>

                        <Box sx={roomVideoSectionStyles}>
                            <Typography
                                variant="h5"
                                component="h3"
                                gutterBottom
                            >
                                Your Video
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
                                Connected Peers: {Object.keys(peers).length}
                            </Typography>
                            <Box sx={peerVideosContainerStyles}>
                                {peersArr.length < 1 && !ownCamera ? (
                                    <Typography>loading...</Typography>
                                ) : (
                                    <>
                                        {ownCamera && (
                                            <PeerVideo
                                                key={ownCamera.peerId}
                                                peerId={ownCamera.peerId}
                                                stream={ownCamera.stream}
                                            />
                                        )}
                                        {filteredPeersArr.map(
                                            ([peerId, peer]) => (
                                                <PeerVideo
                                                    key={peerId}
                                                    peerId={peerId}
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
