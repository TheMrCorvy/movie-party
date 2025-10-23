import { Box, Typography, Button, useTheme } from "@mui/material";
import { FC } from "react";
import styles from "./styles";
import { Poll, PollOption } from "@repo/type-definitions";
import { logData } from "@repo/shared-utils/log-data";

const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#2196f3",
    "#ff9800",
    "#4caf50",
];

export interface PollProps {
    poll: Poll;
}

const Poll: FC<PollProps> = ({ poll }) => {
    const handleVote = (option: PollOption) => {
        logData({
            title: "Voted for",
            layer: "poll",
            type: "info",
            timeStamp: true,
            data: option,
        });
    };
    const theme = useTheme();
    const {
        pollContainer,
        pollTitle,
        pollGrid,
        pollOption,
        pollOptionName,
        pollOptionVotes,
    } = styles(theme.palette.mode);

    logData({
        title: "Live poll",
        layer: "poll",
        type: "info",
        timeStamp: true,
        data: poll,
    });

    return (
        <Box sx={pollContainer} aria-label="Encuesta">
            <Typography variant="h6" sx={pollTitle}>
                {poll.title}
            </Typography>
            <Box sx={pollGrid}>
                {poll.options.map((option, i) => (
                    <Button
                        key={option.id}
                        onClick={() => handleVote(option)}
                        sx={{
                            ...pollOption,
                            backgroundColor: colors[i],
                            "&:hover": {
                                transform: "scale(1.03)",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                                backgroundColor: colors[i],
                            },
                        }}
                        aria-label={`Votar por ${option.title}`}
                    >
                        <Typography variant="body2" sx={pollOptionName}>
                            {option.title}
                        </Typography>
                        <Typography variant="subtitle1" sx={pollOptionVotes}>
                            {option.votes}
                        </Typography>
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default Poll;
