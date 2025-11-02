import { render, screen, fireEvent } from "@testing-library/react";
import GlassModal from "./index";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({ palette: { mode: "dark" } });

describe("GlassModal Component", () => {
    const mockClose = jest.fn();
    const mockAction1 = jest.fn();
    const mockAction2 = jest.fn();

    const modalActions = [
        { buttonLabel: "Action 1", callback: mockAction1 },
        { buttonLabel: "Action 2", callback: mockAction2 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render the modal with title and children when open is true", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassModal
                    open={true}
                    title="Test Modal"
                    closeModalWithoutCallback={mockClose}
                    modalActions={modalActions}
                >
                    <div>Modal Content</div>
                </GlassModal>
            </ThemeProvider>
        );

        expect(screen.getByText("Test Modal")).toBeInTheDocument();
        expect(screen.getByText("Modal Content")).toBeInTheDocument();
        expect(screen.getByText("Action 1")).toBeInTheDocument();
        expect(screen.getByText("Action 2")).toBeInTheDocument();
    });

    it("should not render the modal when open is false", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassModal
                    open={false}
                    title="Test Modal"
                    closeModalWithoutCallback={mockClose}
                    modalActions={modalActions}
                >
                    <div>Modal Content</div>
                </GlassModal>
            </ThemeProvider>
        );

        expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
        expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
    });

    it("should call the action callback when an action button is clicked", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassModal
                    open={true}
                    title="Test Modal"
                    closeModalWithoutCallback={mockClose}
                    modalActions={modalActions}
                >
                    <div>Modal Content</div>
                </GlassModal>
            </ThemeProvider>
        );

        fireEvent.click(screen.getByText("Action 1"));
        expect(mockAction1).toHaveBeenCalledTimes(1);
        expect(mockAction2).not.toHaveBeenCalled();
    });

    it("should render the description when provided", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassModal
                    open={true}
                    title="Test Modal"
                    closeModalWithoutCallback={mockClose}
                    modalActions={modalActions}
                    description="This is a test description."
                >
                    <div>Modal Content</div>
                </GlassModal>
            </ThemeProvider>
        );

        expect(
            screen.getByText("This is a test description.")
        ).toBeInTheDocument();
    });
});
