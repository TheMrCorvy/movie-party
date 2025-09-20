import { useContext } from "react";
import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../../context/ThemeContext/ThemeContextProvider";

const ThemeSwitcher = () => {
    const theme = useTheme();
    const { toggleColorMode } = useContext(ThemeContext);

    return (
        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
            ) : (
                <Brightness4Icon />
            )}
        </IconButton>
    );
};

export default ThemeSwitcher;
