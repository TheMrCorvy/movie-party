import { Button, IconButton } from "@mui/material";
import type { FC, ReactNode } from "react";
import styles from "./styles";

export interface GlassButtonProps {
    onClick: () => void;
    children: ReactNode;
    variant?: "icon-btn" | "btn";
    border?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
}

const GlassButton: FC<GlassButtonProps> = ({
    onClick,
    children,
    variant = "btn",
    border,
    disabled,
    fullWidth,
}) => {
    const { glassiconButton, glassButton } = styles();
    if (variant === "icon-btn") {
        return (
            <IconButton
                color="primary"
                onClick={onClick}
                aria-label="Send message"
                sx={glassiconButton}
                disabled={disabled}
            >
                {children}
            </IconButton>
        );
    }
    return (
        <Button
            fullWidth={fullWidth}
            variant="contained"
            onClick={onClick}
            disabled={disabled}
            sx={{
                ...glassButton,
                border: border ? "1px solid rgba(255, 255, 255, 0.3)" : "",
            }}
        >
            {children}
        </Button>
    );
};

export default GlassButton;
