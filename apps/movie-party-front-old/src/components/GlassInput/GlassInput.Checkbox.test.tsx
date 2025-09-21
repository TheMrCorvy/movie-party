import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlassInput from "./index";

jest.mock("./styles", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        checkboxStyles: { color: "white" },
    })),
}));

const theme = createTheme();

describe("GlassInput Component: Checkbox", () => {
    it("should render a checkbox with a label", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput kind="checkbox" type="text" label="Accept Terms" />
            </ThemeProvider>
        );

        const checkbox = screen.getByRole("checkbox", {
            name: /accept terms/i,
        });
        expect(checkbox).toBeInTheDocument();
    });

    it("should be unchecked by default", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput kind="checkbox" type="text" label="Accept Terms" />
            </ThemeProvider>
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).not.toBeChecked();
    });

    it("should respect the checked prop", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="checkbox"
                    type="text"
                    label="Is Enabled"
                    checked
                />
            </ThemeProvider>
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeChecked();
    });

    it("should call onChange when the checkbox is clicked", () => {
        const handleChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="checkbox"
                    type="text"
                    label="Click me"
                    onChange={handleChange}
                />
            </ThemeProvider>
        );

        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        expect(handleChange).toHaveBeenCalledTimes(1);
    });
});
