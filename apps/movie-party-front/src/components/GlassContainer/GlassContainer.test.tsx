import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlassContainer from "./index";
import styles from "./styles";

jest.mock("./styles", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockStyles = styles as jest.Mock;

const theme = createTheme({ palette: { mode: "dark" } });

describe("GlassContainer Component", () => {
    beforeEach(() => {
        mockStyles.mockClear();
        mockStyles.mockReturnValue({
            containerStyles: {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                p: 2,
            },
        });
    });

    it("should render children correctly", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassContainer>
                    <p>Child content</p>
                </GlassContainer>
            </ThemeProvider>
        );

        expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("should call the styles function with the correct theme mode", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassContainer>Content</GlassContainer>
            </ThemeProvider>
        );

        expect(mockStyles).toHaveBeenCalledWith("dark");
        expect(mockStyles).toHaveBeenCalledTimes(1);
    });

    it("should apply default height and width when props are not provided", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassContainer>
                    <div>Default Size</div>
                </GlassContainer>
            </ThemeProvider>
        );

        const container = screen.getByText("Default Size").parentElement;
        expect(container).toHaveStyle("height: fit-content");
        expect(container).toHaveStyle("width: fit-content");
    });

    it("should apply custom height and width when props are provided", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassContainer height="500px" width="80%">
                    <div>Custom Size</div>
                </GlassContainer>
            </ThemeProvider>
        );

        const container = screen.getByText("Custom Size").parentElement;
        expect(container).toHaveStyle("height: 500px");
        expect(container).toHaveStyle("width: 80%");
    });

    it("should merge styles from the styles function with height and width", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassContainer height="100px" width="100px">
                    <div>Merged Styles</div>
                </GlassContainer>
            </ThemeProvider>
        );

        const container = screen.getByText("Merged Styles").parentElement;

        expect(container).toHaveStyle("background-color: rgba(0, 0, 0, 0.3)");

        expect(container).toHaveStyle("height: 100px");
    });
});
