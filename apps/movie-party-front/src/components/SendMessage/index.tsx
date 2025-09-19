import { IconButton, Stack, TextField } from "@mui/material";
import type { FC } from "react";
import SendIcon from "@mui/icons-material/Send";
import {
    messageInputStyles,
    sendButtonStyles,
    sendMessageContainerStyles,
} from "./styles";

export interface SendMessageProps {
    messageInput: string;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handleSendMessage: () => void;
}

const SendMessage: FC<SendMessageProps> = ({
    messageInput,
    handleInputChange,
    handleKeyPress,
    handleSendMessage,
}) => {
    return (
        <Stack direction="row" spacing={1} sx={sendMessageContainerStyles}>
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Escribe tu mensaje..."
                value={messageInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                aria-label="Message input"
                sx={messageInputStyles}
            />
            <IconButton
                color="primary"
                onClick={handleSendMessage}
                aria-label="Send message"
                sx={sendButtonStyles}
            >
                <SendIcon />
            </IconButton>
        </Stack>
    );
};

export default SendMessage;
