import {
    useState,
    useRef,
    useEffect,
    type ChangeEvent,
    type KeyboardEvent,
} from "react";
import { Message } from "@repo/type-definitions";

import { generateId } from "@repo/shared-utils";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import {
    messageReceivedService,
    sendMessageService,
} from "../../services/messagesService";
import { ActionTypes } from "../../context/RoomContext/roomActions";

export const useChatLogic = () => {
    const { ws, room, dispatch } = useRoom();
    const [messageInput, setMessageInput] = useState("");
    const listRef = useRef<HTMLUListElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unmountMessageReceived = messageReceivedService({
            ws,
            callback: ({ messageReceived }) =>
                dispatch({
                    type: ActionTypes.MESSAGE_RECEIVED,
                    payload: messageReceived,
                }),
        });

        return () => {
            unmountMessageReceived();
        };
    }, [ws, dispatch]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [room.messages]);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            const newMessage: Message = {
                peerName: room.participants[0].name,
                message: messageInput.trim(),
                id: generateId(),
                peerId: room.myId,
            };

            setMessageInput("");
            sendMessageService({ message: newMessage, roomId: room.id, ws });
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
        messages: room.messages,
        messageInput,
        listRef,
        messagesEndRef,
        handleSendMessage,
        handleInputChange,
        handleKeyPress,
        setMessageInput,
        myId: room.myId,
    };
};
