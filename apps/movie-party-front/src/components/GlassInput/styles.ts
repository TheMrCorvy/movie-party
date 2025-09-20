import type { SxProps, Theme } from "@mui/material/styles";

export const textField: SxProps<Theme> = {
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
