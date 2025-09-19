import {
    type FC,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
    Fragment,
} from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { v4 as uuidV4 } from "uuid";
import { generateMockMessages } from "./generateMockMessages";

export interface ChatMessage {
    id: string;
    name: string;
    message: string;
}

const initialMockMessages: ChatMessage[] = generateMockMessages(10);

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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 3,
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
                    }}
                >
                    {messages.map((chatMessage, index) => (
                        <Fragment key={chatMessage.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={
                                        <Typography
                                            component="span"
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: "bold",
                                                color: "text.primary",
                                            }}
                                        >
                                            {chatMessage.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            sx={{
                                                color: "text.secondary",
                                                display: "block",
                                            }}
                                        >
                                            {chatMessage.message}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < messages.length - 1 && (
                                <Divider variant="inset" component="li" />
                            )}
                        </Fragment>
                    ))}
                </List>
                <Divider />
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ p: 2, alignItems: "center" }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        aria-label="Message input"
                    />
                    <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        aria-label="Send message"
                    >
                        <SendIcon />
                    </IconButton>
                </Stack>
            </Box>
        </Box>
    );
};

export default Chat;
