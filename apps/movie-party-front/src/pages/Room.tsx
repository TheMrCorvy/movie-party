import { useEffect, useMemo, useState, lazy, Suspense, type FC } from "react";
import { Container, Grid, Skeleton } from "@mui/material";
import { roomContainerStyles, roomChatSectionStyles } from "../styles/pages";
import GlassContainer from "../components/GlassContainer";
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
import { logData } from "@repo/shared-utils/log-data";
import { useGlassToast } from "../context/GlassToastContext";

const Chat = lazy(() => import("../components/Chat"));
const PeerVideo = lazy(() => import("../components/PeerVideo"));
const ScreenPlayer = lazy(() => import("../components/ScreenPlayer"));
const RoomControls = lazy(() => import("../components/RoomControls"));

const Room: FC = () => {
    const { room, dispatch, ws } = useRoom();
    const peerConnection = useMemo(
        () => peerConnectionService({ myId: room.myId }),
        [room.myId]
    );
    const [remoteScreen, setremoteScreen] = useState<MediaStream | null>(null);
    const { dispatch: dispatchToast } = useGlassToast();

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
            errorCallback: (message) =>
                dispatchToast({
                    type: "SHOW_TOAST",
                    payload: {
                        message,
                        severity: "error",
                    },
                }),
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
            <Grid
                container
                sx={{
                    height: "100vh",
                    display: "flex",
                    verticalAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "1rem",
                }}
            >
                <Grid
                    size={{
                        md: 12,
                        lg: 9,
                    }}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
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
                                clearRemoteScreen={() => setremoteScreen(null)}
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
    );
};
export default Room;
