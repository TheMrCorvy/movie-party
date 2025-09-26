import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import { Fragment, type FC } from "react";
import {
    generateAvatar,
    generateMUIAvatarProps,
} from "../../utils/avatarGenerator";
import { type Message } from "@repo/type-definitions";
import styles from "./styles";

interface ChatMessageProps {
    message: Message;
    myId: string;
}

const ChatMessage: FC<ChatMessageProps> = ({ message, myId }) => {
    const theme = useTheme();
    const { listItemBackground, listItemAvatar, nameStyles, messageStyles } =
        styles(theme.palette.mode);
    return (
        <Fragment>
            <ListItem alignItems="flex-start" sx={listItemBackground}>
                <ListItemAvatar>
                    {message.peerId === myId ? (
                        <Avatar
                            alt={message.peerName}
                            {...generateMUIAvatarProps(message.peerName)} // The styles for my avatar are inside the function
                        />
                    ) : (
                        <Avatar
                            sx={listItemAvatar}
                            alt={message.peerName}
                            src={generateAvatar({
                                name: message.peerName,
                                size: 40,
                            })}
                        />
                    )}
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography
                            component="span"
                            variant="subtitle1"
                            sx={nameStyles}
                        >
                            {message.peerId === myId ? "Yo" : message.peerName}
                        </Typography>
                    }
                    secondary={
                        <Typography
                            component="span"
                            variant="body2"
                            sx={messageStyles}
                        >
                            {message.message}
                        </Typography>
                    }
                />
            </ListItem>
        </Fragment>
    );
};

export default ChatMessage;
