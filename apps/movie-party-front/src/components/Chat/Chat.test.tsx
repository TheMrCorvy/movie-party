import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Chat from "./index";
import { useChatLogic } from "./useChatLogic";
import { MessageWithIndex, Poll } from "@repo/type-definitions";

jest.mock("./useChatLogic", () => ({
    useChatLogic: jest.fn(),
}));

jest.mock("../ChatMessage", () => ({
    __esModule: true,
    default: ({ message }: { message: MessageWithIndex }) => (
        <div data-testid="chat-message">{message.message}</div>
    ),
}));

jest.mock("../Poll", () => ({
    __esModule: true,
    default: ({ poll }: { poll: Poll }) => (
        <div data-testid="poll">{poll.title}</div>
    ),
}));

jest.mock("../SendMessage", () => ({
    __esModule: true,
    default: () => <div data-testid="send-message"></div>,
}));

const theme = createTheme({ palette: { mode: "dark" } });
const mockUseChatLogic = useChatLogic as jest.Mock;

describe("Chat Component", () => {
    it("should render messages in sorted order", () => {
        const messages: MessageWithIndex[] = [
            {
                id: "2",
                index: 2,
                message: "Second message",
                peerId: "peer2",
                peerName: "Peer Two",
            },
            {
                id: "1",
                index: 1,
                message: "First message",
                peerId: "peer1",
                peerName: "Peer One",
            },
        ];
        mockUseChatLogic.mockReturnValue({
            messages,
            myId: "my-id",
        });

        render(
            <ThemeProvider theme={theme}>
                <Chat />
            </ThemeProvider>
        );

        const renderedMessages = screen.getAllByTestId("chat-message");
        expect(renderedMessages[0]).toHaveTextContent("First message");
        expect(renderedMessages[1]).toHaveTextContent("Second message");
    });

    it("should render a Poll component for poll messages", () => {
        const messages: MessageWithIndex[] = [
            {
                id: "1",
                index: 1,
                message: "This is a poll",
                peerId: "peer1",
                peerName: "Peer One",
                isPoll: true,
                poll: {
                    id: "poll1",
                    title: "What is your favorite color?",
                    options: [],
                    amountOfVotes: 0,
                    status: "live",
                },
            },
        ];
        mockUseChatLogic.mockReturnValue({
            messages,
            myId: "my-id",
        });

        render(
            <ThemeProvider theme={theme}>
                <Chat />
            </ThemeProvider>
        );

        expect(screen.getByTestId("poll")).toHaveTextContent(
            "What is your favorite color?"
        );
    });

    it("should render a ChatMessage for regular messages", () => {
        const messages: MessageWithIndex[] = [
            {
                id: "1",
                index: 1,
                message: "Just a regular message",
                peerId: "peer1",
                peerName: "Peer One",
            },
        ];
        mockUseChatLogic.mockReturnValue({
            messages,
            myId: "my-id",
        });

        render(
            <ThemeProvider theme={theme}>
                <Chat />
            </ThemeProvider>
        );

        expect(screen.getByTestId("chat-message")).toHaveTextContent(
            "Just a regular message"
        );
    });
});
