import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        patternTitle: {
            display: "block",
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 16,
        },
        container: {
            marginBottom: 8,
            textAlign: "center",
        },
        patternGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
        },
        btn: {
            padding: 0,
            border: "none",
            background: "transparent",
        },
    };
};

export default styles;
