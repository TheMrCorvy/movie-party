import {
    backdropFilter,
    borderWhite,
    darkThemeDarkerBg,
    lightThemeBg,
} from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = (theme = "light") => {
    return {
        containerStyles: {
            width: "fit-content",
            p: 1,
            backdropFilter: backdropFilter,
            backgroundColor:
                theme === "light" ? lightThemeBg : darkThemeDarkerBg,
            border: borderWhite,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        },
    };
};

export default styles;
