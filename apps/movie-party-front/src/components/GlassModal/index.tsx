import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material";
import styles from "./styles";
import GlassInput from "../GlassInput";
import GlassButton from "../GlassButton";
import type { FC, ReactNode, FormEvent } from "react";

export interface GlassModalProps {
    children: ReactNode;
    title: string;
}
const GlassModal: FC<GlassModalProps> = ({ children, title }) => {
    const theme = useTheme();
    const { modal, titleClass } = styles(theme.palette.mode);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        console.log("Form submitted:", formJson);
        handleClose();
    };

    return (
        <>
            <GlassButton onClick={handleClickOpen}>Open modal</GlassButton>
            <Dialog open={open} onClose={handleClose} sx={modal}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={titleClass}>
                        Stay updated with our latest news and offers. Enter your
                        email below to subscribe!
                    </DialogContentText>
                    {children}
                    <form onSubmit={handleSubmit} id="subscription-form">
                        <GlassInput
                            autoFocus
                            required
                            id="email"
                            name="email"
                            label="Email Address"
                            type="email"
                            kind="text input"
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <GlassButton onClick={handleClose}>Cancel</GlassButton>
                    <GlassButton onClick={handleClose}>Subscribe</GlassButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GlassModal;
