import { useState, useEffect, type FC } from "react";
import SocketIOClient from "socket.io-client";
import { RoomContext } from "./RoomContext";

const WS = "http://localhost:4000";
const ws = SocketIOClient(WS);

interface RoomProviderProps {
    children: React.ReactNode;
}

export const RoomProvider: FC<RoomProviderProps> = ({ children }) => {
    const [myName, setMyName] = useState("");

    useEffect(() => setMyName("hola"), []);

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
