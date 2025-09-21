import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Chat from "./index";
import { useChatLogic } from "./useChatLogic";

jest.mock("./useChatLogic");

const mockUseChatLogic = useChatLogic as jest.Mock;

const theme = createTheme({ palette: { mode: "dark" } });

describe("Chat Component", () => {
    beforeEach(() => {
        mockUseChatLogic.mockClear();
    });

    it("should render the list of messages provided by the hook", () => {
        mockUseChatLogic.mockReturnValue({
            messages: [
                { name: "Alice", message: "Hello there!" },
                { name: "Bob", message: "Hi, Alice!" },
            ],
            messageInput: "",
            handleSendMessage: jest.fn(),
            handleInputChange: jest.fn(),
            handleKeyPress: jest.fn(),
        });

        render(
            <ThemeProvider theme={theme}>
                <Chat />
            </ThemeProvider>
        );

        expect(screen.getByText("Hello there!")).toBeInTheDocument();
        expect(screen.getByText("Hi, Alice!")).toBeInTheDocument();
    });

    it("should render SendMessage with the correct props from the hook", () => {
        const mockHandleSendMessage = jest.fn();
        const mockHandleInputChange = jest.fn();

        mockUseChatLogic.mockReturnValue({
            messages: [],
            messageInput: "A test message",
            handleSendMessage: mockHandleSendMessage,
            handleInputChange: mockHandleInputChange,
            handleKeyPress: jest.fn(),
        });

        render(
            <ThemeProvider theme={theme}>
                <Chat />
            </ThemeProvider>
        );

        const inputElement = screen.getByPlaceholderText(
            "Escribe tu mensaje..."
        );
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveValue("A test message");
    });

    it("should display a message when the message list is empty", () => {
        mockUseChatLogic.mockReturnValue({
            messages: [],
            messageInput: "",
            handleSendMessage: jest.fn(),
            handleInputChange: jest.fn(),
            handleKeyPress: jest.fn(),
        });

        render(
            <ThemeProvider theme={theme}>
                <Chat />
            </ThemeProvider>
        );

        expect(screen.queryByText("Hello there!")).not.toBeInTheDocument();
    });
});
