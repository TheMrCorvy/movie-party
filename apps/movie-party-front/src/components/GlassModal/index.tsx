import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Slide, useTheme } from "@mui/material";
import styles from "./styles";
import GlassButton from "../GlassButton";
import { forwardRef, ReactElement, Ref, type FC, type ReactNode } from "react";
import { CSSProperties } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";

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
    fullScreen?: boolean;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>;
    },
    ref: Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const GlassModal: FC<GlassModalProps> = ({
    children,
    title,
    description,
    modalActions,
    open,
    closeModalWithoutCallback,
    fullScreen = false,
}) => {
    const theme = useTheme();
    const { modal, titleClass } = styles(theme.palette.mode);

    return (
        <Dialog
            open={open}
            fullWidth
            fullScreen={fullScreen}
            maxWidth="md"
            onClose={closeModalWithoutCallback}
            slotProps={{
                paper: {
                    style: {
                        ...modal,
                        borderRadius: fullScreen ? 0 : "20px",
                    } as CSSProperties,
                },
            }}
            slots={{
                transition: Transition,
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent
                sx={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
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
