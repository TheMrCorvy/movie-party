import {
    Avatar,
    Divider,
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
import { dividerStyles, messageStyles, nameStyles } from "./styles";

interface ChatMessageProps {
    message: Message;
    shouldAddLastDivider: boolean;
}

const ChatMessage: FC<ChatMessageProps> = ({
    message,
    shouldAddLastDivider,
}) => {
    return (
        <Fragment>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    {message.name === "Yo" ? (
                        <Avatar
                            alt={message.name}
                            {...generateMUIAvatarProps(message.name)}
                        />
                    ) : (
                        <Avatar
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
            {shouldAddLastDivider && (
                <Divider variant="inset" component="li" sx={dividerStyles} />
            )}
        </Fragment>
    );
};

export default ChatMessage;
