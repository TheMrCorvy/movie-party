import {
    backdropFilter,
    borderWhite,
    lightThemeBtnBg,
    lightThemeLighterBg,
} from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        fabButtons: {
            backgroundColor: lightThemeBtnBg,
            "&:hover": {
                backgroundColor: lightThemeLighterBg,
            },
            color: "white",
            backdropFilter: backdropFilter,
            WebkitBackdropFilter: backdropFilter,
            boxShadow: "none",
            border: borderWhite,
        },
        fabButtonsContainer: {
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 3,
        },
        endCallStyles: {
            color: "white",
            backdropFilter: backdropFilter,
            WebkitBackdropFilter: backdropFilter,
            border: borderWhite,
            boxShadow: "none",
            backgroundColor: "rgba(255, 61, 0, 0.30)",
            "&:hover": {
                backgroundColor: "rgba(255, 61, 0, 0.40)",
            },
        },
        spacer: {
            flexGrow: 1,
        },
        rightButtons: {
            display: "flex",
            gap: 2,
            flexDirection: "row",
        },
        span: { height: "16px" },
    };
};

export default styles;
