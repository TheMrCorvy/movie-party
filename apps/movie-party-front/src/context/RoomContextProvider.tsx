import { useEffect, useState, type FC, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import SocketIOClient from "socket.io-client";
import { RoomContext } from "./RoomContext";
import { Signals } from "@repo/type-definitions/rooms";
import Peer from "peerjs";
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

    const enterRoom = ({ roomId }: EnterRoomResponse) => {
        navigate(`/room/${roomId}`);
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
            setStream,
            ws,
            enterRoom,
            removePeer: (peerId: string) =>
                handleRemovePeer({ peerId, dispatch }),
        });

        return () => {
            cleanupFunction();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!me || !stream) return;

        ws.on(Signals.USER_JOINED, ({ peerId }) =>
            handleUserJoined({ peerId, me })
        );
        me.on("call", (call) => handleIncomingCall({ call, stream, dispatch }));

        return () => {
            ws.off(Signals.USER_JOINED, ({ peerId }) =>
                handleUserJoined({ peerId, me })
            );
            me.off("call", (call) =>
                handleIncomingCall({ call, stream, dispatch })
            );
        };
    }, [me, stream, peers]); // Include peers to see state updates

    return (
        <RoomContext.Provider value={{ ws, me, stream, peers }}>
            {children}
        </RoomContext.Provider>
    );
};
