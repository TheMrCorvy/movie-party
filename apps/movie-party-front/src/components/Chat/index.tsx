import { type FC } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ChatMessage from "../ChatMessage";
import SendMessage from "../SendMessage";
import { useChatLogic } from "./useChatLogic";
import styles from "./styles";
import { useTheme } from "@mui/material/styles";

const Chat: FC = () => {
    const {
        messages,
        messageInput,
        messagesEndRef,
        handleSendMessage,
        handleInputChange,
        handleKeyPress,
    } = useChatLogic();
    const theme = useTheme();
    const { chatBoxStyles, chatListStyles, dividerStyles } = styles(
        theme.palette.mode
    );

    const sortedMessages = messages.sort((a, b) => a.index - b.index);

    return (
        <Box sx={chatBoxStyles}>
            <List sx={chatListStyles}>
                {sortedMessages.map((message, index) => (
                    <ChatMessage
                        key={index + "-chat-message-" + message.peerName}
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
