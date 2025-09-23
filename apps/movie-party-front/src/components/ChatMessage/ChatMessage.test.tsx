import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ChatMessage from "./index";
import {
    generateAvatar,
    generateMUIAvatarProps,
} from "../../utils/avatarGenerator";
import { Message } from "@repo/type-definitions";

jest.mock("../../utils/avatarGenerator", () => ({
    generateAvatar: jest.fn(),
    generateMUIAvatarProps: jest.fn(),
}));

const mockGenerateAvatar = generateAvatar as jest.Mock;
const mockGenerateMUIAvatarProps = generateMUIAvatarProps as jest.Mock;

const theme = createTheme({ palette: { mode: "dark" } });

describe("ChatMessage Component", () => {
    beforeEach(() => {
        mockGenerateAvatar.mockClear();
        mockGenerateMUIAvatarProps.mockClear();
    });

    it("should render the message content and name correctly", () => {
        const mockMessage: Message = {
            id: "1",
            peerId: "2",
            peerName: "Jane Doe",
            message: "This is a test message.",
        };

        render(
            <ThemeProvider theme={theme}>
                <ChatMessage message={mockMessage} />
            </ThemeProvider>
        );

        expect(screen.getByText("Jane Doe")).toBeInTheDocument();
        expect(screen.getByText("This is a test message.")).toBeInTheDocument();
    });

    it('should call generateMUIAvatarProps when the message is from "Yo"', () => {
        const myMessage: Message = {
            id: "2",
            peerId: "3",
            peerName: "Yo",
            message: "This is my own message.",
        };

        mockGenerateMUIAvatarProps.mockReturnValue({
            children: "YO",
            sx: { bgcolor: "#FF6B6B" },
        });

        render(
            <ThemeProvider theme={theme}>
                <ChatMessage message={myMessage} />
            </ThemeProvider>
        );

        expect(generateMUIAvatarProps).toHaveBeenCalledWith("Yo");
        expect(generateMUIAvatarProps).toHaveBeenCalledTimes(1);

        expect(generateAvatar).not.toHaveBeenCalled();

        expect(screen.getByText("YO")).toBeInTheDocument();
    });

    it("should call generateAvatar when the message is from another user", () => {
        const otherUserMessage: Message = {
            id: "3",
            peerId: "4",
            peerName: "John Smith",
            message: "A message from another user.",
        };

        mockGenerateAvatar.mockReturnValue(
            "data:image/svg+xml,mock-avatar-url"
        );

        render(
            <ThemeProvider theme={theme}>
                <ChatMessage message={otherUserMessage} />
            </ThemeProvider>
        );

        expect(generateAvatar).toHaveBeenCalledWith({
            name: "John Smith",
            size: 40,
        });
        expect(generateAvatar).toHaveBeenCalledTimes(1);

        expect(generateMUIAvatarProps).not.toHaveBeenCalled();

        const avatarImage = screen.getByAltText("John Smith");
        expect(avatarImage).toHaveAttribute(
            "src",
            "data:image/svg+xml,mock-avatar-url"
        );
    });
});
