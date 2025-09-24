import { renderHook, act } from "@testing-library/react";
import { useChatLogic } from "./useChatLogic";
import { RoomContextProvider } from "../../context/RoomContext/RoomContextProvider";
import { type ChangeEvent, type KeyboardEvent, ReactNode } from "react";

jest.mock("./generateMockMessages", () => ({
    generateMockMessages: jest.fn(() => [
        { name: "Mock User", message: "Initial mock message" },
    ]),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
    <RoomContextProvider>{children}</RoomContextProvider>
);

describe("useChatLogic Hook", () => {
    it("should initialize with default messages and empty input", () => {
        const { result } = renderHook(() => useChatLogic(), { wrapper });
        expect(result.current.messages).toEqual([]);
        expect(result.current.messageInput).toBe("");
    });

    it("should update messageInput when handleInputChange is called", () => {
        const { result } = renderHook(() => useChatLogic(), { wrapper });

        const mockEvent = {
            target: { value: "Hello" },
        } as ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handleInputChange(mockEvent);
        });

        expect(result.current.messageInput).toBe("Hello");
    });

    it("should add a new message and clear input when handleSendMessage is called with text", () => {
        const { result } = renderHook(() => useChatLogic(), {
            wrapper,
        });

        act(() => {
            result.current.setMessageInput("A new test message");
        });

        act(() => {
            result.current.handleSendMessage();
        });

        expect(result.current.messages.length).toBe(0);
        expect(result.current.messageInput).toBe("");
    });

    it("should not add a new message when handleSendMessage is called with empty or whitespace input", () => {
        const { result } = renderHook(() => useChatLogic(), { wrapper });

        act(() => {
            result.current.setMessageInput("   ");
        });

        act(() => {
            result.current.handleSendMessage();
        });

        expect(result.current.messages.length).toBe(0);

        expect(result.current.messageInput).toBe("   ");
    });

    it('should call handleSendMessage when handleKeyPress is called with "Enter"', () => {
        const { result } = renderHook(() => useChatLogic(), { wrapper });

        act(() => {
            result.current.setMessageInput("Message on enter");
        });

        const mockEvent = { key: "Enter" } as KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyPress(mockEvent);
        });

        expect(result.current.messages.length).toBe(0);
        expect(result.current.messageInput).toBe("");
    });

    it("should not call handleSendMessage when handleKeyPress is called with another key", () => {
        const { result } = renderHook(() => useChatLogic(), { wrapper });

        act(() => {
            result.current.setMessageInput("Some message");
        });

        const mockEvent = { key: "Shift" } as KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleKeyPress(mockEvent);
        });

        expect(result.current.messages.length).toBe(0);
        expect(result.current.messageInput).toBe("Some message");
    });
});
