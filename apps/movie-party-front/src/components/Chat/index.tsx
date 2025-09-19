import { type FC, useState, type ChangeEvent, type KeyboardEvent } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { v4 as uuidV4 } from "uuid";
// import { generateMockMessages } from "./generateMockMessages";
import ChatMessage from "../ChatMessage";

export interface ChatMessage {
    id: string;
    name: string;
    message: string;
}

const initialMockMessages: ChatMessage[] = [];

const Chat: FC = () => {
    const [messages, setMessages] =
        useState<ChatMessage[]>(initialMockMessages);
    const [messageInput, setMessageInput] = useState("");

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            const newMessage: ChatMessage = {
                id: uuidV4(),
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

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 500,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 3,
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <List
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    maxHeight: "70vh",
                    p: 0,

                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
            >
                {messages.map((chatMessage, index) => (
                    <ChatMessage
                        key={chatMessage.id}
                        shouldAddLastDivider={index < messages.length - 1}
                        chatMessage={chatMessage}
                    />
                ))}
            </List>
            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    p: 2,
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Escribe tu mensaje..."
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    aria-label="Message input"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            "& fieldset": {
                                borderColor: "rgba(255, 255, 255, 0.3)",
                            },
                            "&:hover fieldset": {
                                borderColor: "rgba(255, 255, 255, 0.5)",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "rgba(255, 255, 255, 0.7)",
                            },
                        },
                        "& .MuiInputBase-input": {
                            color: "white",
                        },
                        "& .MuiInputLabel-root": {
                            color: "rgba(255, 255, 255, 0.7)",
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "rgba(255, 255, 255, 0.7)",
                            opacity: 1,
                        },
                    }}
                />
                <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    aria-label="Send message"
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                        },
                        color: "white",
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Stack>
        </Box>
    );
};

export default Chat;
