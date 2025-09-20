import { Button, IconButton } from "@mui/material";
import type { FC, ReactNode } from "react";
import styles from "./styles";

export interface GlassButtonProps {
    onClick: () => void;
    children: ReactNode;
    isIconBtn?: boolean;
    border?: boolean;
}

const GlassButton: FC<GlassButtonProps> = ({
    onClick,
    children,
    isIconBtn = false,
    border,
}) => {
    const { glassiconButton, glassButton } = styles();
    if (isIconBtn) {
        return (
            <IconButton
                color="primary"
                onClick={onClick}
                aria-label="Send message"
                sx={glassiconButton}
            >
                {children}
            </IconButton>
        );
    }
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                ...glassButton,
                border: border ? '"1px solid rgba(255, 255, 255, 0.3)"' : "",
            }}
        >
            {children}
        </Button>
    );
};

export default GlassButton;
