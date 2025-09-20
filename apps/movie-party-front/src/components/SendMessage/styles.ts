import { lightThemeBg } from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        sendMessageContainerStyles: {
            p: 2,
            alignItems: "center",
            backgroundColor: lightThemeBg,
        },
    };
};

export default styles;
