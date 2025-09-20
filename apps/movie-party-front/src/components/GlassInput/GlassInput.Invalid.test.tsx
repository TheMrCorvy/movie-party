import { render } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlassInput, { type GlassInputProps } from "./index";

jest.mock("./styles", () => ({
    __esModule: true,
    default: jest.fn(() => ({})),
}));

const theme = createTheme();

describe("GlassInput Component: Invalid Prop Combinations", () => {
    it('should return null when kind is "radio" but no options are provided', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="radio"
                    type="text"
                    label="Radio without options"
                />
            </ThemeProvider>
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('should return null when kind is "select" but no options are provided', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="select"
                    type="text"
                    label="Select without options"
                />
            </ThemeProvider>
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("should return null for any other invalid kind", () => {
        const invalidProps = {
            kind: "dropdown",
            type: "text",
            label: "Invalid Kind",
        } as unknown as GlassInputProps;

        const { container } = render(
            <ThemeProvider theme={theme}>
                <GlassInput {...invalidProps} />
            </ThemeProvider>
        );

        expect(container).toBeEmptyDOMElement();
    });
});
