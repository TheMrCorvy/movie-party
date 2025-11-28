import { logData } from "@repo/shared-utils/log-data";
import { Participant } from "@repo/type-definitions";
import { useRoom } from "../context/RoomContext/RoomContextProvider";
import { useEffect, useMemo, useState } from "react";
import {
    defaultPeerClose,
    defaultPeerDesconnected,
    defaultPeerError,
    defaultPeerOpenEvent,
    listenPeerEventsService,
    peerConnectionService,
} from "../services/peerConnectionService";
import { useGlassToast } from "../context/GlassToastContext";
import {
    listenPeerToggledCamera,
    listenPeerToggledMicrophone,
} from "../services/peerCameraService";
import { ActionTypes } from "../context/RoomContext/roomActions";
import { newPeerJoinedListener } from "../services/updateParticipantsService";

const useRoomLogic = () => {
    const { room, dispatch, ws } = useRoom();
    const peerConnection = useMemo(
        () => peerConnectionService({ myId: room.myId }),
        [room.myId]
    );
    const [remoteScreen, setremoteScreen] = useState<MediaStream | null>(null);
    const { dispatch: dispatchToast } = useGlassToast();

    useEffect(() => {
        if (peerConnection && !room.me) {
            dispatch({
                type: ActionTypes.SETUP_PEER_ACTION,
                payload: peerConnection,
            });
        }
    }, [peerConnection, room.me, dispatch]);

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
                            videoStream: null,
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
        const unmountListenEvent = listenPeerToggledMicrophone({
            ws,
            callback: ({ microphoneStatus, peerId }) => {
                if (!microphoneStatus) {
                    logData({
                        title: "Peer turned off their microphone",
                        layer: "camera_receiver",
                        type: "info",
                        timeStamp: true,
                        data: { microphoneStatus, peerId },
                    });
                    dispatch({
                        type: ActionTypes.TOGGLE_PARTICIPANT_MICROPHONE,
                        payload: {
                            peerId: peerId,
                            audioStream: null,
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
            onCallEvent: ({
                remoteStream,
                peerId,
                streamType,
                videoStream,
                audioStream,
            }) => {
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
                    title: "Received remote camera/audio stream",
                    data: {
                        remoteStream,
                        peerId,
                        streamType,
                        videoStream,
                        audioStream,
                    },
                    timeStamp: true,
                    type: "info",
                    layer: "camera_receiver",
                });

                // Despachar video si existe
                if (videoStream !== undefined) {
                    dispatch({
                        type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                        payload: {
                            videoStream: videoStream,
                            peerId: peerId,
                        },
                    });
                }

                // Despachar audio si existe
                if (audioStream !== undefined) {
                    dispatch({
                        type: ActionTypes.TOGGLE_PARTICIPANT_MICROPHONE,
                        payload: {
                            audioStream: audioStream,
                            peerId: peerId,
                        },
                    });
                }
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

    return {
        room,
        remoteScreen,
        setremoteScreen,
    };
};

export default useRoomLogic;
