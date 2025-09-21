import { lightThemeBtnBg, lightThemeLighterBg } from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        glassButton: {
            backgroundColor: lightThemeBtnBg,
            color: "white",
            fontWeight: "700",
            textTransform: "none",
            padding: "10px 20px",
            borderRadius: 2,
            boxShadow: "none",
            "&:hover": {
                backgroundColor: lightThemeLighterBg,
                boxShadow: "none",
            },
        },
        glassiconButton: {
            backgroundColor: lightThemeBtnBg,
            "&:hover": {
                backgroundColor: lightThemeLighterBg,
            },
            color: "white",
        },
    };
};

export default styles;
