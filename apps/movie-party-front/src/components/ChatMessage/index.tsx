import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from "@mui/material";
import { Fragment, type FC } from "react";
import {
    generateAvatar,
    generateMUIAvatarProps,
} from "../../utils/avatarGenerator";
import type { Message } from "../Chat";
import {
    listItemAvatar,
    listItemBackground,
    messageStyles,
    nameStyles,
} from "./styles";

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
    return (
        <Fragment>
            <ListItem alignItems="flex-start" sx={listItemBackground}>
                <ListItemAvatar>
                    {message.name === "Yo" ? (
                        <Avatar
                            alt={message.name}
                            {...generateMUIAvatarProps(message.name)} // The styles for my avatar are inside the function
                        />
                    ) : (
                        <Avatar
                            sx={listItemAvatar}
                            alt={message.name}
                            src={generateAvatar({
                                name: message.name,
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
                            {message.name}
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
