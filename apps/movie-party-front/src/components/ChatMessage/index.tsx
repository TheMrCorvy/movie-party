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

interface ChatMessageProps {
    chatMessage: {
        id: string;
        name: string;
        message: string;
    };
    shouldAddLastDivider: boolean;
}

const ChatMessage: FC<ChatMessageProps> = ({
    chatMessage,
    shouldAddLastDivider,
}) => {
    return (
        <Fragment key={chatMessage.id}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    {chatMessage.name === "Yo" ? (
                        <Avatar
                            alt={chatMessage.name}
                            {...generateMUIAvatarProps(chatMessage.name)}
                        />
                    ) : (
                        <Avatar
                            alt={chatMessage.name}
                            src={generateAvatar({
                                name: chatMessage.name,
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
            {shouldAddLastDivider && (
                <Divider
                    variant="inset"
                    component="li"
                    sx={{
                        borderColor: "rgba(255, 255, 255, 0.2)",
                    }}
                />
            )}
        </Fragment>
    );
};

export default ChatMessage;
