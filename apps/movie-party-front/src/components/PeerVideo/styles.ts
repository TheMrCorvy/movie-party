import {
    backdropFilter,
    lightThemeBg,
    lightThemeLighterBg,
} from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        peerTextStyles: {
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "0.75rem",
            fontWeight: 500,
            textTransform: "capitalize",
        },
        peerLabelStyles: {
            padding: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: backdropFilter,
            textAlign: "center",
            borderTop: `1px solid ${lightThemeBg}`,
        },
        videoStyles: {
            width: "300px",
            height: "200px",
            objectFit: "cover",
            display: "block",
        },
        videoContainerStyles: {
            display: "inline-block",
            margin: "10px",
            borderRadius: 2,
            overflow: "hidden",
            backdropFilter: backdropFilter,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: `1px solid ${lightThemeLighterBg}`,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        },
    };
};

export default styles;
