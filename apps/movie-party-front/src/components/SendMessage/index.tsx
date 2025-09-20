import { Stack, useTheme } from "@mui/material";
import type { FC } from "react";
import SendIcon from "@mui/icons-material/Send";
import styles from "./styles";
import GlassButton from "../GlassButton";
import GlassInput from "../GlassInput";

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
    const theme = useTheme();
    const { sendMessageContainerStyles } = styles(theme.palette.mode);
    return (
        <Stack direction="row" spacing={1} sx={sendMessageContainerStyles}>
            <GlassInput
                kind="text input"
                placeholder="Escribe tu mensaje..."
                value={messageInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                ariaLabel="Message input"
                type="text"
                size="small"
            />
            <GlassButton isIconBtn onClick={handleSendMessage}>
                <SendIcon />
            </GlassButton>
        </Stack>
    );
};

export default SendMessage;
