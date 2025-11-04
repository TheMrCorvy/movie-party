import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        gridContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            verticalAlign: "middle",
        },
    };
};

export default styles;
