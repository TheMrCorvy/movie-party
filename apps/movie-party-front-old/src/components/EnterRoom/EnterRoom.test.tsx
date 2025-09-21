import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
    RoomContext,
    type RoomContextType,
} from "../../context/RoomContext/RoomContext";
import { Signals } from "@repo/type-definitions/rooms";
import CreateRoom from "./index";
import { type Socket } from "socket.io-client";

const theme = createTheme({ palette: { mode: "dark" } });

describe("CreateRoom Component", () => {
    it("should render a loading state when context is not available", () => {
        render(
            <ThemeProvider theme={theme}>
                <RoomContext.Provider value={null}>
                    <CreateRoom />
                </RoomContext.Provider>
            </ThemeProvider>
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it('should render the "Create Room" button when context is available', () => {
        const mockContextValue: RoomContextType = {
            ws: {
                emit: jest.fn(),
            } as unknown as Socket,
            me: undefined,
            stream: undefined,
            peers: {},
            shareScreen: jest.fn(),
            screenSharingId: "",
            myName: "",
            setMyName: jest.fn(),
        };

        render(
            <ThemeProvider theme={theme}>
                <RoomContext.Provider value={mockContextValue}>
                    <CreateRoom />
                </RoomContext.Provider>
            </ThemeProvider>
        );

        const createRoomButton = screen.getByRole("button", {
            name: /create room/i,
        });
        expect(createRoomButton).toBeInTheDocument();
    });

    it("should call ws.emit with CREATE_ROOM signal when the button is clicked", () => {
        const mockEmit = jest.fn();
        const mockContextValue: RoomContextType = {
            ws: {
                emit: mockEmit,
            } as unknown as Socket,
            me: undefined,
            stream: undefined,
            peers: {},
            shareScreen: jest.fn(),
            screenSharingId: "",
            myName: "",
            setMyName: jest.fn(),
        };

        render(
            <ThemeProvider theme={theme}>
                <RoomContext.Provider value={mockContextValue}>
                    <CreateRoom />
                </RoomContext.Provider>
            </ThemeProvider>
        );

        const createRoomButton = screen.getByRole("button", {
            name: /create room/i,
        });

        fireEvent.click(createRoomButton);

        expect(mockEmit).toHaveBeenCalledTimes(1);
        expect(mockEmit).toHaveBeenCalledWith(Signals.CREATE_ROOM);
    });
});
