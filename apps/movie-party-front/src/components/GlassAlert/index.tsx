import { Alert, Collapse, IconButton, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles";

export interface AlertCallbackParams {
    value: string;
    id: string;
}

export type AlertVariants = "success" | "info" | "warning" | "error";

export interface GlassAlertProps extends AlertCallbackParams {
    variant: AlertVariants;
    title: string;
    callback?: (params: AlertCallbackParams) => void;
    openFromProps: boolean;
    description?: string;
}

const GlassAlert: FC<GlassAlertProps> = ({
    value,
    variant,
    id,
    callback,
    title,
    openFromProps,
    description,
}) => {
    const [open, setOpen] = useState(openFromProps);
    const { alert } = styles();

    useEffect(() => {
        if (open && typeof callback === "undefined") {
            const timer = setTimeout(() => {
                setOpen(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [openFromProps, open, callback]);

    const onClose = () => {
        if (callback) {
            callback({
                id,
                value,
            });
        }

        setOpen(false);
    };

    const colors = {
        success: "rgba(76, 175, 80, 0.15)",
        warning: "rgba(255, 152, 0, 0.15)",
        info: "rgba(33, 150, 243, 0.15)",
        error: "rgba(244, 67, 54, 0.15)",
    } as Record<AlertVariants, string>;

    const capitalizeFirstLetter = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <Collapse in={open} id={id}>
            <Alert
                variant="outlined"
                severity={variant}
                sx={{
                    ...alert,
                    backgroundColor: colors[variant],
                }}
                action={
                    callback && (
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={onClose}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    )
                }
            >
                <Typography variant="subtitle1">
                    {capitalizeFirstLetter(title)}
                </Typography>
                {description && (
                    <Typography
                        variant="subtitle2"
                        gutterBottom
                        color="#FFFFFF"
                    >
                        {description}
                    </Typography>
                )}
            </Alert>
        </Collapse>
    );
};

export default GlassAlert;
