import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlassInput from "./index";

jest.mock("./styles", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        textArea: { border: "1px solid blue" },
    })),
}));

const theme = createTheme();

describe("GlassInput Component: Text Area", () => {
    it("should render a multiline text area with a label", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput kind="text area" type="text" label="Your Message" />
            </ThemeProvider>
        );

        const textArea = screen.getByLabelText("Your Message");
        expect(textArea).toBeInTheDocument();

        expect(textArea.tagName).toBe("TEXTAREA");
    });

    it("should have the correct number of rows", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput kind="text area" type="text" label="Your Message" />
            </ThemeProvider>
        );

        const textArea = screen.getByLabelText("Your Message");
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
        fireEvent.change(textArea, { target: { value: "A new message" } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should display the correct value in the text area", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="text area"
                    type="text"
                    label="With Value"
                    value="Initial message"
                    onChange={jest.fn()}
                />
            </ThemeProvider>
        );

        const textArea = screen.getByLabelText("With Value");
        expect(textArea).toHaveValue("Initial message");
    });
});
