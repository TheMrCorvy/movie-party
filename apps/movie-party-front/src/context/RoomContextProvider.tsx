import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import SocketIOClient from "socket.io-client";
import { RoomContext } from "./RoomContext";
import { Signals } from "@repo/type-definitions/rooms";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";

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
        ws.on(Signals.ROOM_CREATED, enterRoom);
        ws.on(Signals.GET_PARTICIPANTS, getParticipants);
        ws.on(Signals.USER_LEFT, removePeer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <RoomContext.Provider value={{ ws, me }}>
            {children}
        </RoomContext.Provider>
    );
};
