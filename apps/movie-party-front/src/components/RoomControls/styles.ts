import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        hidden: { display: "none" },
        patternPicker: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
        },
        btnGroup: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
        },
        passwordUpdate: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
        },
        shareRoomAndPoll: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            flexDirection: "column",
        },
    };
};

export default styles;
