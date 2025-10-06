import {
    backdropFilter,
    borderWhite,
    darkThemeDarkerBg,
    lightThemeBg,
} from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = (theme = "light") => {
    return {
        modal: {
            backdropFilter: backdropFilter,
            backgroundColor:
                theme === "dark" ? darkThemeDarkerBg : lightThemeBg,
            border: borderWhite,
            borderRadius: "20px",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
            color: "#FFFFFF",
            padding: "20px",
        },
        titleClass: {
            fontWeight: 600,
            fontSize: "1.8rem",
            marginBottom: "10px",
        },
    };
};

export default styles;
