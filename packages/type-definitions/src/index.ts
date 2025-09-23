export interface Participant {
    id: string;
    name: string;
    stream?: MediaStream;
}

export interface Message {
    peerId: string;
    peerName: string;
    message: string;
    isPoll?: boolean;
    Poll?: Poll;
    id: string;
}

export interface Poll {
    id: string;
    amountOfVotes: number;
    options: PollOption[];
}

export interface PollOption {
    label: string;
    votes: number;
}
