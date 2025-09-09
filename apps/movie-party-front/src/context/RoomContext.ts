import { createContext } from "react";
import { Socket } from "socket.io-client";
import Peer from "peerjs";

interface PeerState {
    stream: MediaStream;
}

interface RoomContextType {
    ws: Socket;
    me?: Peer;
    stream?: MediaStream;
    peers: Record<string, PeerState>;
    shareScreen: () => void;
}

export const RoomContext = createContext<RoomContextType | null>(null);
