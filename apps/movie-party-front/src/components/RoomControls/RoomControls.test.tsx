import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import RoomControls from "./index";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { useBackground } from "../../context/BackgroundImageContext";
import { sendBackgroundPattern } from "../../services/roomBackgroundService";
import { copyToClipboard } from "../../utils/accessUserHardware";
import { PatternClass } from "@repo/type-definitions";

jest.mock("../../context/RoomContext/RoomContextProvider", () => ({
    useRoom: jest.fn(),
}));

jest.mock("../../context/BackgroundImageContext", () => ({
    ...jest.requireActual("../../context/BackgroundImageContext"),
    useBackground: jest.fn(),
}));

jest.mock("../../services/roomBackgroundService", () => ({
    sendBackgroundPattern: jest.fn(),
    uploadRoomBackground: jest.fn(),
}));

jest.mock("../../utils/accessUserHardware", () => ({
    copyToClipboard: jest.fn(),
}));

jest.mock("../GlassButton", () => ({
    __esModule: true,
    default: ({
        onClick,
        children,
        startIcon,
    }: {
        onClick: () => void;
        children: React.ReactNode;
        startIcon?: React.ReactNode;
    }) => (
        <button onClick={onClick}>
            {startIcon}
            {children}
        </button>
    ),
}));

const theme = createTheme({ palette: { mode: "dark" } });
const mockUseRoom = useRoom as jest.Mock;
const mockUseBackground = useBackground as jest.Mock;

describe("RoomControls Component", () => {
    beforeEach(() => {
        mockUseRoom.mockReturnValue({
            room: {
                id: "test-room",
                myId: "test-user",
                imRoomOwner: false,
                messages: [],
            },
            ws: {},
        });
        mockUseBackground.mockReturnValue({
            patternClass: "pattern-1",
        });
    });

    it("should trigger file input when 'Cambiar fondo de pantalla' is clicked", () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <RoomControls />
            </ThemeProvider>
        );

        const fileInput = container.querySelector('input[type="file"]');
        const clickSpy = jest.spyOn(fileInput as HTMLElement, "click");

        fireEvent.click(
            screen.getByRole("button", { name: /cambiar fondo de pantalla/i })
        );
        expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it("should call sendBackgroundPattern with default pattern when 'Resetear fondo de pantalla' is clicked", () => {
        render(
            <ThemeProvider theme={theme}>
                <RoomControls />
            </ThemeProvider>
        );

        fireEvent.click(
            screen.getByRole("button", { name: /resetear fondo de pantalla/i })
        );
        expect(sendBackgroundPattern).toHaveBeenCalledWith({
            ws: {},
            roomId: "test-room",
            peerId: "test-user",
            pattern: PatternClass.CUBES,
        });
    });

    it("should call copyToClipboard with the room link when 'Compartir sala' is clicked", () => {
        render(
            <ThemeProvider theme={theme}>
                <RoomControls />
            </ThemeProvider>
        );

        fireEvent.click(
            screen.getByRole("button", { name: /compartir sala/i })
        );
        expect(copyToClipboard).toHaveBeenCalledWith(
            expect.objectContaining({
                text: "http://localhost:5173/join-room/test-room",
            })
        );
    });

    it("should not render RoomPasswordUpdate if user is not the room owner", () => {
        render(
            <ThemeProvider theme={theme}>
                <RoomControls />
            </ThemeProvider>
        );
        expect(
            screen.queryByTestId("room-password-update")
        ).not.toBeInTheDocument();
    });
});
