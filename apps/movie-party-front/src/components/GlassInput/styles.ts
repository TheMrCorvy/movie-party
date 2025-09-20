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

export const textArea: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
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

export const selectStyles: SxProps<Theme> = {
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    "& .MuiMenuItem-root": {
        color: "white",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
    },
};

export const selectFormControlStyles: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
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
        color: "white", // Changed to white
    },
    "& .MuiSelect-icon": {
        color: "white", // Changed to white
    },
};

export const radioStyles: SxProps<Theme> = {
    color: "white",
    "&.Mui-checked": {
        color: "#ffffff",
    },
};

export const checkboxStyles: SxProps<Theme> = {
    color: "white",
    "&.Mui-checked": {
        color: "#ffffff",
    },
};
