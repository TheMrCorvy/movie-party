import { Message } from "@repo/type-definitions";
import { generateId } from "@repo/shared-utils";

export const generateMockMessages = (count: number): Message[] => {
    return Array.from({ length: count }, (_, index) => ({
        id: generateId(),
        peerId: generateId(),
        peerName: "Name " + (index + 1),
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    }));
};
