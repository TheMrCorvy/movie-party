import { borderWhite } from "../../styles/components";
import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        messageStyles: {
            color: "text.primary",
            display: "block",
            fontWeight: 500,
            fontSize: 14,
            whiteSpace: "pre-wrap",
        },
        nameStyles: {
            fontWeight: 700,
            color: "text.primary",
            fontSize: 18,
        },
        listItemBackground: {
            px: 2,
            py: 1.5,
            backgroundColor: "rgba(150, 150, 150, 0.05)",
            borderRadius: 2,
            my: 1,
            border: borderWhite,
            boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.05)",
            "&:first-of-type": { mt: 1 },
            "&:last-of-type": { mb: 1 },
        },
        listItemAvatar: { minWidth: "auto", mr: 1.5 },
    };
};

export default styles;
