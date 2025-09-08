import { useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import SocketIOClient from "socket.io-client";
import { RoomContext } from "./RoomContext";
import { Signals } from "@repo/type-definitions/rooms";

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

    useEffect(() => {
        const enterRoom = ({ roomId }: EnterRoomResponse) => {
            navigate(`/room/${roomId}`);
        };
        ws.on(Signals.ROOM_CREATED, enterRoom);
    }, [navigate]);

    return (
        <RoomContext.Provider value={{ ws }}>{children}</RoomContext.Provider>
    );
};
