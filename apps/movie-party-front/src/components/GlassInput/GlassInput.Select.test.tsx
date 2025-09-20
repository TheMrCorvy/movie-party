import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlassInput from "./index";

jest.mock("./styles", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        selectFormControlStyles: { border: "1px solid green" },
        selectStyles: { backgroundColor: "grey" },
    })),
}));

const theme = createTheme();
const mockOptions = [
    { value: "item1", label: "Item 1" },
    { value: "item2", label: "Item 2" },
];

describe("GlassInput Component: Select", () => {
    it("should render a select dropdown with a label", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="select"
                    type="text"
                    label="Select an item"
                    value=""
                    id="my-select"
                    options={mockOptions}
                />
            </ThemeProvider>
        );

        const select = screen.getByRole("combobox", {
            name: /select an item/i,
        });
        expect(select).toBeInTheDocument();
    });

    it("should call onSelectChange when an option is selected", async () => {
        const handleSelectChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="select"
                    type="text"
                    label="Select an item"
                    options={mockOptions}
                    onSelectChange={handleSelectChange}
                />
            </ThemeProvider>
        );

        const selectButton = screen.getByRole("combobox");
        fireEvent.mouseDown(selectButton);

        const optionToSelect = await screen.findByRole("option", {
            name: "Item 2",
        });
        fireEvent.click(optionToSelect);

        expect(handleSelectChange).toHaveBeenCalledTimes(1);
    });

    it("should display the correct value in the select input", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassInput
                    kind="select"
                    type="text"
                    label="Select an item"
                    options={mockOptions}
                    value="item2"
                />
            </ThemeProvider>
        );

        expect(screen.getByRole("combobox")).toHaveTextContent("Item 2");
    });

    it("should not render if options are not provided", () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GlassInput kind="select" type="text" label="No Options" />
            </ThemeProvider>
        );

        expect(container).toBeEmptyDOMElement();
    });
});
