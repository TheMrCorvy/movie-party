import { Button, IconButton } from "@mui/material";
import type { FC, ReactNode } from "react";
import { glassButton, sendButtonStyles } from "./styles";

export interface GlassButtonProps {
    onClick: () => void;
    children: ReactNode;
    isIconBtn?: boolean;
}

const GlassButton: FC<GlassButtonProps> = ({
    onClick,
    children,
    isIconBtn = false,
}) => {
    if (isIconBtn) {
        return (
            <IconButton
                color="primary"
                onClick={onClick}
                aria-label="Send message"
                sx={sendButtonStyles}
            >
                {children}
            </IconButton>
        );
    }
    return (
        <Button variant="contained" onClick={onClick} sx={glassButton}>
            {children}
        </Button>
    );
};

export default GlassButton;
