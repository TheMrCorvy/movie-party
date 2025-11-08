import { render, screen, fireEvent } from "@testing-library/react";
import BackgroundPatternPicker from "./index";
import { useBackground, patterns } from "../../context/BackgroundImageContext";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import { sendBackgroundPattern } from "../../services/roomBackgroundService";
import { PatternClass } from "@repo/type-definitions";

jest.mock("../../context/BackgroundImageContext", () => ({
    ...jest.requireActual("../../context/BackgroundImageContext"),
    useBackground: jest.fn(),
}));

jest.mock("../../context/RoomContext/RoomContextProvider", () => ({
    useRoom: jest.fn(),
}));

jest.mock("../../services/roomBackgroundService", () => ({
    sendBackgroundPattern: jest.fn(),
}));

const mockUseBackground = useBackground as jest.Mock;
const mockUseRoom = useRoom as jest.Mock;

describe("BackgroundPatternPicker Component", () => {
    beforeEach(() => {
        mockUseBackground.mockReturnValue({
            patternClass: PatternClass.ANAMA,
        });
        mockUseRoom.mockReturnValue({
            room: { id: "test-room-id", myId: "test-peer-id" },
            ws: { readyState: 1 },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render the background pattern picker", () => {
        render(<BackgroundPatternPicker />);
        expect(screen.getByText("Patrones de fondo")).toBeInTheDocument();
    });

    it("should render all available patterns", () => {
        render(<BackgroundPatternPicker />);
        const patternButtons = screen.getAllByRole("button");
        expect(patternButtons).toHaveLength(patterns.length);
    });

    it("should call sendBackgroundPattern with the correct parameters when a pattern is clicked", () => {
        render(<BackgroundPatternPicker />);
        const patternToSelect: PatternClass = PatternClass.WAVES;
        const patternButton = screen.getByTitle(patternToSelect);

        fireEvent.click(patternButton);

        expect(sendBackgroundPattern).toHaveBeenCalledWith({
            ws: { readyState: 1 },
            roomId: "test-room-id",
            peerId: "test-peer-id",
            pattern: patternToSelect,
        });
    });

    it("should highlight the selected pattern", () => {
        mockUseBackground.mockReturnValue({
            patternClass: PatternClass.SQUIGLY,
        });
        render(<BackgroundPatternPicker />);
        const selectedPatternButton = screen.getByTitle(PatternClass.SQUIGLY);
        expect(selectedPatternButton).toHaveAttribute("aria-pressed", "true");
    });
});
