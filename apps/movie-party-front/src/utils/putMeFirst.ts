import { Participant } from "@repo/type-definitions";

import { stringIsEmpty } from "@repo/shared-utils";
import { logData } from "@repo/shared-utils/log-data";

export interface PutMeFirstParams {
    participants: Participant[];
    oldVersionOfMe?: Participant;
    myId: string;
}

export type PutMeFirst = (params: PutMeFirstParams) => Participant[];

export const putMeFirst: PutMeFirst = ({
    participants,
    myId,
    oldVersionOfMe,
}) => {
    const me = participants.find((participant) => participant.id === myId);

    if (!me || stringIsEmpty(myId)) {
        logData({
            type: "error",
            layer: "*",
            title: "Somethig weird happend",
            data: {
                message: "My id wasn't found in the participants array...",
                participants,
                myId,
                oldVersionOfMe,
            },
            timeStamp: true,
            addSpaceAfter: true,
        });
        throw new Error("Something weird happend.");
    }

    const otherParticipants = [...participants].filter(
        (participant) => participant.id !== myId
    );

    if (oldVersionOfMe && oldVersionOfMe.stream) {
        me.stream = oldVersionOfMe.stream;
    }

    return [me, ...otherParticipants];
};
