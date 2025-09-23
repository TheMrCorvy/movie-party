import {
    backdropFilter,
    borderWhite,
    darkThemeBg,
    lightThemeBg,
} from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = (theme = "light") => {
    return {
        containerStyles: {
            p: 2,
            backdropFilter: backdropFilter,
            backgroundColor: theme === "light" ? lightThemeBg : darkThemeBg,
            border: borderWhite,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
        },
    };
};

export default styles;
