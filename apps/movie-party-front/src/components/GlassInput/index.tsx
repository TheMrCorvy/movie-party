import { useState, type ChangeEvent, type FC } from "react";
import styles from "./styles";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputAdornment,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
    type SelectChangeEvent,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GlassButton from "../GlassButton";

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
    "aria-label"?: string;
    size?: "small" | "medium";
    checked?: boolean;
    options?: SelectOption[];
}

export interface SelectOption {
    value: string;
    label: string;
}

const GlassInput: FC<GlassInputProps> = ({
    kind,
    "aria-label": ariaLabel,
    checked = false,
    options,
    label,
    onSelectChange,
    ...rest
}) => {
    const {
        textField,
        textArea,
        checkboxStyles,
        radioStyles,
        selectFormControlStyles,
        selectStyles,
    } = styles();

    const [showPassword, setShowPassword] = useState(false);

    if (kind === "text input") {
        const showPasswordbtn = rest.type === "password";
        return (
            <TextField
                fullWidth
                label={label}
                variant="outlined"
                aria-label={ariaLabel || "Text input"}
                sx={textField}
                slotProps={
                    !showPasswordbtn
                        ? undefined
                        : {
                              input: {
                                  endAdornment: (
                                      <InputAdornment position="end">
                                          <GlassButton
                                              variant="icon-btn"
                                              onClick={() =>
                                                  setShowPassword(!showPassword)
                                              }
                                          >
                                              {showPassword ? (
                                                  <VisibilityOff />
                                              ) : (
                                                  <Visibility />
                                              )}
                                          </GlassButton>
                                      </InputAdornment>
                                  ),
                              },
                          }
                }
                {...rest}
                type={!showPassword ? rest.type : "text"}
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
                        sx={checkboxStyles}
                        onChange={rest.onChange}
                    />
                }
                label={<Typography sx={{ color: "white" }}>{label}</Typography>}
            />
        );
    }

    if (kind === "radio" && options) {
        return (
            <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "white" }}>
                    {label}
                </FormLabel>
                <RadioGroup {...rest}>
                    {options.map((option, index) => (
                        <FormControlLabel
                            key={
                                index +
                                "radio-option-" +
                                option.value +
                                "-" +
                                option.label
                            }
                            value={option.value}
                            control={<Radio sx={radioStyles} />}
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

    if (kind === "select" && options) {
        return (
            <FormControl fullWidth sx={selectFormControlStyles}>
                <InputLabel id={rest.id} sx={{ color: "white" }}>
                    {label}
                </InputLabel>
                <Select
                    labelId={rest.id}
                    label={label}
                    MenuProps={{
                        PaperProps: {
                            sx: selectStyles,
                        },
                    }}
                    {...rest}
                    value={rest.value || ""}
                    onChange={onSelectChange}
                >
                    {options.map((option, index) => (
                        <MenuItem
                            key={
                                index +
                                "-select-input-" +
                                option.value +
                                "-" +
                                option.label
                            }
                            value={option.value}
                        >
                            <em>{option.label}</em>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

    return null;
};

export default GlassInput;
