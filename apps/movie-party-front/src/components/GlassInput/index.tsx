import type { ChangeEvent, FC } from "react";
import { textArea, textField } from "./styles";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
    type SelectChangeEvent,
} from "@mui/material";

export interface GlassInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onSelectChange?: (event: SelectChangeEvent) => void;
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
    checked?: boolean;
    radioOptions?: RadioOption[];
}

export interface RadioOption {
    value: string;
    label: string;
}

const GlassInput: FC<GlassInputProps> = ({
    kind,
    ariaLabel,
    checked = false,
    radioOptions,
    label,
    ...rest
}) => {
    if (kind === "text input") {
        return (
            <TextField
                fullWidth
                label={label}
                variant="outlined"
                aria-label={ariaLabel || "Text input"}
                sx={textField}
                {...rest}
            />
        );
    }

    if (kind === "text area") {
        return (
            <TextField
                label={label}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={textArea}
                {...rest}
            />
        );
    }

    if (kind === "checkbox") {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        sx={{
                            color: "white",
                            "&.Mui-checked": {
                                color: "#ffffff",
                            },
                        }}
                    />
                }
                label={<Typography sx={{ color: "white" }}>{label}</Typography>}
            />
        );
    }

    if (kind === "radio" && radioOptions) {
        return (
            <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "white" }}>
                    {label}
                </FormLabel>
                <RadioGroup {...rest}>
                    {radioOptions.map((option, index) => (
                        <FormControlLabel
                            key={
                                index +
                                "radio-option-" +
                                option.value +
                                "-" +
                                option.label
                            }
                            value={option.value}
                            control={
                                <Radio
                                    sx={{
                                        color: "white",
                                        "&.Mui-checked": {
                                            color: "#ffffff",
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography sx={{ color: "white" }}>
                                    {option.label}
                                </Typography>
                            }
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        );
    }

    if (kind === "select") {
        return (
            <FormControl
                fullWidth
                sx={{
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.7)",
                        },
                    },
                    "& .MuiInputBase-input": {
                        color: "white",
                    },
                    "& .MuiInputLabel-root": {
                        color: "white", // Changed to white
                    },
                    "& .MuiSelect-icon": {
                        color: "white", // Changed to white
                    },
                }}
            >
                <InputLabel id="select-label" sx={{ color: "white" }}>
                    {label}
                </InputLabel>
                <Select
                    label={label}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backdropFilter: "blur(10px)",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                border: "1px solid rgba(255, 255, 255, 0.3)",
                                borderRadius: 2,
                                boxShadow:
                                    "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                                "& .MuiMenuItem-root": {
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.1)",
                                    },
                                },
                            },
                        },
                    }}
                    {...rest}
                    onChange={rest.onSelectChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="optionA">Option A</MenuItem>
                    <MenuItem value="optionB">Option B</MenuItem>
                    <MenuItem value="optionC">Option C</MenuItem>
                </Select>
            </FormControl>
        );
    }

    return null;
};

export default GlassInput;
