import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material";
import styles from "./styles";
import GlassInput from "../GlassInput";
import GlassButton from "../GlassButton";
import type { FC } from "react";

const GlassModal: FC = () => {
    const theme = useTheme();
    const { modal, title } = styles(theme.palette.mode);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
                <DialogTitle>Subscribe to our Newsletter</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={title}>
                        Stay updated with our latest news and offers. Enter your
                        email below to subscribe!
                    </DialogContentText>
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
