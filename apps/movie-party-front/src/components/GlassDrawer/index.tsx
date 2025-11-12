import { FC } from "react";
import { Global } from "@emotion/react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useGlassDrawer } from "../../context/GlassDrawerContext";

const GlassDrawer: FC = () => {
    const { open, anchor, children, dispatch } = useGlassDrawer();

    const borderRadius = {
        top: {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
        },
        bottom: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        },
        left: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
        },
        right: {
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
    };

    const handleClose = () =>
        dispatch({
            type: "CLOSE_DRAWER",
        });

    return (
        <>
            <Global
                styles={{
                    ".MuiBackdrop-root": {
                        backdropFilter: "none",
                    },
                    ".MuiDrawer-paper": {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                        borderRadius: 0,
                    },
                }}
            />
            <SwipeableDrawer
                anchor={anchor}
                open={open}
                onClose={handleClose}
                onOpen={() => {}}
                disableSwipeToOpen={true}
                sx={(theme) => ({
                    "& .MuiDrawer-paper": {
                        backdropFilter: "blur(10px)",
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? "rgba(0, 0, 0, 0.15)"
                                : "rgba(255, 255, 255, 0.15)",
                        border: `1px solid ${theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.18)" : "rgba(255, 255, 255, 0.18)"}`,
                        boxShadow: `0 8px 32px 0 ${theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.1)" : "rgba(31, 38, 135, 0.1)"}`,
                        color: theme.palette.text.primary,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                        ...borderRadius[anchor],
                    },
                })}
            >
                {children}
            </SwipeableDrawer>
        </>
    );
};

export default GlassDrawer;
