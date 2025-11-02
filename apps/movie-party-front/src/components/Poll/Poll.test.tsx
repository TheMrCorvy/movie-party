import { render, screen, fireEvent } from "@testing-library/react";
import Poll from "./index";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRoom } from "../../context/RoomContext/RoomContextProvider";
import {
    voteInPollService,
    listenPollUpdateService,
} from "../../services/pollService";
import { Poll as PollType } from "@repo/type-definitions";

jest.mock("../../context/RoomContext/RoomContextProvider", () => ({
    useRoom: jest.fn(),
}));

jest.mock("../../services/pollService", () => ({
    voteInPollService: jest.fn(),
    listenPollUpdateService: jest.fn(),
}));

const mockUseRoom = useRoom as jest.Mock;
const mockVoteInPollService = voteInPollService as jest.Mock;
const mockListenPollUpdateService = listenPollUpdateService as jest.Mock;

const theme = createTheme({ palette: { mode: "dark" } });

const mockPoll: PollType = {
    id: "poll-1",
    title: "What is your favorite color?",
    status: "live",
    options: [
        { id: "option-1", title: "Red", value: "red", votes: 0 },
        { id: "option-2", title: "Blue", value: "blue", votes: 2 },
    ],
    amountOfVotes: 2,
};

describe("Poll Component", () => {
    beforeEach(() => {
        mockUseRoom.mockReturnValue({
            ws: {},
            room: {
                id: "room-123",
                myId: "peer-123",
                messages: [],
            },
            dispatch: jest.fn(),
        });
        mockListenPollUpdateService.mockReturnValue(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render the poll with title and options", () => {
        render(
            <ThemeProvider theme={theme}>
                <Poll poll={mockPoll} />
            </ThemeProvider>
        );

        expect(
            screen.getByText("What is your favorite color?")
        ).toBeInTheDocument();
        expect(screen.getByText("Red")).toBeInTheDocument();
        expect(screen.getByText("Blue")).toBeInTheDocument();
        expect(screen.getByText("0")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("should call voteInPollService when an option is clicked", () => {
        render(
            <ThemeProvider theme={theme}>
                <Poll poll={mockPoll} />
            </ThemeProvider>
        );

        const redOption = screen.getByText("Red");
        fireEvent.click(redOption);

        expect(mockVoteInPollService).toHaveBeenCalledWith({
            ws: {},
            peerId: "peer-123",
            roomId: "room-123",
            pollOptionId: "option-1",
            pollId: "poll-1",
        });
    });

    it("should disable buttons after voting", () => {
        render(
            <ThemeProvider theme={theme}>
                <Poll poll={mockPoll} />
            </ThemeProvider>
        );

        const redOption = screen.getByText("Red");
        fireEvent.click(redOption);

        expect(screen.getByLabelText("Votar por Red")).toBeDisabled();
        expect(screen.getByLabelText("Votar por Blue")).toBeDisabled();
    });

    it("should not render if the poll status is not 'live'", () => {
        const closedPoll = { ...mockPoll, status: "ended" } as PollType;
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Poll poll={closedPoll} />
            </ThemeProvider>
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("should listen for poll updates", () => {
        render(
            <ThemeProvider theme={theme}>
                <Poll poll={mockPoll} />
            </ThemeProvider>
        );

        expect(mockListenPollUpdateService).toHaveBeenCalled();
    });
});
