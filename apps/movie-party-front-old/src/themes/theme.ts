import { type PaletteMode } from "@mui/material";

const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                  primary: {
                      main: "#1976d2",
                  },
                  secondary: {
                      main: "#dc004e",
                  },
                  background: {
                      default: "#f4f6f8",
                      paper: "#ffffff",
                  },
                  text: {
                      primary: "#ffffff",
                      secondary: "#000000",
                  },
              }
            : {
                  primary: {
                      main: "#ffffff",
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
                      secondary: "#000000",
                  },
              }),
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

export default getDesignTokens;
