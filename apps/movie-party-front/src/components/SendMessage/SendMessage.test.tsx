import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SendMessage from "./index";

jest.mock("../GlassInput", () => ({
    __esModule: true,
    default: (props: any) => <input data-testid="glass-input" {...props} />,
}));

jest.mock("../GlassButton", () => ({
    __esModule: true,
    default: (props: any) => <button data-testid="glass-button" {...props} />,
}));

const theme = createTheme({ palette: { mode: "dark" } });

describe("SendMessage Component", () => {
    it("should render the input field and send button", () => {
        render(
            <ThemeProvider theme={theme}>
                <SendMessage
                    messageInput=""
                    handleInputChange={jest.fn()}
                    handleKeyPress={jest.fn()}
                    handleSendMessage={jest.fn()}
                />
            </ThemeProvider>
        );

        expect(screen.getByTestId("glass-input")).toBeInTheDocument();
        expect(screen.getByTestId("glass-button")).toBeInTheDocument();
    });

    it("should pass the correct value to the GlassInput component", () => {
        const testMessage = "Hello, World!";
        render(
            <ThemeProvider theme={theme}>
                <SendMessage
                    messageInput={testMessage}
                    handleInputChange={jest.fn()}
                    handleKeyPress={jest.fn()}
                    handleSendMessage={jest.fn()}
                />
            </ThemeProvider>
        );

        const input = screen.getByTestId("glass-input");
        expect(input).toHaveValue(testMessage);
    });

    it("should call handleInputChange when the input value changes", () => {
        const handleInputChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SendMessage
                    messageInput=""
                    handleInputChange={handleInputChange}
                    handleKeyPress={jest.fn()}
                    handleSendMessage={jest.fn()}
                />
            </ThemeProvider>
        );

        const input = screen.getByTestId("glass-input");
        fireEvent.change(input, { target: { value: "new text" } });

        expect(handleInputChange).toHaveBeenCalledTimes(1);
    });

    it("should call handleKeyPress when a key is pressed in the input", () => {
        const handleKeyPress = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SendMessage
                    messageInput=""
                    handleInputChange={jest.fn()}
                    handleKeyPress={handleKeyPress}
                    handleSendMessage={jest.fn()}
                />
            </ThemeProvider>
        );

        const input = screen.getByTestId("glass-input");
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        expect(handleKeyPress).toHaveBeenCalledTimes(1);
    });

    it("should call handleSendMessage when the send button is clicked", () => {
        const handleSendMessage = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SendMessage
                    messageInput=""
                    handleInputChange={jest.fn()}
                    handleKeyPress={jest.fn()}
                    handleSendMessage={handleSendMessage}
                />
            </ThemeProvider>
        );

        const button = screen.getByTestId("glass-button");
        fireEvent.click(button);

        expect(handleSendMessage).toHaveBeenCalledTimes(1);
    });
});
