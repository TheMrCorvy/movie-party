import { darkThemeBg, lightThemeBg } from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = (theme = "light") => {
    return {
        sendMessageContainerStyles: {
            p: 2,
            alignItems: "center",
            backgroundColor: theme === "light" ? lightThemeBg : darkThemeBg,
        },
    };
};

export default styles;
