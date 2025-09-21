import { useState, type FC, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import SocketIOClient from "socket.io-client";
import { RoomContext } from "./RoomContext";
import { peerReducer } from "./peerReducer";

const WS = "http://localhost:4000";
const ws = SocketIOClient(WS);

interface RoomProviderProps {
    children: React.ReactNode;
}

export const RoomProvider: FC<RoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const [myName, setMyName] = useState("");

    return (
        <RoomContext.Provider
            value={{
                ws,
                myName,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
