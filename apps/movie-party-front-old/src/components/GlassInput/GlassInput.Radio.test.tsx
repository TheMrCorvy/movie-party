import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlassInput from "./index";

jest.mock("./styles", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        radioStyles: { color: "blue" },
    })),
}));

const theme = createTheme();
const mockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
];

describe("GlassInput Component: Radio", () => {
    it("should render a radio button group with a legend and options", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="radio"
                    type="text"
                    label="Choose an option"
                    options={mockOptions}
                />
            </ThemeProvider>
        );

        expect(screen.getByText("Choose an option")).toBeInTheDocument();

        expect(
            screen.getByRole("radio", { name: "Option 1" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("radio", { name: "Option 2" })
        ).toBeInTheDocument();
    });

    it("should select the correct radio button based on the value prop", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="radio"
                    type="text"
                    label="Choose an option"
                    options={mockOptions}
                    value="option2"
                    onChange={jest.fn()}
                />
            </ThemeProvider>
        );

        const radioOption1 = screen.getByRole("radio", { name: "Option 1" });
        const radioOption2 = screen.getByRole("radio", { name: "Option 2" });

        expect(radioOption1).not.toBeChecked();
        expect(radioOption2).toBeChecked();
    });

    it("should call onChange when a radio button is selected", () => {
        const handleChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="radio"
                    type="text"
                    label="Choose an option"
                    options={mockOptions}
                    onChange={handleChange}
                />
            </ThemeProvider>
        );

        const radioOption2 = screen.getByRole("radio", { name: "Option 2" });
        fireEvent.click(radioOption2);

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should not render if options are not provided", () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GlassInput kind="radio" type="text" label="No Options" />
            </ThemeProvider>
        );

        expect(container).toBeEmptyDOMElement();
    });
});
