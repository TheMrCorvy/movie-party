import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material";
import styles from "./styles";
import GlassButton, { GlassButtonProps } from "../GlassButton";
import type { FC, ReactNode } from "react";

export interface ModalAction {
    shouldCloseModal: boolean;
    callback: () => void;
    buttonLabel: string;
    value?: string;
    buttonProps: GlassButtonProps;
}

export interface GlassModalProps {
    children: ReactNode;
    title: string;
    description: string;
    modalActions: ModalAction[];
    openModalBtnLabel: string;
}
const GlassModal: FC<GlassModalProps> = ({
    children,
    title,
    openModalBtnLabel,
    description,
    modalActions,
}) => {
    const theme = useTheme();
    const { modal, titleClass } = styles(theme.palette.mode);
    const [open, setOpen] = useState(false);

    const handleButtonClick = (action?: ModalAction) => {
        if (!open) {
            setOpen(true);
            return;
        }

        if (!action) {
            return;
        }

        if (action.shouldCloseModal) {
            setOpen(false);
        }

        action.callback();
    };

    return (
        <>
            <GlassButton onClick={handleButtonClick}>
                {openModalBtnLabel}
            </GlassButton>
            <Dialog open={open} onClose={() => setOpen(false)} sx={modal}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
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
        </>
    );
};

export default GlassModal;
