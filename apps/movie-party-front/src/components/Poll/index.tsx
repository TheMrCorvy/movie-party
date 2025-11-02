import { Box, Typography, Button, useTheme } from "@mui/material";
import { FC, useEffect, useState } from "react";
import styles from "./styles";
import { Poll, PollOption } from "@repo/type-definitions";
import { logData } from "@repo/shared-utils/log-data";
import {
    listenPollUpdateService,
    voteInPollService,
} from "../../services/pollService";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { ActionTypes } from "../../context/RoomContext/roomActions";

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
    const { room, ws, dispatch } = useRoom();
    const [disableButtons, setDisableButtons] = useState(false);

    const handleVote = (option: PollOption) => {
        logData({
            title: "Voted for",
            layer: "poll",
            type: "info",
            timeStamp: true,
            data: option,
        });

        setDisableButtons(true);

        voteInPollService({
            ws,
            peerId: room.myId,
            roomId: room.id,
            pollOptionId: option.id,
            pollId: poll.id,
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

    useEffect(() => {
        const removeEventListener = listenPollUpdateService({
            ws,
            callback: (params) => {
                if (params.poll.status === "live") {
                    return dispatch({
                        type: ActionTypes.USER_VOTED,
                        payload: params,
                    });
                }

                const message = room.messages.find(
                    (m) =>
                        m.isPoll &&
                        m.poll &&
                        m.poll.id === params.poll.id &&
                        m.poll.status === "live"
                );

                if (!message) {
                    throw new Error("Poll was not found.");
                }

                return dispatch({
                    type: ActionTypes.FINISHED_POLL,
                    payload: {
                        message: {
                            ...message,
                            poll: params.poll,
                        },
                    },
                });
            },
        });

        return () => {
            removeEventListener();
        };
    }, [dispatch, ws, room.messages]);

    if (poll.status !== "live") return null;

    return (
        <Box sx={pollContainer} aria-label="Encuesta">
            <Typography variant="h6" sx={pollTitle}>
                {poll.title}
            </Typography>
            <Box sx={pollGrid}>
                {poll.options.map((option, i) => (
                    <Button
                        disabled={disableButtons}
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
