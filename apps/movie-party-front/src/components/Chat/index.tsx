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
import { MessageWithIndex } from "@repo/type-definitions";

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

    const renderMessage = (index: number, message: MessageWithIndex) => {
        if (message.isPoll && message.poll) {
            if (message.poll.status === "live") {
                return (
                    <Poll
                        poll={message.poll}
                        key={index + "-live-poll-" + message.poll.id}
                    />
                );
            }

            let messageBody = "";

            message.poll.options.forEach((option) => {
                if (!messageBody) {
                    messageBody = `${option.votes} voto(s) para "${option.title}"`;
                } else {
                    messageBody += `, ${option.votes} voto(s) para "${option.title}"`;
                }
            });

            messageBody += ".";

            return (
                <ChatMessage
                    key={index + "-chat-message-" + message.peerName}
                    message={{
                        ...message,
                        peerName: message.poll.title,
                        message: messageBody,
                        peerId: message.poll.id,
                    }}
                    myId={myId}
                />
            );
        }

        return (
            <ChatMessage
                key={index + "-chat-message-" + message.peerName}
                message={message}
                myId={myId}
            />
        );
    };

    return (
        <Box sx={chatBoxStyles}>
            <List sx={chatListStyles}>
                {sortedMessages.map((message, index) =>
                    renderMessage(index, message)
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
