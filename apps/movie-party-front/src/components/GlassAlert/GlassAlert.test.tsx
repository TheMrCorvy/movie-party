import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import GlassAlert from "./index";
import { ThemeProvider, createTheme } from "@mui/material/styles";

jest.useFakeTimers();

const theme = createTheme({ palette: { mode: "dark" } });

describe("GlassAlert Component", () => {
    it("should render with the correct title and variant", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassAlert
                    id="alert-1"
                    value="alert-1"
                    title="Success Alert"
                    variant="success"
                    openFromProps={true}
                />
            </ThemeProvider>
        );

        expect(screen.getByText("Success Alert")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveClass(
            "MuiAlert-outlinedSuccess"
        );
    });

    it("should call the callback when the close button is clicked", () => {
        const mockCallback = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <GlassAlert
                    id="alert-2"
                    value="alert-2"
                    title="Info Alert"
                    variant="info"
                    openFromProps={true}
                    callback={mockCallback}
                />
            </ThemeProvider>
        );

        const closeButton = screen.getByLabelText("close");
        fireEvent.click(closeButton);

        expect(mockCallback).toHaveBeenCalledWith({
            id: "alert-2",
            value: "alert-2",
        });
    });

    it("should auto-close after a timeout if no callback is provided", async () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GlassAlert
                    id="alert-3"
                    value="alert-3"
                    title="Warning Alert"
                    variant="warning"
                    openFromProps={true}
                />
            </ThemeProvider>
        );

        expect(screen.getByText("Warning Alert")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        await waitFor(() => {
            expect(container.querySelector("#alert-3")).toHaveClass(
                "MuiCollapse-hidden"
            );
        });
    });

    it("should render the description when provided", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassAlert
                    id="alert-4"
                    value="alert-4"
                    title="Error Alert"
                    variant="error"
                    openFromProps={true}
                    description="This is an error description."
                />
            </ThemeProvider>
        );

        expect(screen.getByText("Error Alert")).toBeInTheDocument();
        expect(
            screen.getByText("This is an error description.")
        ).toBeInTheDocument();
    });
});
