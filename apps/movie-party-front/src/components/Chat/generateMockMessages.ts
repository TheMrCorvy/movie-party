import { v4 as uuidV4 } from "uuid";
import type { ChatMessage } from ".";

export const generateMockMessages = (count: number): ChatMessage[] => {
    const uuid = uuidV4();
    return Array.from({ length: count }, (_, index) => ({
        id: uuid,
        name: "Name " + (index + 1),
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    }));
};
