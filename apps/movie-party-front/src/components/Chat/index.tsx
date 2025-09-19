import {
    type FC,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
    useRef,
    useEffect,
} from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { generateMockMessages } from "./generateMockMessages";
import ChatMessage from "../ChatMessage";

export interface Message {
    name: string;
    message: string;
}

const initialMockMessages: Message[] = generateMockMessages(11);

const Chat: FC = () => {
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
                ref={listRef}
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    maxHeight: "70vh",
                    p: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        backdropFilter: "blur(10px)",
                        margin: "8px 0",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "10px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                            background: "rgba(255, 255, 255, 0.4)",
                        },
                        "&:active": {
                            background: "rgba(255, 255, 255, 0.5)",
                        },
                    },
                    scrollbarWidth: "thin",
                    scrollbarColor:
                        "rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)",
                }}
            >
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index + "-chat-message-" + message.name}
                        shouldAddLastDivider={index < messages.length - 1}
                        message={message}
                    />
                ))}
                <div ref={messagesEndRef} />
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
