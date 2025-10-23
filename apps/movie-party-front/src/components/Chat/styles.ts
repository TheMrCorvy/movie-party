import {
    backdropFilter,
    borderWhite,
    darkThemeDarkerBg,
    lightThemeBg,
    lightThemeLighterBg,
} from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = (theme = "light") => {
    return {
        chatBoxStyles: {
            width: "100%",
            maxWidth: 500,
            backdropFilter: backdropFilter,
            backgroundColor:
                theme === "light" ? lightThemeBg : darkThemeDarkerBg,
            border: borderWhite,
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
        },
        chatListStyles: {
            flexGrow: 1,
            overflowY: "auto",
            height: "70vh",
            py: 0,
            px: 1,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            "&::-webkit-scrollbar": {
                width: "8px",
            },
            "&::-webkit-scrollbar-track": {
                background: lightThemeBg,
                borderRadius: "10px",
                backdropFilter: backdropFilter,
                margin: "8px 0",
            },
            "&::-webkit-scrollbar-thumb": {
                background: lightThemeLighterBg,
                borderRadius: "10px",
                border: borderWhite,
                backdropFilter: backdropFilter,
                "&:hover": {
                    background: "rgba(255, 255, 255, 0.4)",
                },
                "&:active": {
                    background: "rgba(255, 255, 255, 0.5)",
                },
            },
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)",
        },
        dividerStyles: {
            borderColor: "rgba(255, 255, 255, 0.2)",
        },
    };
};

export default styles;
