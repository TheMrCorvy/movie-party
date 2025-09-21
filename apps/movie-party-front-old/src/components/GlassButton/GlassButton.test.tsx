import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlassButton from "./index";
import SendIcon from "@mui/icons-material/Send";

const theme = createTheme();

describe("GlassButton Component", () => {
    it("should render a standard MUI Button by default", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassButton onClick={jest.fn()}>Click Me</GlassButton>
            </ThemeProvider>
        );

        const button = screen.getByRole("button", { name: /click me/i });
        expect(button).toBeInTheDocument();

        expect(screen.queryByLabelText("Send message")).not.toBeInTheDocument();
    });

    it("should render an IconButton when isIconBtn is true", () => {
        render(
            <ThemeProvider theme={theme}>
                <GlassButton onClick={jest.fn()} isIconBtn>
                    <SendIcon />
                </GlassButton>
            </ThemeProvider>
        );

        const iconButton = screen.getByLabelText("Send message");
        expect(iconButton).toBeInTheDocument();
    });

    it("should call the onClick handler when the standard button is clicked", () => {
        const handleClick = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <GlassButton onClick={handleClick}>Click Me</GlassButton>
            </ThemeProvider>
        );

        const button = screen.getByRole("button", { name: /click me/i });
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should call the onClick handler when the icon button is clicked", () => {
        const handleClick = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <GlassButton onClick={handleClick} isIconBtn>
                    <SendIcon />
                </GlassButton>
            </ThemeProvider>
        );

        const iconButton = screen.getByLabelText("Send message");
        fireEvent.click(iconButton);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
