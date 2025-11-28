import useNotificationSound, {
    NotificationSounds,
} from "../../hooks/useNotificationSound";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import {
    getUserVideoTrack,
    getUserAudioTrack,
    stopVideoTrack,
    stopAudioTrack,
} from "../../utils/accessUserHardware";
import { ActionTypes } from "../../context/RoomContext/roomActions";
import {
    emitToggleCamera,
    emitToggleMicrophone,
} from "../../services/peerCameraService";
import { useGlassToast } from "../../context/GlassToastContext";
import fakeTimeout from "../../utils/fakeTimeout";
import { useState } from "react";
import { logData } from "@repo/shared-utils/log-data";
import { startCall } from "../../services/callsService";
import { leaveRoomService } from "../../services/enterRoomService";

const useNavbarLogic = () => {
    const { room, ws, dispatch } = useRoom();
    const { playSound } = useNotificationSound();
    const { dispatch: dispatchToast } = useGlassToast();
    const [cameraOn, setCameraOn] = useState(false);
    const [microphoneOn, setMicrophoneOn] = useState(false);

    const toggleCamera = async () => {
        if (cameraOn) {
            const myVideoStream = room.participants[0]?.videoStream;
            if (myVideoStream) {
                stopVideoTrack(myVideoStream);
            }
            setCameraOn(false);
            dispatch({
                type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                payload: {
                    peerId: room.myId,
                    videoStream: null,
                },
            });
            emitToggleCamera({
                roomId: room.id,
                peerId: room.myId,
                cameraStatus: false,
                ws,
            });
            return;
        }

        try {
            const videoTrack = await getUserVideoTrack();
            const videoStream = new MediaStream([videoTrack]);

            setCameraOn(true);
            dispatch({
                type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                payload: {
                    peerId: room.myId,
                    videoStream,
                },
            });
            emitToggleCamera({
                roomId: room.id,
                peerId: room.myId,
                cameraStatus: true,
                ws,
            });

            logData({
                title: "Camera enabled, calling everyone",
                layer: "camera_caller",
                timeStamp: true,
                data: {
                    videoStream,
                    cameraIsOn: true,
                },
                type: "info",
            });

            const myAudioStream = room.participants[0]?.audioStream;
            const combinedStream = new MediaStream();

            videoStream
                .getVideoTracks()
                .forEach((track) => combinedStream.addTrack(track));
            if (myAudioStream) {
                myAudioStream
                    .getAudioTracks()
                    .forEach((track) => combinedStream.addTrack(track));
            }

            const otherParticipants = [...room.participants].filter(
                (participant) => participant.id !== room.myId
            );

            startCall({
                callback: (params) => {
                    logData({
                        title: "Someone answered the call",
                        timeStamp: true,
                        data: params,
                        layer: "camera_receiver",
                        type: "info",
                    });
                    dispatch({
                        type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                        payload: {
                            peerId: params.peerId,
                            videoStream: params.videoStream || null,
                        },
                    });

                    if (params.audioStream) {
                        dispatch({
                            type: ActionTypes.TOGGLE_PARTICIPANT_MICROPHONE,
                            payload: {
                                peerId: params.peerId,
                                audioStream: params.audioStream,
                            },
                        });
                    }
                },
                otherParticipants,
                me: room.me,
                stream: combinedStream,
                streamType: "camera",
                errorCallback: (message) =>
                    dispatchToast({
                        type: "SHOW_TOAST",
                        payload: {
                            message,
                            severity: "error",
                        },
                    }),
            });
        } catch (error) {
            dispatchToast({
                type: "SHOW_TOAST",
                payload: {
                    message:
                        "Error: la cámara no está disponible para utilizarse.",
                    severity: "error",
                },
            });
            console.error("getUserVideoTrack error:", error);
        }
    };

    const toggleMicrophone = async () => {
        if (microphoneOn) {
            const myAudioStream = room.participants[0]?.audioStream;
            if (myAudioStream) {
                stopAudioTrack(myAudioStream);
            }
            setMicrophoneOn(false);
            dispatch({
                type: ActionTypes.TOGGLE_PARTICIPANT_MICROPHONE,
                payload: {
                    peerId: room.myId,
                    audioStream: null,
                },
            });
            emitToggleMicrophone({
                roomId: room.id,
                peerId: room.myId,
                microphoneStatus: false,
                ws,
            });
            return;
        }

        try {
            const audioTrack = await getUserAudioTrack();
            if (!audioTrack) {
                throw new Error(
                    "Micrófono no disponible o feature flag deshabilitado"
                );
            }
            const audioStream = new MediaStream([audioTrack]);

            setMicrophoneOn(true);
            dispatch({
                type: ActionTypes.TOGGLE_PARTICIPANT_MICROPHONE,
                payload: {
                    peerId: room.myId,
                    audioStream,
                },
            });

            emitToggleMicrophone({
                roomId: room.id,
                peerId: room.myId,
                microphoneStatus: true,
                ws,
            });

            logData({
                title: "Microphone enabled, calling everyone",
                layer: "camera_caller",
                timeStamp: true,
                data: {
                    audioStream,
                    microphoneIsOn: true,
                },
                type: "info",
            });

            const myVideoStream = room.participants[0]?.videoStream;
            const combinedStream = new MediaStream();

            if (myVideoStream) {
                myVideoStream
                    .getVideoTracks()
                    .forEach((track) => combinedStream.addTrack(track));
            }
            audioStream
                .getAudioTracks()
                .forEach((track) => combinedStream.addTrack(track));

            const otherParticipants = [...room.participants].filter(
                (participant) => participant.id !== room.myId
            );

            startCall({
                callback: (params) => {
                    logData({
                        title: "Someone answered the microphone call",
                        timeStamp: true,
                        data: params,
                        layer: "camera_receiver",
                        type: "info",
                    });
                    dispatch({
                        type: ActionTypes.TOGGLE_PARTICIPANT_MICROPHONE,
                        payload: {
                            peerId: params.peerId,
                            audioStream: params.audioStream || null,
                        },
                    });

                    if (params.videoStream) {
                        dispatch({
                            type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
                            payload: {
                                peerId: params.peerId,
                                videoStream: params.videoStream,
                            },
                        });
                    }
                },
                otherParticipants,
                me: room.me,
                stream: combinedStream,
                streamType: "camera",
                errorCallback: (message) =>
                    dispatchToast({
                        type: "SHOW_TOAST",
                        payload: {
                            message,
                            severity: "error",
                        },
                    }),
            });
        } catch (error) {
            dispatchToast({
                type: "SHOW_TOAST",
                payload: {
                    message:
                        "Error: el micrófono no está disponible para utilizarse.",
                    severity: "error",
                },
            });
            console.error("getUserAudioTrack error:", error);
        }
    };

    const endCall = async () => {
        const myVideoStream = room.participants[0]?.videoStream;
        const myAudioStream = room.participants[0]?.audioStream;

        if (myVideoStream) {
            stopVideoTrack(myVideoStream);
        }
        if (myAudioStream) {
            stopAudioTrack(myAudioStream);
        }

        setCameraOn(false);
        setMicrophoneOn(false);

        dispatch({
            type: ActionTypes.TOGGLE_PARTICIPANT_CAMERA,
            payload: {
                peerId: room.myId,
                videoStream: null,
            },
        });
        dispatch({
            type: ActionTypes.TOGGLE_PARTICIPANT_MICROPHONE,
            payload: {
                peerId: room.myId,
                audioStream: null,
            },
        });

        emitToggleCamera({
            roomId: room.id,
            peerId: room.myId,
            cameraStatus: false,
            ws,
        });

        leaveRoomService({
            roomId: room.id,
            peerId: room.myId,
            ws,
        });

        playSound({
            filename: NotificationSounds.LEFT_THE_ROOM,
        });
        await fakeTimeout(1000);
        window.location.href = "/";
    };

    return { toggleCamera, toggleMicrophone, endCall, cameraOn, microphoneOn };
};

export default useNavbarLogic;
