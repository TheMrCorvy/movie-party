import { Snackbar } from "@mui/material";
import { FC } from "react";
import { useGlassToast } from "../../context/GlassToastContext";
import GlassAlert from "../GlassAlert";

export const GlassToast: FC = () => {
    const { open, message, severity, duration, dispatch, position } =
        useGlassToast();

    const handleClose = () => {
        dispatch({ type: "HIDE_TOAST" });
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration ?? 5000}
            onClose={handleClose}
            anchorOrigin={position}
        >
            <GlassAlert
                value=""
                id="glass-toast"
                variant={severity ?? "info"}
                title={message ?? "Error"}
                openFromProps={open}
                callback={() => handleClose()}
                disableCollapse={true}
            />
        </Snackbar>
    );
};
