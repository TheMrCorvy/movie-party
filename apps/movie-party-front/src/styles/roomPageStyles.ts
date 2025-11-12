import { StylesService } from "./types";

const styles: StylesService = () => {
    return {
        roomChatSectionStyles: {
            display: "flex",
            flexDirection: "column",
            padding: "24px",
            justifyContent: "center",
            height: "100%",
        },
        roomContainerStyles: {
            color: "white",
            padding: 0,
        },
        roomContainer: {
            height: "100vh",
            display: "flex",
            verticalAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "1rem",
            paddingBottom: "1rem",
        },
        gridColFlex: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
        },
    };
};

export default styles;
