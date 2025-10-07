import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material";
import styles from "./styles";
import GlassButton from "../GlassButton";
import type { FC, ReactNode } from "react";
import { CSSProperties } from "@mui/material/styles";

interface ButtonProps {
    disabled?: boolean;
    variant?: "btn" | "icon-btn";
    border?: boolean;
    fullWidth?: boolean;
}

export interface ModalAction {
    callback: () => void;
    buttonLabel: string;
    value?: string;
    buttonProps?: ButtonProps;
}

export interface GlassModalProps {
    children: ReactNode;
    title: string;
    description?: string;
    modalActions: ModalAction[];
    open: boolean;
    closeModalWithoutCallback: () => void;
}
const GlassModal: FC<GlassModalProps> = ({
    children,
    title,
    description,
    modalActions,
    open,
    closeModalWithoutCallback,
}) => {
    const theme = useTheme();
    const { modal, titleClass } = styles(theme.palette.mode);

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="md"
            onClose={closeModalWithoutCallback}
            slotProps={{
                paper: {
                    style: modal as CSSProperties,
                },
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent
                sx={{
                    padding: "10px",
                }}
            >
                <DialogContentText sx={titleClass}>
                    {description}
                </DialogContentText>
                {children}
            </DialogContent>
            <DialogActions>
                {modalActions.map((action, i) => (
                    <GlassButton
                        key={`modal-action-${i}-${action.buttonLabel}`}
                        {...action.buttonProps}
                        onClick={action.callback}
                    >
                        {action.buttonLabel}
                    </GlassButton>
                ))}
            </DialogActions>
        </Dialog>
    );
};

export default GlassModal;
