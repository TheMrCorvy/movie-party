export interface Participant {
    id: string;
    name: string;
    stream?: MediaStream | null;
}

export interface Message {
    peerId: string;
    peerName: string;
    message: string;
    isPoll?: boolean;
    poll?: Poll;
    id: string;
}

export interface MessageWithIndex extends Message {
    index: number;
}

export interface Poll {
    id: string;
    amountOfVotes: number;
    options: PollOption[];
    status: "live" | "ended";
}

export interface PollOption {
    title: string;
    votes: number;
    id: string;
    value: string;
}
