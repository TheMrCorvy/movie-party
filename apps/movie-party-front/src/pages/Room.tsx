import { useEffect, useMemo, type FC } from "react";
import { Container, Grid, Typography } from "@mui/material";
import Chat from "../components/Chat";
import {
    roomContainerStyles,
    roomGridContainerStyles,
    roomMainContentStyles,
    roomChatSectionStyles,
} from "../styles/pages";
import GlassContainer from "../components/GlassContainer";
import GlassButton from "../components/GlassButton";
import PeerVideo from "../components/PeerVideo";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import {
    defaultPeerClose,
    defaultPeerDesconnected,
    defaultPeerError,
    defaultPeerOpenEvent,
    listenPeerEventsService,
    peerConnectionService,
} from "../services/peerConnectionService";
import { Participant } from "@repo/type-definitions";
import { ActionTypes } from "../context/RoomContext/roomActions";
import { listenPeerToggledCamera } from "../services/peerCameraService";

const Room: FC = () => {
    const { room, dispatch, ws } = useRoom();
    const peer = useMemo(
        () => peerConnectionService({ myId: room.myId }),
        [room.myId]
    );

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                "http://localhost:5173/join-room/" + room.id
            );
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    useEffect(() => {
        const unmountListenEvent = listenPeerToggledCamera({
            ws,
            callback: ({ cameraStatus, peerId }) => {
                if (!cameraStatus) {
                    dispatch({
                        type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                        payload: {
                            peerId: peerId,
                            stream: null,
                        },
                    });
                }
            },
        });

        return () => {
            unmountListenEvent();
        };
    }, [ws]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const removePeerEventListeners = listenPeerEventsService({
            me: room.participants.find(
                (participant) => participant.id === room.myId
            ) as Participant,
            onCallEvent: ({ remoteStream, peerId }) =>
                dispatch({
                    type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                    payload: {
                        stream: remoteStream,
                        peerId: peerId,
                    },
                }),
            onPeerClose: defaultPeerClose,
            onPeerError: defaultPeerError,
            onPeerOpen: () => defaultPeerOpenEvent(peer),
            onPeerDisconnect: () => defaultPeerDesconnected(peer),
            peerConnection: peer,
        });

        return () => {
            removePeerEventListeners();
        };
    }, [peer, room.participants]); // eslint-disable-line react-hooks/exhaustive-deps

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
                        <GlassContainer
                            height={"auto"}
                            width={"100%"}
                            direction="row"
                        >
                            <>
                                {room.participants.map((participant) => (
                                    <PeerVideo
                                        key={`peer-video-${participant.id}`}
                                        peerName={participant.name}
                                        stream={participant.stream}
                                        isMyCamera={
                                            participant.id === room.myId
                                        }
                                        me={peer}
                                    />
                                ))}
                            </>
                        </GlassContainer>
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
