import {
    useState,
    useRef,
    useEffect,
    type ChangeEvent,
    type KeyboardEvent,
} from "react";
import { generateMockMessages } from "./generateMockMessages";
import type { Message } from "./index";

const initialMockMessages: Message[] = generateMockMessages(11);

export const useChatLogic = () => {
    const [messages, setMessages] = useState<Message[]>(initialMockMessages);
    const [messageInput, setMessageInput] = useState("");
    const listRef = useRef<HTMLUListElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            const newMessage: Message = {
                name: "Yo",
                message: messageInput.trim(),
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageInput("");
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessageInput(event.target.value);
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    return {
        messages,
        messageInput,
        listRef,
        messagesEndRef,
        handleSendMessage,
        handleInputChange,
        handleKeyPress,
        setMessages,
        setMessageInput,
    };
};
