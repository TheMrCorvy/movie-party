export interface Participant {
    id: string;
    name: string;
}

export interface Message {
    peerId: string;
    peerName: string;
    message: string;
}
