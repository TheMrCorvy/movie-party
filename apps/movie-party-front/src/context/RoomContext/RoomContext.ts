import { createContext } from "react";
import { Socket } from "socket.io-client";
import Peer from "peerjs";

export interface PeerState {
    stream: MediaStream;
    peerName: string;
}

export interface RoomContextType {
    ws: Socket;
    me?: Peer;
    stream?: MediaStream;
    peers: Record<string, PeerState>;
    shareScreen: () => void;
    screenSharingId: string;
    myName: string;
    setMyName: (name: string) => void;
}

export const RoomContext = createContext<RoomContextType | null>(null);
