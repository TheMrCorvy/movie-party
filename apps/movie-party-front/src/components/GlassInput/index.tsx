import type { ChangeEvent, FC } from "react";
import { textField } from "./styles";
import { TextField } from "@mui/material";

export interface GlassInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    type: "text" | "password" | "email" | "number" | "tel" | "url";
    disabled?: boolean;
    maxLength?: number;
    minLength?: number;
    autoFocus?: boolean;

    name?: string;
    id?: string;

    required?: boolean;
    readOnly?: boolean;
    pattern?: string;
    label?: string;
    inputMode?:
        | "text"
        | "numeric"
        | "decimal"
        | "tel"
        | "search"
        | "email"
        | "url";
    onFocus?: () => void;
    onBlur?: () => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    spellCheck?: boolean;
    kind: "text input" | "text area" | "checkbox" | "radio" | "select";
    ariaLabel?: string;
    size?: "small" | "medium";
}

const GlassInput: FC<GlassInputProps> = ({ kind, ariaLabel, ...rest }) => {
    if (kind === "text input") {
        return (
            <TextField
                fullWidth
                variant="outlined"
                aria-label={ariaLabel || "Text input"}
                sx={textField}
                {...rest}
            />
        );
    }

    return null;
};

export default GlassInput;
