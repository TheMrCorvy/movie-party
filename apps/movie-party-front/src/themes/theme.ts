import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#f48fb1",
        },
        background: {
            default: "#1a1a2e",
            paper: "rgba(255, 255, 255, 0.05)",
        },
        text: {
            primary: "#ffffff",
            secondary: "rgba(255, 255, 255, 0.7)",
        },
    },
    typography: {
        fontFamily: "Roboto, sans-serif",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
        },
        body1: {
            fontSize: "1rem",
        },
    },
    components: {
        MuiListItemText: {
            styleOverrides: {
                root: {
                    marginTop: 0,
                    marginBottom: 0,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
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
            },
        },
    },
});

export default theme;
