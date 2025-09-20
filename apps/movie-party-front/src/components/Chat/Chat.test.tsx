// src/components/Chat/Chat.test.tsx

import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Chat from "./index";
import { useChatLogic } from "./useChatLogic";

// 1. Mock the custom hook `useChatLogic`
jest.mock("./useChatLogic");

// 2. Define a type for the mocked hook for type safety
const mockUseChatLogic = useChatLogic as jest.Mock;

// A basic theme to wrap the component, since it uses `useTheme`
const theme = createTheme({ palette: { mode: "dark" } });

describe("Chat Component", () => {
    beforeEach(() => {
        // Reset mocks before each test
        mockUseChatLogic.mockClear();
    });

    it("should render the list of messages provided by the hook", () => {
        // 3. Define the data we want our mocked hook to return for this test
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

        // 4. Assert that the messages are visible in the document
        expect(screen.getByText("Hello there!")).toBeInTheDocument();
        expect(screen.getByText("Hi, Alice!")).toBeInTheDocument();
    });

    it("should render SendMessage with the correct props from the hook", () => {
        const mockHandleSendMessage = jest.fn();
        const mockHandleInputChange = jest.fn();

        // 5. Provide a specific state for the input and mock handlers
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

        // Assert that the input field has the correct value passed down
        const inputElement = screen.getByPlaceholderText(
            "Escribe tu mensaje..."
        );
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveValue("A test message");
    });

    it("should display a message when the message list is empty", () => {
        mockUseChatLogic.mockReturnValue({
            messages: [], // Empty message array
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

        // We can check that no messages are rendered.
        // `queryBy...` is used because it returns `null` instead of throwing an error if not found.
        expect(screen.queryByText("Hello there!")).not.toBeInTheDocument();
    });
});
