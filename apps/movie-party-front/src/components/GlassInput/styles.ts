import {
    backdropFilter,
    lightThemeBg,
    lightThemeLighterBg,
} from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        checkboxStyles: {
            color: "white",
            "&.Mui-checked": {
                color: "#ffffff",
            },
        },
        radioStyles: {
            color: "white",
            "&.Mui-checked": {
                color: "#ffffff",
            },
        },
        selectFormControlStyles: {
            "& .MuiOutlinedInput-root": {
                backgroundColor: lightThemeBg,
                "& fieldset": {
                    borderColor: lightThemeLighterBg,
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
                color: "white",
            },
            "& .MuiSelect-icon": {
                color: "white",
            },
        },
        selectStyles: {
            backdropFilter: backdropFilter,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            border: `1px solid ${lightThemeLighterBg}`,
            borderRadius: 2,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            "& .MuiMenuItem-root": {
                color: "white",
                "&:hover": {
                    backgroundColor: lightThemeBg,
                },
            },
        },
        textArea: {
            "& .MuiOutlinedInput-root": {
                backgroundColor: lightThemeBg,
                "& fieldset": {
                    borderColor: lightThemeLighterBg,
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
        },
        textField: {
            "& .MuiOutlinedInput-root": {
                backgroundColor: lightThemeBg,
                "& fieldset": {
                    borderColor: lightThemeLighterBg,
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
        },
    };
};

export default styles;
