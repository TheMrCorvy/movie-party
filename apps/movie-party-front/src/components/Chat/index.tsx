import { type FC } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ChatMessage from "../ChatMessage";
import SendMessage from "../SendMessage";
import { useChatLogic } from "./useChatLogic";
import styles from "./styles";
import { useTheme } from "@mui/material/styles";
import { logData } from "@repo/shared-utils/log-data";
import Poll from "../Poll";

const Chat: FC = () => {
    const {
        messages,
        messageInput,
        messagesEndRef,
        handleSendMessage,
        handleInputChange,
        handleKeyPress,
        myId,
    } = useChatLogic();
    const theme = useTheme();
    const { chatBoxStyles, chatListStyles, dividerStyles } = styles(
        theme.palette.mode
    );

    const sortedMessages = messages.sort((a, b) => a.index - b.index);

    logData({
        title: "Chat component",
        data: "Re-rendering",
        layer: "messages",
        timeStamp: true,
        type: "info",
    });

    return (
        <Box sx={chatBoxStyles}>
            <List sx={chatListStyles}>
                {sortedMessages.map((message, index) =>
                    message.isPoll &&
                    message.poll &&
                    message.poll.status === "live" ? (
                        <Poll poll={message.poll} />
                    ) : (
                        <ChatMessage
                            key={index + "-chat-message-" + message.peerName}
                            message={message}
                            myId={myId}
                        />
                    )
                )}
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
