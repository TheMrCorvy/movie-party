import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlassInput from "./index";

jest.mock("./styles", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        textField: { border: "1px solid red" },
        textArea: { border: "1px solid blue" },
    })),
}));

const theme = createTheme();

describe("GlassInput Component: Text and Text Area", () => {
    it("should render a text input with a label and placeholder", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="text input"
                    type="text"
                    label="Username"
                    placeholder="Enter your username"
                />
            </ThemeProvider>
        );

        const input = screen.getByLabelText("Username");
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("placeholder", "Enter your username");
    });

    it("should call onChange when the text input value changes", () => {
        const handleChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="text input"
                    type="text"
                    label="Test Input"
                    onChange={handleChange}
                />
            </ThemeProvider>
        );

        const input = screen.getByLabelText("Test Input");
        fireEvent.change(input, { target: { value: "new value" } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should display the correct value in the text input", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="text input"
                    type="text"
                    label="With Value"
                    value="Initial value"
                    onChange={jest.fn()}
                />
            </ThemeProvider>
        );

        const input = screen.getByLabelText("With Value");
        expect(input).toHaveValue("Initial value");
    });

    it('should render a multiline text area when kind is "text area"', () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput kind="text area" type="text" label="Your Message" />
            </ThemeProvider>
        );

        const textArea = screen.getByLabelText("Your Message");
        expect(textArea).toBeInTheDocument();

        expect(textArea.nodeName).toBe("TEXTAREA");
        expect(textArea).toHaveAttribute("rows", "4");
    });

    it("should call onChange when the text area value changes", () => {
        const handleChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="text area"
                    type="text"
                    label="Your Message"
                    onChange={handleChange}
                />
            </ThemeProvider>
        );

        const textArea = screen.getByLabelText("Your Message");
        fireEvent.change(textArea, { target: { value: "new message" } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });
});
