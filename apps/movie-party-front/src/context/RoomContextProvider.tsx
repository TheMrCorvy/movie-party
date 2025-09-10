import { useEffect, useState, type FC, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SocketIOClient from "socket.io-client";
import { RoomContext } from "./RoomContext";
import { Signals } from "@repo/type-definitions/rooms";
import Peer, { MediaConnection } from "peerjs";
import { peerReducer } from "./peerReducer";
import setMeUp from "../utils/setMeUp";
import handleGetParticipants from "../utils/handleGetParticipants";
import handleIncomingCall from "../utils/handleIncomingCall";
import handleUserJoined from "../utils/handleUserJoined";
import handleRemovePeer from "../utils/handleRemovePeer";

const WS = "http://localhost:4000";
const ws = SocketIOClient(WS);

interface RoomProviderProps {
    children: React.ReactNode;
}

interface EnterRoomResponse {
    roomId: string;
}

export const RoomProvider: FC<RoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peerReducer, {});
    const [screenSharingId, setScreenSharingId] = useState<string>("");
    const callsRef = useRef<MediaConnection[]>([]);
    const [cameraStream, setCameraStream] = useState<MediaStream>();

    const enterRoom = ({ roomId }: EnterRoomResponse) => {
        navigate(`/room/${roomId}`);
    };

    const switchStream = (newStream: MediaStream, isScreen = false) => {
        setStream(newStream);
        setScreenSharingId(isScreen ? me?.id || "" : "");

        const videoTrack = newStream.getVideoTracks()[0];

        callsRef.current.forEach((call) => {
            const sender = call.peerConnection
                .getSenders()
                .find((s) => s.track?.kind === "video");

            if (sender && videoTrack) {
                sender.replaceTrack(videoTrack).catch(console.error);
            }
        });
    };

    const shareScreen = async () => {
        if (screenSharingId) {
            if (cameraStream) switchStream(cameraStream, false);
            setScreenSharingId("");
        } else {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false,
            });
            switchStream(displayStream, true);

            displayStream.getVideoTracks()[0].onended = () => {
                if (cameraStream) switchStream(cameraStream, false);
                setScreenSharingId("");
            };
        }
    };

    useEffect(() => {
        if (!me || !stream) return;

        ws.on(Signals.GET_PARTICIPANTS, ({ participants, roomId }) =>
            handleGetParticipants({
                participants,
                roomId,
                me,
                stream,
                dispatch,
            })
        );

        return () => {
            ws.off(Signals.GET_PARTICIPANTS, ({ participants, roomId }) =>
                handleGetParticipants({
                    participants,
                    roomId,
                    me,
                    stream,
                    dispatch,
                })
            );
        };
    }, [me, stream, peers]);

    useEffect(() => {
        const cleanupFunction = setMeUp({
            setMe,
            setStream: (s: MediaStream) => {
                setStream(s);
                setCameraStream(s);
            },
            ws,
            enterRoom,
            removePeer: (peerId: string) =>
                handleRemovePeer({ peerId, dispatch }),
        });

        return () => {
            cleanupFunction(); // DO NOT REMOVE THE ARROW FUNCTION
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!me || !stream) return;

        ws.on(Signals.USER_JOINED, ({ peerId }) =>
            handleUserJoined({ peerId, me })
        );

        me.on("call", (call) => {
            callsRef.current.push(call);

            call.on("close", () => {
                callsRef.current = callsRef.current.filter((c) => c !== call);
            });

            handleIncomingCall({ call, stream, dispatch });
        });

        return () => {
            ws.off(Signals.USER_JOINED, ({ peerId }) =>
                handleUserJoined({ peerId, me })
            );
            me.off("call", (call) =>
                handleIncomingCall({ call, stream, dispatch })
            );
        };
    }, [me, stream, peers]);

    return (
        <RoomContext.Provider value={{ ws, me, stream, peers, shareScreen }}>
            {children}
        </RoomContext.Provider>
    );
};
