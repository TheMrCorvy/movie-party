import type { StylesService } from "../../styles/types";

const styles: StylesService = () => {
    return {
        alert: {
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "10px",
            color: "#fff",
            "& .MuiAlert-icon": {
                color: "rgba(255, 255, 255, 0.8)",
            },
            "&.MuiAlert-outlinedSuccess": {
                borderColor: "rgba(255, 255, 255, 0.5)",
            },
            display: "flex",
            alignItems: "center",
            verticalAlign: "middle",
        },
    };
};

export default styles;
