import {
    backdropFilter,
    darkThemeBg,
    lightThemeBg,
} from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = (style = "dark") => {
    return {
        glassToast: {
            backdropFilter,
            backgroundColor: style === "dark" ? darkThemeBg : lightThemeBg,
            borderRadius: "10px",
            color: "#ffffff",
            "& .MuiAlert-icon": {
                color: "#ffffff",
            },
        },
    };
};

export default styles;
