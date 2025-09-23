import { Participant } from "@repo/type-definitions";
import stringIsEmpty from "./stringIsEmpty";

export interface PutMeFirstParams {
    participants: Participant[];
    myId: string;
}

export type PutMeFirst = (params: PutMeFirstParams) => Participant[];

export const putMeFirst: PutMeFirst = ({ participants, myId }) => {
    const me = participants.find(
        (participant) => participant.id === myId
    ) as Participant;

    if (!me || stringIsEmpty(myId)) {
        throw new Error("Something weird happend.");
    }

    const otherParticipants = [...participants].filter(
        (participant) => participant.id !== myId
    );

    return [me, ...otherParticipants];
};
