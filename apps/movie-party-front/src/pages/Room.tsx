import { useEffect, useMemo, useState, type FC } from "react";
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
import { newPeerJoinedListener } from "../services/updateParticipantsService";
import ScreenPlayer from "../components/ScreenPlayer";
import { copyToClipboard } from "../utils/accessUserHardware";
import { logData } from "@repo/shared-utils/log-data";
import RoomPasswordUpdate from "../components/RoomPasswordUpdate";

const Room: FC = () => {
    const { room, dispatch, ws } = useRoom();
    const peerConnection = useMemo(
        () => peerConnectionService({ myId: room.myId }),
        [room.myId]
    );
    const [remoteScreen, setremoteScreen] = useState<MediaStream | null>(null);

    const handleCopy = async () => {
        const text = "http://localhost:5173/join-room/" + room.id;
        await copyToClipboard({
            callback: (params) =>
                logData({
                    title: "Copied invitation",
                    data: params,
                    type: "info",
                    timeStamp: true,
                    layer: "access_user_hardware",
                }),
            text,
        });
    };

    useEffect(() => {
        const unmountListenEvent = listenPeerToggledCamera({
            ws,
            callback: ({ cameraStatus, peerId }) => {
                if (!cameraStatus) {
                    logData({
                        title: "Peer turned off their camera",
                        layer: "camera_receiver",
                        type: "info",
                        timeStamp: true,
                        data: { cameraStatus, peerId },
                    });
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
            onCallEvent: ({ remoteStream, peerId, streamType }) => {
                if (streamType === "screen") {
                    logData({
                        title: "Received remote screen stream",
                        data: { remoteStream, peerId, streamType },
                        timeStamp: true,
                        type: "info",
                        layer: "screen_sharing_receiver",
                    });
                    setremoteScreen(remoteStream);
                    return;
                }

                logData({
                    title: "Received remote camera stream",
                    data: { remoteStream, peerId, streamType },
                    timeStamp: true,
                    type: "info",
                    layer: "camera_receiver",
                });
                dispatch({
                    type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                    payload: {
                        stream: remoteStream,
                        peerId: peerId,
                    },
                });
            },
            onPeerClose: defaultPeerClose,
            onPeerError: defaultPeerError,
            onPeerOpen: () => defaultPeerOpenEvent(peerConnection),
            onPeerDisconnect: () => defaultPeerDesconnected(peerConnection),
            peerConnection: peerConnection,
        });

        return () => {
            removePeerEventListeners();
        };
    }, [peerConnection, room.participants]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const removeEventListener = newPeerJoinedListener({
            me: room.participants[0],
            peer: peerConnection,
            ws,
        });

        return () => {
            removeEventListener();
        };
    }, [ws, room.participants, peerConnection, room.myId]);

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
                        <RoomPasswordUpdate
                            imRoomOwner={room.imRoomOwner}
                            password={room.password}
                            roomId={room.id}
                            peerId={room.myId}
                        />
                        <ScreenPlayer
                            remoteScreen={remoteScreen}
                            me={peerConnection}
                        />
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
                                        me={peerConnection}
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
