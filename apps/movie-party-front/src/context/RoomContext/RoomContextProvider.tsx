import { useEffect, useState, type FC, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SocketIOClient from "socket.io-client";
import { RoomContext } from "./RoomContext";
import { Signals } from "@repo/type-definitions/rooms";
import Peer from "peerjs";
import type { MediaConnection } from "peerjs";
import { peerReducer } from "./peerReducer";
import setMeUp from "../../utils/setMeUp";
import handleGetParticipants from "../../utils/handleGetParticipants";
import handleIncomingCall from "../../utils/handleIncomingCall";
import handleUserJoined from "../../utils/handleUserJoined";
import handleRemovePeer from "../../utils/handleRemovePeer";
import { handleShareScreen } from "../../utils/handleShareScreen";
import { Participant } from "@repo/type-definitions";

const WS = "http://localhost:4000";
const ws = SocketIOClient(WS);

interface RoomProviderProps {
    children: React.ReactNode;
}

interface EnterRoomResponse {
    roomId: string;
}

interface GetParticipantsSignal {
    participants: Participant[];
    roomId: string;
}

export const RoomProvider: FC<RoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peerReducer, {});
    const [screenSharingId, setScreenSharingId] = useState<string>("");
    const callsRef = useRef<MediaConnection[]>([]);
    const cameraCalls = useRef<MediaConnection[]>([]);
    const [cameraStream, setCameraStream] = useState<MediaStream>();
    const [myName, setMyName] = useState("");

    const enterRoom = ({ roomId }: EnterRoomResponse) => {
        navigate(`/room/${roomId}`);
    };

    useEffect(() => {
        if (!me || !stream) return;

        const onGetParticipants = ({
            participants,
            roomId,
        }: GetParticipantsSignal) => {
            handleGetParticipants({
                participants,
                roomId,
                me,
                stream,
                dispatch,
            });
        };

        ws.on(Signals.GET_PARTICIPANTS, onGetParticipants);

        return () => {
            ws.off(Signals.GET_PARTICIPANTS, onGetParticipants);
        };
    }, [me, stream]);

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
            setScreenSharingId,
        });

        return () => {
            cleanupFunction(); // DO NOT REMOVE THE ARROW FUNCTION
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!me || !stream) return;

        ws.on(Signals.USER_JOINED, ({ peerId, peerName }) => {
            handleUserJoined({ peerId, me, peerName });
            const currentLocation = window.location.pathname.split("/");
            if (currentLocation[1] === "join-room") {
                enterRoom({ roomId: currentLocation[2] });
            }
        });

        me.on("call", (call) => {
            const isCameraCall =
                call.metadata?.streamType === "camera-during-screenshare";

            if (isCameraCall) {
                cameraCalls.current.push(call);

                call.on("close", () => {
                    cameraCalls.current = cameraCalls.current.filter(
                        (c) => c !== call
                    );
                });
            } else {
                callsRef.current.push(call);

                call.on("close", () => {
                    callsRef.current = callsRef.current.filter(
                        (c) => c !== call
                    );
                });
            }
            const callerId = call.metadata?.peerId || call.peer;
            const peerName = "";

            Object.entries(peers).forEach((peer) => {
                if (peer[0] === callerId) {
                    return peerName === peer[1].peerName;
                }
            });

            handleIncomingCall({ call, stream, dispatch, peerName });
        });

        return () => {
            ws.off(Signals.USER_JOINED, ({ peerId, peerName }) =>
                handleUserJoined({ peerId, me, peerName })
            );
            me.off("call", (call) =>
                handleIncomingCall({ call, stream, dispatch, peerName: "" })
            );
        };
    }, [me, stream, peers]);

    const shareScreen = async () => {
        const roomId = window.location.pathname.split("/")[2];
        await handleShareScreen({
            me: me as Peer,
            setStream,
            setScreenSharingId,
            callsRef,
            cameraStream,
            screenSharingId,
            ws,
            roomId,
            dispatch,
            cameraCalls,
            peers,
        });
    };

    return (
        <RoomContext.Provider
            value={{
                ws,
                me,
                stream,
                peers,
                shareScreen,
                screenSharingId,
                myName,
                setMyName,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
