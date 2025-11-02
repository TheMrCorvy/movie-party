import {
    backdropFilter,
    borderWhite,
    darkThemeDarkerBg,
    lightThemeBg,
} from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = (theme = "light") => {
    return {
        pollContainer: {
            p: 2,
            backdropFilter: backdropFilter,
            backgroundColor:
                theme === "dark" ? darkThemeDarkerBg : lightThemeBg,
            border: borderWhite,
            borderRadius: 3,
            mx: 1,
            my: 2,
            position: "sticky",
            top: 10,
            zIndex: 1,
        },
        pollTitle: {
            color: "white",
            mb: 2,
            textAlign: "center",
            textTransform: "capitalize",
        },
        pollGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 1,
        },
        pollOption: {
            p: 1.5,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            minHeight: 80,
            transition:
                "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:active": {
                transform: "scale(0.98)",
            },
            "&:disabled": {
                backgroundColor:
                    theme === "dark" ? darkThemeDarkerBg : lightThemeBg,
            },
        },
        pollOptionName: {
            color: "white",
            fontSize: "0.8rem",
            textTransform: "capitalize",
        },
        pollOptionVotes: { color: "white", mt: 0.5 },
    };
};

export default styles;
