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
import { logData } from "@repo/shared-utils/log-data";
import useNotificationSound, {
    NotificationSounds,
} from "../../hooks/useNotificationSound";

export const useChatLogic = () => {
    const { ws, room, dispatch } = useRoom();
    const [messageInput, setMessageInput] = useState("");
    const listRef = useRef<HTMLUListElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { playSound } = useNotificationSound();

    useEffect(() => {
        const unmountMessageReceived = messageReceivedService({
            ws,
            callback: ({ messageReceived }) => {
                logData({
                    title: "Message received",
                    data: messageReceived,
                    layer: "messages",
                    timeStamp: true,
                    type: "info",
                });
                dispatch({
                    type: ActionTypes.MESSAGE_RECEIVED,
                    payload: messageReceived,
                });
                playSound({ filename: NotificationSounds.MESSAGE_RECEIVED });
            },
        });

        return () => {
            unmountMessageReceived();
        };
    }, [ws, dispatch, playSound]);

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

            logData({
                title: "Sending message",
                data: newMessage,
                layer: "messages",
                timeStamp: true,
                type: "info",
            });
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
