import { StylesService } from "./types";

const styles: StylesService = () => {
    return {
        roomChatSectionStyles: {
            display: "flex",
            flexDirection: "column",
            paddingTop: "2rem",
            paddingBottom: "2rem",
            paddingLeft: "1.6rem",
            justifyContent: "center",
            height: "100%",
        },
        roomContainerStyles: {
            color: "white",
            height: "85vh",
            padding: 0,
        },
        roomContainer: {
            display: "flex",
            verticalAlign: "center",
            justifyContent: "center",
            height: "100%",
        },
        gridColFlex: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
        },
    };
};

export default styles;
