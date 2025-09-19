import type { SxProps, Theme } from "@mui/material/styles";

export const messageInputStyles: SxProps<Theme> = {
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
};

export const sendButtonStyles: SxProps<Theme> = {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    color: "white",
};

export const sendMessageContainerStyles: SxProps<Theme> = {
    p: 2,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
};
