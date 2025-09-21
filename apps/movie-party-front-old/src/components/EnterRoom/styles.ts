import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        mainContainer: {
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        },
    };
};

export default styles;
