import {
    borderWhite,
    darkThemeDarkerBg,
    lightThemeBg,
} from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = (theme = "light") => {
    return {
        containerStyles: {
            p: 2,
            backdropFilter: "blur(10px)",
            backgroundColor:
                theme === "light" ? lightThemeBg : darkThemeDarkerBg,
            border: borderWhite,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        },
    };
};

export default styles;
