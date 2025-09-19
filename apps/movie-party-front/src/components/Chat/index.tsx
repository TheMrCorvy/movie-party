import { type FC } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ChatMessage from "../ChatMessage";
import SendMessage from "../SendMessage";
import { useChatLogic } from "./useChatLogic";
import { chatBoxStyles, chatListStyles, dividerStyles } from "./styles";

export interface Message {
    name: string;
    message: string;
}

const Chat: FC = () => {
    const {
        messages,
        messageInput,
        listRef,
        messagesEndRef,
        handleSendMessage,
        handleInputChange,
        handleKeyPress,
    } = useChatLogic();

    return (
        <Box sx={chatBoxStyles}>
            <List ref={listRef} sx={chatListStyles}>
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index + "-chat-message-" + message.name}
                        shouldAddLastDivider={index < messages.length - 1}
                        message={message}
                    />
                ))}
                <div ref={messagesEndRef} />
            </List>
            <Divider sx={dividerStyles} />
            <SendMessage
                messageInput={messageInput}
                handleInputChange={handleInputChange}
                handleKeyPress={handleKeyPress}
                handleSendMessage={handleSendMessage}
            />
        </Box>
    );
};

export default Chat;
