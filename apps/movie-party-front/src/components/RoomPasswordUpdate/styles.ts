import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        sectionContainer: {
            minWidth: "25rem",
            maxWidth: "100%",
        },
        gridContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            verticalAlign: "middle",
        },
    };
};

export default styles;
