import { useEffect, useState, type FC, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import SocketIOClient from "socket.io-client";
import { RoomContext } from "./RoomContext";
import { Signals } from "@repo/type-definitions/rooms";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peerReducer } from "./peerReducer";

const WS = "http://localhost:4000";

const ws = SocketIOClient(WS);

interface RoomProviderProps {
    children: React.ReactNode;
}

interface EnterRoomResponse {
    roomId: string;
}

interface Participants {
    participants: string[];
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

    const getParticipants = ({ participants }: Participants) => {
        console.log(participants);
    };

    const removePeer = (peerId: string) => {
        console.log("peer left: ", peerId);
    };

    useEffect(() => {
        const meId = uuidV4();
        const peer = new Peer(meId);
        setMe(peer);

        try {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: false }) // to do: implement FF here
                .then((stream) => {
                    setStream(stream);
                });
        } catch (error) {
            console.error(error);
        }

        ws.on(Signals.ROOM_CREATED, enterRoom);
        ws.on(Signals.GET_PARTICIPANTS, getParticipants);
        ws.on(Signals.USER_LEFT, removePeer);

        return () => {
            ws.off(Signals.ROOM_CREATED, enterRoom);
            ws.off(Signals.GET_PARTICIPANTS, getParticipants);
            ws.off(Signals.USER_LEFT, removePeer);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!me || !stream) return;

        ws.on(Signals.USER_JOINED, ({ peerId }) => {
            const call = me.call(peerId, stream);
            call.on("stream", (peerStream) => {
                dispatch({
                    type: "ADD_PEER",
                    payload: { peerId, stream: peerStream },
                });
            });
        });

        me.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (remoteStream) => {
                dispatch({
                    type: "ADD_PEER",
                    payload: { peerId: call.peer, stream: remoteStream },
                });
            });
        });

        return () => {
            ws.off(Signals.USER_JOINED);
            me.removeAllListeners("call");
        };
    }, [me, stream]);

    console.log({ peers });

    return (
        <RoomContext.Provider value={{ ws, me, stream }}>
            {children}
        </RoomContext.Provider>
    );
};
